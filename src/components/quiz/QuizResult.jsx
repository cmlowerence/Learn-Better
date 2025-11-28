import React from 'react';
import MathText from '../MathText';
import { 
  CheckCircle, XCircle, RefreshCw, Trophy, BookOpen, 
  Sparkles, Volume2, VolumeX, LogIn, Search, Bot, MessageSquare, MicOff
} from 'lucide-react';

const QuizResult = ({ 
  questions, 
  userAnswers, 
  score, 
  topic, 
  user, 
  onRestart, 
  onNavigate, 
  onAskAI,
  ttsState, 
  onSpeak 
}) => {
  const percentage = Math.round((score / questions.length) * 100);
  const isPass = percentage >= 40;

  const AudioIcon = ({ id }) => {
     if (ttsState.audioErrorId === id) return <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
     if (ttsState.activeAudioId === id) return <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />;
     return <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
          {/* Score Card */}
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-gray-100 overflow-hidden mb-8 sm:mb-12 text-center relative border border-gray-100">
              <div className={`h-3 w-full ${isPass ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`} />
              <div className="p-8 sm:p-16">
                  <div className="inline-block p-4 sm:p-6 rounded-full bg-gray-50 mb-6 sm:mb-8 shadow-inner ring-8 ring-gray-50">
                      <Trophy className={`w-12 h-12 sm:w-16 sm:h-16 ${isPass ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'}`} />
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">{isPass ? 'Great Job!' : 'Keep Practicing!'}</h2>
                  <p className="text-gray-500 mb-8 sm:mb-10 text-sm sm:text-lg font-medium px-4">
                    {user 
                      ? <span className="flex flex-col sm:flex-row items-center justify-center gap-2">Progress saved for <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{decodeURIComponent(topic)}</span></span> 
                      : "You are in Guest Mode. Login to save this score!"}
                  </p>
                  <div className="flex justify-center items-baseline gap-2 sm:gap-3 mb-8 sm:mb-12">
                      <span className={`text-6xl sm:text-8xl font-black leading-none tracking-tighter ${isPass ? 'text-emerald-500' : 'text-orange-500'}`}>{percentage}%</span>
                      <span className="text-lg sm:text-2xl text-gray-400 font-bold">({score}/{questions.length})</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">
                      <button onClick={onRestart} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 sm:px-10 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                          <RefreshCw className="w-5 h-5" /> Try Another Quiz
                      </button>
                      {user ? (
                         <button onClick={() => onNavigate('/leaderboard')} className="w-full sm:w-auto px-8 sm:px-10 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 font-bold transition-all">
                             View Statistics
                         </button>
                      ) : (
                         <button onClick={() => onNavigate('/login')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 sm:px-10 py-4 border-2 border-indigo-100 text-indigo-600 rounded-2xl hover:bg-indigo-50 font-bold transition-all">
                             <LogIn className="w-5 h-5" /> Login to Save
                         </button>
                      )}
                  </div>
              </div>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 px-2 sm:px-4 flex items-center gap-3"><BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" /> Answer Review</h3>
              <div className="grid gap-6 sm:gap-8">
                  {questions.map((q, idx) => {
                      const isCorrect = userAnswers[idx] === q.correctIndex;
                      const explId = `expl-${idx}`;
                      const isExplAudioError = ttsState.audioErrorId === explId;

                      return (
                          <div key={idx} className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 shadow-lg shadow-gray-100 border border-gray-100 transition-all hover:shadow-xl">
                              <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 font-black text-base sm:text-lg shadow-sm ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                      {idx + 1}
                                  </div>
                                  <h4 className="font-bold text-lg sm:text-xl text-gray-900 leading-relaxed">
                                    <MathText text={q.question} />
                                  </h4>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                  <div className={`p-4 sm:p-6 rounded-2xl border-2 ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                          {isCorrect ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" /> : <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />}
                                          <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wider ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>Your Answer</span>
                                      </div>
                                      <p className={`font-bold text-base sm:text-lg ${isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
                                        <MathText text={q.options[userAnswers[idx]]} />
                                      </p>
                                  </div>
                                  {!isCorrect && (
                                      <div className="p-4 sm:p-6 rounded-2xl bg-gray-50 border-2 border-gray-100 opacity-80">
                                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-500">Correct Answer</span>
                                          </div>
                                          <p className="font-bold text-base sm:text-lg text-gray-900">
                                            <MathText text={q.options[q.correctIndex]} />
                                          </p>
                                      </div>
                                  )}
                              </div>
                              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 sm:p-8 border border-indigo-100 relative">
                                  <div className="flex justify-between items-start mb-4">
                                    <span className="font-bold text-indigo-900 uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400" /> Smart Explanation</span>
                                    <button 
                                      onClick={() => onSpeak(`Explanation: ${q.explanation}`, explId)}
                                      className={`p-2 sm:p-3 rounded-xl border shadow-sm transition-colors 
                                        ${isExplAudioError ? 'bg-red-50 border-red-200 text-red-500 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-100'}`}
                                    >
                                      <AudioIcon id={explId} />
                                    </button>
                                  </div>
                                  <div className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 font-medium">
                                    <MathText text={q.explanation} />
                                  </div>
                                  
                                  {/* --- DEEP DIVE SECTION (RENAMED BUTTONS) --- */}
                                  <div className="pt-6 border-t border-indigo-100 flex flex-wrap items-center gap-2 sm:gap-3">
                                     <span className="text-[10px] sm:text-xs font-extrabold text-indigo-300 uppercase tracking-wider mr-2 w-full sm:w-auto mb-2 sm:mb-0">Deep Dive:</span>
                                     
                                     <a 
                                       href={`https://www.google.com/search?q=${encodeURIComponent(q.question + " " + topic + " explanation")}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="flex-1 sm:flex-none justify-center sm:justify-start flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
                                     >
                                        <Search className="w-3.5 h-3.5" /> Google It
                                     </a>

                                     <button 
                                        onClick={() => onAskAI(q.question, q.options, 'gemini')}
                                        className="flex-1 sm:flex-none justify-center sm:justify-start flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                                     >
                                         <Bot className="w-3.5 h-3.5" /> Ask Gemini
                                     </button>

                                     <button 
                                        onClick={() => onAskAI(q.question, q.options, 'chatgpt')}
                                        className="flex-1 sm:flex-none justify-center sm:justify-start flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95"
                                     >
                                         <MessageSquare className="w-3.5 h-3.5" /> Ask ChatGPT
                                     </button>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>
    </div>
  );
};

export default QuizResult;
