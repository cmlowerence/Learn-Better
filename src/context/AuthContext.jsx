import React, { createContext, useState, useContext, useEffect } from 'react';
import { syllabusData } from '../syllabusData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Initialize: Check if user is already logged in on this device
  useEffect(() => {
    const storedUser = localStorage.getItem('tgt_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 2. Login: Connect to Vercel Database
  const login = async (username, passkey) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passkey }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // A. Create Session Object
        const userData = { 
          username: data.user.username, 
          role: data.user.role,
          avatarId: data.user.avatarId || 'student', // Default avatar
          loginTime: new Date().toISOString() 
        };
        
        // B. Update State
        setUser(userData);
        localStorage.setItem('tgt_current_user', JSON.stringify(userData));

        // C. SYNC: Restore History from Database to LocalStorage
        // This ensures your charts/graphs work immediately across devices
        if (data.user.quiz_history) {
           localStorage.setItem(`tgt_detailed_history_${userData.username}`, JSON.stringify(data.user.quiz_history));
        }
        if (data.user.quiz_progress) {
           localStorage.setItem(`tgt_progress_${userData.username}`, JSON.stringify(data.user.quiz_progress));
        }

        return true;
      } else {
        console.error("Login failed:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Network error during login:", error);
      return false;
    }
  };

  // 3. Logout: Clear Session
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tgt_current_user');
    // Optional: Clear history from local device on logout for privacy
    // localStorage.removeItem(`tgt_detailed_history_${user?.username}`);
    // localStorage.removeItem(`tgt_progress_${user?.username}`);
  };

  // 4. Save Result: LocalStorage (Fast) + Database (Backup)
  const saveQuizResult = async (topic, score, total, questions = [], userAnswers = {}) => {
      if (!user) return;
      
      // --- PART A: LOGIC TO IDENTIFY SUBJECT (Existing Logic) ---
      let subjectKey = 'unknown';
      let subjectName = 'General';
      
      Object.entries(syllabusData).forEach(([examKey, examData]) => {
         const subjects = examData.subjects || { [examKey]: examData }; 
         Object.entries(subjects).forEach(([subKey, subData]) => {
             if (subData.sections) {
                 subData.sections.forEach(section => {
                     if (section.topics.includes(topic) || section.title === topic) {
                         subjectKey = subKey;
                         subjectName = subData.title;
                     }
                 });
             }
         });
      });

      // --- PART B: UPDATE LOCAL STORAGE (Immediate Feedback) ---
      
      // Update Summary
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
      const updatedSummary = [newSummaryEntry, ...currentSummary];
      localStorage.setItem(summaryKey, JSON.stringify(updatedSummary));

      // Update Detailed History
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

      // Limit to last 20 attempts per subject to keep DB small
      const subjectEntries = detailedHistory.filter(entry => entry.subjectKey === subjectKey);
      if (subjectEntries.length > 20) {
        // Keep the newest 20
        const keptEntries = detailedHistory.filter(entry => entry.subjectKey !== subjectKey); // Keep other subjects
        const sortedSubjectEntries = subjectEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);
        detailedHistory = [...keptEntries, ...sortedSubjectEntries];
      }
      localStorage.setItem(detailedKey, JSON.stringify(detailedHistory));

      // --- PART C: SYNC TO SERVER (Background Backup) ---
      try {
        await fetch('/api/save_progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.username,
            history: detailedHistory, // Send full updated arrays
            progress: updatedSummary
          }),
        });
      } catch (err) {
        console.error("Failed to sync progress to cloud:", err);
        // It's okay if this fails; data is still safe in LocalStorage!
      }
  };

  // 5. Get Stats (Reads from LocalStorage, which is now synced)
  const getStudentStats = () => {
    if (!user) return null;
    
    const summaryKey = `tgt_progress_${user.username}`;
    const detailedKey = `tgt_detailed_history_${user.username}`;
    
    const history = JSON.parse(localStorage.getItem(summaryKey) || '[]');
    const detailedHistory = JSON.parse(localStorage.getItem(detailedKey) || '[]');

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
  
  // 6. Save Mistakes (Local Only for now, can be upgraded later)
  const saveMistakes = (questions, userAnswers, topic) => {
    if (!questions || !userAnswers) return;

    const mistakes = questions
      .map((q, index) => ({
        ...q, 
        userSelected: userAnswers[index],
        originTopic: topic,
        savedAt: new Date().toISOString()
      }))
      .filter((q, index) => userAnswers[index] !== q.correctIndex); 

    if (mistakes.length === 0) return;
    const existing = JSON.parse(localStorage.getItem('mistake_bin') || '[]');
    const updated = [...existing, ...mistakes];
    localStorage.setItem('mistake_bin', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        logout, 
        saveQuizResult, 
        getStudentStats, 
        saveMistakes, 
        loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
