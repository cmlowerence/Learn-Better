import React from 'react';
import MathText from '../MathText';
import { Volume2, VolumeX, CheckCircle, ArrowLeft, MicOff } from 'lucide-react';

const QuizGame = ({ 
  questions, 
  currentQIndex, 
  userAnswers, 
  config, 
  onOptionSelect, 
  onNext,
  ttsState, // { activeAudioId, audioErrorId }
  onSpeak 
}) => {
  const question = questions[currentQIndex];
  const progress = ((currentQIndex + 1) / questions.length) * 100;
  
  const isPlaying = ttsState.activeAudioId === 'current-question';
  const isAudioError = ttsState.audioErrorId === 'current-question';

  const AudioIcon = () => {
    if (isAudioError) return <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />;
    if (isPlaying) return <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />;
    return <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />;
  };

  return (
    <div className="h-[100dvh] bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 w-full flex-shrink-0">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <span className="text-gray-400 font-extrabold tracking-widest text-[10px] sm:text-xs uppercase bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                Question {currentQIndex + 1} / {questions.length}
            </span>
            <div className="flex gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border border-indigo-200">{config.difficulty}</span>
                <span className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border border-purple-200">{config.type}</span>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden mb-4">
            <div className="p-6 sm:p-12 border-b border-gray-50 bg-gradient-to-b from-white to-gray-50/30 flex justify-between items-start gap-4 sm:gap-6">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug tracking-tight">
                    <MathText text={question.question} />
                  </h2>
                </div>
                <button 
                  onClick={() => onSpeak(`${question.question}. The options are: ${question.options.join('. ')}`, 'current-question')}
                  className={`p-3 sm:p-4 rounded-full transition-all flex-shrink-0 shadow-sm 
                  ${isAudioError ? 'bg-red-50 text-red-500 ring-2 ring-red-100 cursor-not-allowed' : 
                    isPlaying ? 'bg-indigo-50 text-indigo-600 animate-pulse ring-2 ring-indigo-100' : 'bg-white text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 ring-1 ring-gray-100'}`}
                >
                  <AudioIcon />
                </button>
            </div>

            <div className="p-6 sm:p-12 space-y-4 sm:space-y-5 bg-white">
              {question.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQIndex] === idx;
                return (
                    <button
                    key={idx}
                    onClick={() => onOptionSelect(idx)}
                    className={`w-full text-left p-4 sm:p-6 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                        ${isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100 transform scale-[1.01]' 
                          : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50 hover:shadow-md'
                        }`}
                    >
                    <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-base sm:text-lg font-black transition-colors flex-shrink-0 shadow-sm
                            ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-indigo-600'}`}>
                            {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`font-bold text-base sm:text-xl ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                           <MathText text={opt} />
                        </span>
                    </div>
                    </button>
                );
              })}
            </div>
          </div>
          <div className="h-4"></div>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-8 bg-gray-50 sm:bg-transparent border-t border-gray-200 sm:border-none z-20">
          <div className="flex justify-end">
            <button
              disabled={userAnswers[currentQIndex] === undefined}
              onClick={onNext}
              className="w-full sm:w-auto bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-black text-white px-8 py-4 sm:px-12 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              {currentQIndex === questions.length - 1 ? (
                  <>Finish & Save <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /></>
              ) : (
                  <>Next Question <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
