import React from 'react';
import { ArrowLeft, BrainCircuit, Sparkles, AlertCircle, BookOpen, Target } from 'lucide-react';

const QuizConfig = ({ topic, config, setConfig, onStart, onBack, error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-white/50 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <BrainCircuit className="w-32 h-32 sm:w-40 sm:h-40" />
          </div>
          <button onClick={onBack} className="text-indigo-100 hover:text-white flex items-center gap-2 mb-4 sm:mb-6 transition-colors font-medium text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center gap-3 tracking-tight">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" /> 
            Quiz Setup
          </h1>
          <p className="mt-2 sm:mt-3 text-indigo-100 text-sm sm:text-lg opacity-90">Customize your practice session for <span className="font-bold text-white border-b-2 border-indigo-400 pb-0.5">{decodeURIComponent(topic)}</span></p>
        </div>

        <div className="p-6 sm:p-10">
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl border border-red-100 flex items-start gap-3 font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6 sm:space-y-8">
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-indigo-500" /> Number of Questions
              </label>
              <div className="flex items-center gap-4 sm:gap-6">
                <input 
                  type="range" 
                  min="3" max="30" 
                  value={config.count}
                  onChange={(e) => setConfig({...config, count: e.target.value})}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                />
                <span className="text-xl sm:text-2xl font-black text-indigo-600 w-12 text-center bg-indigo-50 rounded-lg py-1">{config.count}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-indigo-500" /> Difficulty
                </label>
                <div className="relative">
                  <select 
                    value={config.difficulty}
                    onChange={(e) => setConfig({...config, difficulty: e.target.value})}
                    className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-100 text-sm sm:text-base"
                  >
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  <BrainCircuit className="w-4 h-4 text-indigo-500" /> Focus
                </label>
                <div className="relative">
                  <select 
                    value={config.type}
                    onChange={(e) => setConfig({...config, type: e.target.value})}
                    className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-100 text-sm sm:text-base"
                  >
                    <option>Conceptual</option>
                    <option>Numerical</option>
                    <option>Mixed</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold py-4 sm:py-5 rounded-2xl shadow-xl shadow-indigo-200 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 group text-base sm:text-lg"
            >
              <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" /> 
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizConfig;
