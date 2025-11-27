import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trophy, Calendar, Target, Zap, 
  BarChart3, CheckCircle2, CircleDashed, Lock
} from 'lucide-react';

const LeaderboardPage = () => {
  const { user, getStudentStats } = useAuth();
  const navigate = useNavigate();
  
  const stats = useMemo(() => getStudentStats(), [getStudentStats, user]);
  
  if (!user) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
            <div className="text-center max-w-md bg-white p-10 rounded-[2rem] shadow-2xl shadow-gray-200/50">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Access Restricted</h2>
                <p className="text-gray-500 mb-8 font-medium">You need to be logged in to view your progress history and efficiency statistics.</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => navigate('/')} className="px-8 py-3 border-2 border-gray-100 rounded-xl text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all">Go Home</button>
                    <button onClick={() => navigate('/login')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all">Login</button>
                </div>
            </div>
        </div>
    )
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Syllabus
          </button>
          <div className="text-right">
             <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Student ID</p>
             <p className="text-lg font-bold text-gray-900">{user.username}</p>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
          {/* Abstract blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.03] rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black mb-4 flex items-center gap-4 tracking-tight">
                Performance Matrix <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
              </h1>
              <p className="text-indigo-200 max-w-xl text-lg font-medium leading-relaxed">
                Tracking your cognitive resonance with the syllabus. Efficiency is derived from your highest performance across unique topics.
              </p>
            </div>
            
            <div className="flex items-center gap-8 bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 shadow-xl">
              <div className="text-center">
                 <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2">Efficiency</p>
                 <div className="text-6xl font-black text-white flex items-start justify-center tracking-tighter">
                    {stats.efficiency}<span className="text-3xl mt-1 text-indigo-400">%</span>
                 </div>
              </div>
              <div className="h-16 w-px bg-white/10"></div>
              <div className="text-center">
                 <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2">Topics Mastered</p>
                 <div className="text-6xl font-black text-white tracking-tighter">
                    {stats.uniqueTopicsCount}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Subject Progress (Takes up 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <Target className="w-6 h-6 text-indigo-600" /> Syllabus Coverage
            </h2>
            
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-10">
              {Object.entries(stats.subjectProgress).map(([key, subject]) => (
                <div key={key}>
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <h3 className={`font-extrabold text-xl ${subject.color}`}>{subject.title}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                        {subject.remaining} topics remaining
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-gray-900">{subject.percentComplete}%</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="h-5 w-full bg-gray-50 rounded-full overflow-hidden flex shadow-inner ring-1 ring-gray-100">
                    {/* Filled Part */}
                    <div 
                      className={`h-full ${subject.bgColor.replace('bg-', 'bg-')} ${subject.color.replace('text-', 'bg-')} transition-all duration-1000 ease-out`}
                      style={{ width: `${subject.percentComplete}%` }}
                    />
                  </div>
                  
                  {/* Stats Mini Bar */}
                  <div className="flex justify-between mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3"/> {subject.completed} Done</span>
                     <span className="flex items-center gap-1.5"><CircleDashed className="w-3 h-3"/> {subject.total} Total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Activity History */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" /> Recent Attempts
            </h2>
            
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              {stats.history.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-bold">No quizzes taken yet.</p>
                  <button onClick={() => navigate('/')} className="mt-6 text-indigo-600 font-black hover:text-indigo-700 underline underline-offset-4 decoration-2">Start Learning</button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {stats.history.map((attempt) => (
                    <div key={attempt.id} className="p-6 hover:bg-gray-50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {decodeURIComponent(attempt.topic)}
                            </h4>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider mt-1">{attempt.subjectName}</p>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide ${attempt.percentage >= 80 ? 'bg-emerald-100 text-emerald-700' : attempt.percentage >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                           {attempt.percentage}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mt-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(attempt.date).toLocaleDateString()}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500">{attempt.score}/{attempt.total} Correct</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;


