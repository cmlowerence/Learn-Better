import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO'; 
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, BookOpen, AlertCircle } from 'lucide-react';
import QuizHistoryViewer from '../components/quiz/QuizHistoryViewer'; 

const HistoryPage = () => {
  const { user, getStudentStats } = useAuth();
  const navigate = useNavigate();
  
  const stats = useMemo(() => user ? getStudentStats() : null, [user, getStudentStats]);
  
  // Default to first subject or empty string
  const [activeTab, setActiveTab] = useState(stats && stats.subjectProgress ? Object.keys(stats.subjectProgress)[0] : '');

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <SEO 
        title="Quiz History" 
        description="Review your past quiz attempts and answers for HPRCA TGT preparation." 
      />
      
      {/* --- FIXED HEADER CONTAINER START --- */}
      {/* Changed to 'fixed' to ensure it stays on top. Added z-40 to layer above content. */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
            
            {/* Top Row: Navigation & Title */}
            <div className="flex items-center gap-4 mb-4">
                <button onClick={() => navigate('/leaderboard')} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-500" /> Attempt History
                    </h1>
                    <p className="text-xs text-gray-400 font-medium hidden sm:block">Review your last 10 quizzes per subject</p>
                </div>
            </div>

            {/* Bottom Row: Subject Tabs */}
            <div className="flex overflow-x-auto pb-0 gap-2 no-scrollbar -mb-px">
            {Object.entries(stats.subjectProgress).map(([key, subject]) => {
                const isActive = activeTab === key;
                return (
                    <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-all text-sm ${
                        isActive 
                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-t-lg'
                    }`}
                    >
                    <BookOpen className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {subject.title}
                    </button>
                );
            })}
            </div>
        </div>
      </div>
      {/* --- FIXED HEADER CONTAINER END --- */}

      {/* --- MAIN CONTENT START --- */}
      {/* Added 'pt-[160px]' (padding-top) to push content down so it starts below the fixed header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 pt-[160px] sm:pt-[150px]">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm min-h-[500px] p-2 sm:p-6">
          {activeTab && stats.subjectProgress[activeTab] ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <QuizHistoryViewer recentAttempts={stats.subjectProgress[activeTab].recentAttempts} subjectTitle={stats.subjectProgress[activeTab].title} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400"><p>Select a subject to view history.</p></div>
          )}
        </div>
      </div>
      {/* --- MAIN CONTENT END --- */}

    </div>
  );
};

export default HistoryPage;
