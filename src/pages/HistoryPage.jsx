import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, BookOpen, AlertCircle } from 'lucide-react';
import QuizHistoryViewer from '../components/quiz/QuizHistoryViewer'; 

const HistoryPage = () => {
  const { user, getStudentStats } = useAuth();
  const navigate = useNavigate();
  
  const stats = useMemo(() => user ? getStudentStats() : null, [user, getStudentStats]);
  const [activeTab, setActiveTab] = useState(stats ? Object.keys(stats.subjectProgress)[0] : '');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Login</button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/leaderboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" /> Attempt History
            </h1>
            <p className="text-xs text-gray-400 font-medium">Review your last 10 quizzes per subject</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex overflow-x-auto pb-4 mb-4 gap-3 no-scrollbar">
          {Object.entries(stats.subjectProgress).map(([key, subject]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold whitespace-nowrap transition-all ${
                activeTab === key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activeTab === key ? 'text-indigo-300' : 'text-gray-400'}`} />
              {subject.title}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm min-h-[500px] p-2 sm:p-6">
          {activeTab && stats.subjectProgress[activeTab] ? (
            <QuizHistoryViewer recentAttempts={stats.subjectProgress[activeTab].recentAttempts} subjectTitle={stats.subjectProgress[activeTab].title} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400"><p>Select a subject to view history.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
