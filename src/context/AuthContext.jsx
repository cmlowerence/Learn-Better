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

  const saveQuizResult = (topic, score, total) => {
    // If guest, do not save to persistent storage
    if (!user) return;
    
    const storageKey = `tgt_progress_${user.username}`;
    const currentHistory = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Reverse lookup to find which subject this topic belongs to
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

    const newEntry = {
      id: Date.now(),
      topic,
      subjectKey,
      subjectName,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      date: new Date().toISOString()
    };
    
    const updatedHistory = [newEntry, ...currentHistory];
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
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
      // Flatten all topics for this subject
      const allTopics = data.sections.flatMap(s => s.topics);
      const totalTopics = allTopics.length;
      
      // Find which of these topics have been attempted by user
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