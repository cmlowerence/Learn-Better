import React, { useState } from 'react';
import MathText from '../MathText';
import { 
  History, ChevronDown, ChevronUp, CheckCircle2, 
  XCircle, Calendar, Trophy, Circle 
} from 'lucide-react';

const QuizHistoryViewer = ({ recentAttempts, subjectTitle }) => {
  const [expandedQuizId, setExpandedQuizId] = useState(null);

  if (!recentAttempts || recentAttempts.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-4">
        <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No recent quiz history for {subjectTitle}.</p>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedQuizId(expandedQuizId === id ? null : id);
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 px-2">
        <History className="w-5 h-5 text-indigo-500" /> 
        Last 10 Attempts: <span className="text-indigo-600">{subjectTitle}</span>
      </h3>

      {recentAttempts.map((attempt) => {
        const date = new Date(attempt.timestamp).toLocaleDateString(undefined, {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const isExpanded = expandedQuizId === attempt.id;
        const percentage = Math.round((attempt.score / attempt.total) * 100);
        const isPass = percentage >= 40;

        return (
          <div key={attempt.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
            
            {/* Summary Header (Clickable) */}
            <button 
              onClick={() => toggleExpand(attempt.id)}
              className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 gap-4 bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${isPass ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                  {percentage}%
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base line-clamp-1">{decodeURIComponent(attempt.topic)}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>
                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> Score: {attempt.score}/{attempt.total}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs sm:text-sm self-end sm:self-center bg-indigo-50 px-3 py-1.5 rounded-lg">
                 {isExpanded ? 'Hide' : 'Review'}
                 {isExpanded ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
              </div>
            </button>

            {/* Detailed Questions View */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                {attempt.questions.map((q, qIdx) => {
                  const userAnswerIndex = attempt.userAnswers ? attempt.userAnswers[qIdx] : undefined;
                  const isAnswerCorrect = userAnswerIndex === q.correctIndex;
                  
                  return (
                    <div key={qIdx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                      {/* Status Stripe */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isAnswerCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      
                      {/* Question Text */}
                      <div className="flex items-start gap-3 mb-4">
                        <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded text-xs mt-1 flex-shrink-0">Q{qIdx + 1}</span>
                        <div className="font-bold text-gray-900 text-sm sm:text-base leading-relaxed w-full">
                          <MathText text={q.question} />
                        </div>
                      </div>

                      {/* Options List */}
                      <div className="space-y-2 mb-4 pl-0 sm:pl-9">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswerIndex === optIdx;
                          const isCorrectOption = q.correctIndex === optIdx;
                          
                          // Determine Styling
                          let containerClass = "border-gray-100 bg-white text-gray-600 hover:bg-gray-50"; // Default
                          let icon = <Circle className="w-4 h-4 text-gray-300" />;

                          if (isCorrectOption) {
                            containerClass = "border-emerald-200 bg-emerald-50 text-emerald-900";
                            icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                          } else if (isSelected && !isCorrectOption) {
                             containerClass = "border-rose-200 bg-rose-50 text-rose-900";
                             icon = <XCircle className="w-4 h-4 text-rose-600" />;
                          }

                          return (
                            <div 
                              key={optIdx} 
                              className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-colors ${containerClass}`}
                            >
                              <div className="flex-shrink-0 mt-0.5">{icon}</div>
                              <div className="flex-1"><MathText text={opt} /></div>
                              {isSelected && (
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                                  {isCorrectOption ? '(You)' : '(You)'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="pl-0 sm:pl-9 pt-2 border-t border-gray-50 mt-2">
                         <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                            <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                              <span className="font-bold text-indigo-600 uppercase tracking-wider text-[10px] block mb-1">Explanation:</span> 
                              <MathText text={q.explanation} />
                            </p>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuizHistoryViewer;
