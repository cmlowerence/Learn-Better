import React, { createContext, useState, useContext, useEffect } from 'react';
import { ALLOWED_USERS } from '../data/users';
import { syllabusData } from '../syllabusData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from local storage on boot
  useEffect(() => {
    const storedUser = localStorage.getItem('tgt_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- ACTIONS ---

  const login = (username, passkey) => {
    const foundUser = ALLOWED_USERS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.passkey === passkey
    );

    if (foundUser) {
      const userData = { ...foundUser, loginTime: new Date().toISOString() };
      setUser(userData);
      localStorage.setItem('tgt_current_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tgt_current_user');
  };

  // UPDATED: Now accepts questions and userAnswers
  const saveQuizResult = (topic, score, total, questions = [], userAnswers = {}) => {
    if (!user) return;
    
    // 1. Identify Subject
    let subjectKey = 'unknown';
    let subjectName = 'General';
    
    Object.entries(syllabusData).forEach(([key, data]) => {
      data.sections.forEach(section => {
        if (section.topics.includes(topic) || section.title === topic) {
          subjectKey = key;
          subjectName = data.title;
        }
      });
    });

    // 2. Save Summary Stats (For Graphs - Keep All)
    const summaryKey = `tgt_progress_${user.username}`;
    const currentSummary = JSON.parse(localStorage.getItem(summaryKey) || '[]');

    const newSummaryEntry = {
      id: Date.now(),
      topic,
      subjectKey,
      subjectName,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      date: new Date().toISOString()
    };
    
    localStorage.setItem(summaryKey, JSON.stringify([newSummaryEntry, ...currentSummary]));

    // 3. Save Detailed History (For Revision - Last 10 Per Subject)
    const detailedKey = `tgt_detailed_history_${user.username}`;
    let detailedHistory = JSON.parse(localStorage.getItem(detailedKey) || '[]');

    const newDetailedEntry = {
      id: Date.now(), // Unique ID
      timestamp: new Date().toISOString(),
      topic,
      subjectKey, // Important for filtering
      score,
      total,
      questions,    // Full question data
      userAnswers   // User choices
    };

    // Add new entry
    detailedHistory.push(newDetailedEntry);

    // Filter logic: Enforce Max 10 per Subject
    const subjectEntries = detailedHistory.filter(entry => entry.subjectKey === subjectKey);
    
    if (subjectEntries.length > 10) {
      // Sort by timestamp (oldest first)
      subjectEntries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      // Calculate how many to remove
      const itemsToRemoveCount = subjectEntries.length - 10;
      const idsToRemove = subjectEntries.slice(0, itemsToRemoveCount).map(e => e.id);
      
      // Remove oldest entries for this subject from main array
      detailedHistory = detailedHistory.filter(entry => !idsToRemove.includes(entry.id));
    }

    localStorage.setItem(detailedKey, JSON.stringify(detailedHistory));
  };

  // --- STATISTICS ENGINE ---

  const getStudentStats = () => {
    if (!user) return null;
    const storageKey = `tgt_progress_${user.username}`;
    const history = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // 1. Calculate Overall Efficiency 
    const bestScoresByTopic = {};
    history.forEach(attempt => {
      if (!bestScoresByTopic[attempt.topic] || attempt.percentage > bestScoresByTopic[attempt.topic]) {
        bestScoresByTopic[attempt.topic] = attempt.percentage;
      }
    });

    const uniqueTopicsAttempted = Object.keys(bestScoresByTopic).length;
    const totalEfficiencyScore = Object.values(bestScoresByTopic).reduce((a, b) => a + b, 0);
    const averageEfficiency = uniqueTopicsAttempted > 0 
      ? Math.round(totalEfficiencyScore / uniqueTopicsAttempted) 
      : 0;

    // 2. Calculate Subject-wise Progress
    const subjectProgress = {};
    
    Object.entries(syllabusData).forEach(([key, data]) => {
      const allTopics = data.sections.flatMap(s => s.topics);
      const totalTopics = allTopics.length;
      
      const attemptedTopics = allTopics.filter(t => bestScoresByTopic[t] !== undefined);
      const completedCount = attemptedTopics.length;
      
      subjectProgress[key] = {
        title: data.title,
        total: totalTopics,
        completed: completedCount,
        remaining: totalTopics - completedCount,
        percentComplete: totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0,
        color: data.color,
        bgColor: data.bgColor
      };
    });

    return {
      history,
      efficiency: averageEfficiency,
      uniqueTopicsCount: uniqueTopicsAttempted,
      subjectProgress
    };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, saveQuizResult, getStudentStats, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
