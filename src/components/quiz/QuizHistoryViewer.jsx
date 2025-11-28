import React, { useState } from 'react';
import MathText from '../MathText';
import { 
  History, ChevronDown, ChevronUp, CheckCircle, 
  XCircle, Calendar, Trophy 
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
                {attempt.questions.map((q, idx) => {
                  // Fallback for older data where userAnswers might be structured differently
                  const userAnswerIndex = attempt.userAnswers ? attempt.userAnswers[idx] : undefined;
                  const isCorrect = userAnswerIndex === q.correctIndex;
                  const hasAnswered = userAnswerIndex !== undefined;

                  return (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                      {/* Status Stripe */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      
                      <div className="flex items-start gap-3 mb-3">
                        <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded text-xs mt-1 flex-shrink-0">Q{idx + 1}</span>
                        <div className="font-medium text-gray-900 text-sm leading-relaxed w-full">
                          <MathText text={q.question} />
                        </div>
                      </div>

                      <div className="space-y-3 pl-0 sm:pl-9">
                        {/* User Answer */}
                        <div className={`p-3 rounded-lg text-sm border ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            {isCorrect ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                            <span className={`text-[10px] font-bold uppercase ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>You Selected</span>
                          </div>
                          <div className="text-gray-800 font-medium">
                             {hasAnswered ? <MathText text={q.options[userAnswerIndex]} /> : <span className="text-gray-400 italic">Skipped / No Data</span>}
                          </div>
                        </div>

                        {/* Correct Answer (if wrong) */}
                        {!isCorrect && (
                          <div className="p-3 rounded-lg text-sm border border-gray-200 bg-white">
                            <div className="flex items-center gap-1.5 mb-1">
                              <CheckCircle className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-[10px] font-bold uppercase text-gray-500">Correct Answer</span>
                            </div>
                            <div className="text-gray-800 font-medium">
                               <MathText text={q.options[q.correctIndex]} />
                            </div>
                          </div>
                        )}
                        
                        {/* Explanation Preview */}
                        <div className="pt-2">
                           <p className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-3">
                              <span className="font-semibold not-italic text-gray-600">Why?</span> <MathText text={q.explanation} />
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