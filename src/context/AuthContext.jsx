import React, { createContext, useState, useContext, useEffect } from 'react';
import { ALLOWED_USERS } from '../data/users'; 
import { syllabusData } from '../syllabusData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('tgt_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, passkey) => {
    const foundUser = ALLOWED_USERS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.passkey === passkey
    );

    if (foundUser) {
      const savedProfileKey = `tgt_profile_${foundUser.username}`;
      const savedProfile = JSON.parse(localStorage.getItem(savedProfileKey) || '{}');

      const userData = { 
        ...foundUser, 
        ...savedProfile, 
        loginTime: new Date().toISOString() 
      };
      
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

  const updateProfile = (updates) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    localStorage.setItem('tgt_current_user', JSON.stringify(updatedUser));
    
    const savedProfileKey = `tgt_profile_${user.username}`;
    const currentSaved = JSON.parse(localStorage.getItem(savedProfileKey) || '{}');
    localStorage.setItem(savedProfileKey, JSON.stringify({ ...currentSaved, ...updates }));
  };

  const saveQuizResult = (topic, score, total, questions = [], userAnswers = {}) => {
      if (!user) return;
      
      // 1. Identify Subject
      let subjectKey = 'unknown';
      let subjectName = 'General';
      
      // Scan syllabusData to find which subject this topic belongs to
      Object.entries(syllabusData).forEach(([examKey, examData]) => {
         // Check if syllabusData structure is nested (Exam -> Subjects) or flat
         const subjects = examData.subjects || { [examKey]: examData }; 
         
         Object.entries(subjects).forEach(([subKey, subData]) => {
             if (subData.sections) {
                 subData.sections.forEach(section => {
                     if (section.topics.includes(topic) || section.title === topic) {
                         subjectKey = subKey; // e.g., 'physics' or 'pocso'
                         subjectName = subData.title;
                     }
                 });
             }
         });
      });

      // 2. Update Simple Progress Summary
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

      // 3. Update Detailed History
      const detailedKey = `tgt_detailed_history_${user.username}`;
      let detailedHistory = JSON.parse(localStorage.getItem(detailedKey) || '[]');
      
      const newDetailedEntry = { 
        id: Date.now(), 
        timestamp: new Date().toISOString(), 
        topic, 
        subjectKey, 
        score, 
        total, 
        questions, 
        userAnswers 
      };
      detailedHistory.push(newDetailedEntry);

      // Keep only last 10 detailed attempts per subject to save space
      const subjectEntries = detailedHistory.filter(entry => entry.subjectKey === subjectKey);
      if (subjectEntries.length > 10) {
        subjectEntries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const itemsToRemoveCount = subjectEntries.length - 10;
        const idsToRemove = subjectEntries.slice(0, itemsToRemoveCount).map(e => e.id);
        detailedHistory = detailedHistory.filter(entry => !idsToRemove.includes(entry.id));
      }
      localStorage.setItem(detailedKey, JSON.stringify(detailedHistory));
  };

  const getStudentStats = () => {
    if (!user) return null;
    
    const summaryKey = `tgt_progress_${user.username}`;
    const detailedKey = `tgt_detailed_history_${user.username}`;
    
    const history = JSON.parse(localStorage.getItem(summaryKey) || '[]');
    const detailedHistory = JSON.parse(localStorage.getItem(detailedKey) || '[]');

    // Calculate best score per topic
    const bestScoresByTopic = {};
    history.forEach(attempt => {
      if (!bestScoresByTopic[attempt.topic] || attempt.percentage > bestScoresByTopic[attempt.topic]) {
        bestScoresByTopic[attempt.topic] = attempt.percentage;
      }
    });

    const uniqueTopicsAttempted = Object.keys(bestScoresByTopic).length;
    const totalEfficiencyScore = Object.values(bestScoresByTopic).reduce((a, b) => a + b, 0);
    const averageEfficiency = uniqueTopicsAttempted > 0 ? Math.round(totalEfficiencyScore / uniqueTopicsAttempted) : 0;

    const subjectProgress = {};
    
    // We iterate over the currently active exam data or all data. 
    // Ideally this logic should adapt to the selected Exam Tab, but here we aggregate everything.
    Object.values(syllabusData).forEach((examData) => {
        const subjects = examData.subjects || {};
        Object.entries(subjects).forEach(([key, data]) => {
            const allTopics = data.sections ? data.sections.flatMap(s => s.topics) : [];
            const totalTopics = allTopics.length;
            
            const attemptedTopics = allTopics.filter(t => bestScoresByTopic[t] !== undefined);
            const completedCount = attemptedTopics.length;
            
            const subjectSpecificHistory = detailedHistory
                .filter(h => h.subjectKey === key)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            subjectProgress[key] = { 
                title: data.title, 
                total: totalTopics, 
                completed: completedCount, 
                remaining: totalTopics - completedCount, 
                percentComplete: totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0, 
                color: data.color, 
                bgColor: data.bgColor, 
                recentAttempts: subjectSpecificHistory 
            };
        });
    });

    return { history, efficiency: averageEfficiency, uniqueTopicsCount: uniqueTopicsAttempted, subjectProgress };
  };
  
  const saveMistakes = (questions, userAnswers, topic) => {
    if (!questions || !userAnswers) return;

    const mistakes = questions
      .map((q, index) => ({
        ...q, 
        userSelected: userAnswers[index],
        originTopic: topic,
        savedAt: new Date().toISOString()
      }))
      .filter((q, index) => userAnswers[index] !== q.correctIndex); // Only keep wrong ones

    if (mistakes.length === 0) return;

    // Get existing mistakes from LocalStorage
    const existing = JSON.parse(localStorage.getItem('mistake_bin') || '[]');
    
    // Combine new mistakes with existing ones
    const updated = [...existing, ...mistakes];
    
    localStorage.setItem('mistake_bin', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        logout, 
        updateProfile, 
        saveQuizResult, 
        getStudentStats, 
        saveMistakes, // EXPORTED HERE
        loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
