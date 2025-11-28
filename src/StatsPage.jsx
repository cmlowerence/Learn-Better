import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, PieChart, TrendingUp, BookOpen, 
  Activity, AlertCircle, Award 
} from 'lucide-react';
import QuizHistoryViewer from './components/quiz/QuizHistoryViewer';

const StatsPage = () => {
  const { user, getStudentStats } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      const data = getStudentStats();
      setStats(data);
    }
  }, [user, getStudentStats]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Mode</h2>
          <p className="text-gray-500 mb-6">You need to log in to view your detailed progress history.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-500" /> Your Progress
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <Activity className="w-5 h-5" /> Overall Efficiency
            </div>
            <div className="text-4xl font-black">{stats.efficiency}%</div>
            <p className="text-sm opacity-80 mt-2">Average score across all quizzes</p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-gray-500 font-medium">
              <Award className="w-5 h-5 text-orange-500" /> Topics Mastered
            </div>
            <div className="text-4xl font-black text-gray-900">{stats.uniqueTopicsCount}</div>
            <p className="text-sm text-gray-400 mt-2">Unique topics attempted</p>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Subject Details
          </h2>
          
          <div className="grid gap-6">
            {Object.entries(stats.subjectProgress).map(([key, subject]) => (
              <div key={key} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{subject.title}</h3>
                      <p className="text-sm text-gray-500">
                        {subject.completed} / {subject.total} Topics Covered
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-${subject.color.split('-')[1]}-100 text-${subject.color.split('-')[1]}-700`}>
                      {subject.percentComplete}% Complete
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${subject.bgColor.replace('bg-', 'bg-gradient-to-r from-').replace('100', '500')} to-${subject.color.split('-')[1]}-600`}
                      style={{ width: `${subject.percentComplete}%` }}
                    />
                  </div>
                </div>

                {/* THE CONNECTION: QuizHistoryViewer Integration */}
                <div className="bg-gray-50/30 p-2 sm:p-4">
                  <QuizHistoryViewer 
                    recentAttempts={subject.recentAttempts} 
                    subjectTitle={subject.title} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;

