import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateQuizQuestions } from './services/gemini';
import { 
  ArrowLeft, 
  BrainCircuit, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Loader2, 
  AlertCircle,
  Trophy,
  BookOpen,
  Target,
  Sparkles
} from 'lucide-react';

const QuizPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();

  // --- STATES ---
  const [step, setStep] = useState('config'); // config, loading, quiz, result
  const [config, setConfig] = useState({
    count: 5,
    difficulty: 'Medium',
    type: 'Conceptual'
  });
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: optionIndex }
  const [error, setError] = useState('');

  // --- HANDLERS ---
  const startQuiz = async () => {
    setStep('loading');
    setError('');
    try {
      const data = await generateQuizQuestions(topic, config.count, config.difficulty, config.type);
      setQuestions(data);
      setStep('quiz');
    } catch (err) {
      setError(err.message);
      setStep('config');
    }
  };

  const handleOptionSelect = (optionIndex) => {
    setUserAnswers({ ...userAnswers, [currentQIndex]: optionIndex });
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setStep('result');
    }
  };

  const restartQuiz = () => {
    setStep('config');
    setQuestions([]);
    setCurrentQIndex(0);
    setUserAnswers({});
    setError('');
  };

  // --- RENDER HELPERS ---
  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  // --- COMPONENT VIEWS ---

  // 1. Configuration View
  if (step === 'config') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-white/50 backdrop-blur-sm">
          {/* Header Banner */}
          <div className="bg-indigo-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
              <BrainCircuit className="w-32 h-32" />
            </div>
            <button onClick={() => navigate('/')} className="text-indigo-100 hover:text-white flex items-center gap-2 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-300" /> 
              Quiz Setup
            </h1>
            <p className="mt-2 text-indigo-100 opacity-90">Customize your practice session for <span className="font-semibold text-white border-b border-indigo-400 pb-0.5">{decodeURIComponent(topic)}</span></p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Question Count */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" /> Number of Questions
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="3" max="15" 
                    value={config.count}
                    onChange={(e) => setConfig({...config, count: e.target.value})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-xl font-bold text-indigo-600 w-8 text-center">{config.count}</span>
                </div>
              </div>

              {/* Grid for Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Target className="w-4 h-4 text-indigo-500" /> Difficulty
                  </label>
                  <div className="relative">
                    <select 
                      value={config.difficulty}
                      onChange={(e) => setConfig({...config, difficulty: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-medium text-gray-700"
                    >
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <BrainCircuit className="w-4 h-4 text-indigo-500" /> Focus
                  </label>
                  <div className="relative">
                    <select 
                      value={config.type}
                      onChange={(e) => setConfig({...config, type: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-medium text-gray-700"
                    >
                      <option>Conceptual</option>
                      <option>Numerical</option>
                      <option>Mixed</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={startQuiz}
                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <BrainCircuit className="w-5 h-5 group-hover:animate-pulse" /> 
                Start AI Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Loading View
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center max-w-sm text-center border border-indigo-50">
          <div className="relative mb-6">
             <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
             <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Quiz...</h2>
          <p className="text-gray-500">Picking {config.count} {config.difficulty} level questions for you.</p>
        </div>
      </div>
    );
  }

  // 3. Quiz Taking View
  if (step === 'quiz') {
    const question = questions[currentQIndex];
    const progress = ((currentQIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Progress Bar */}
        <div className="h-2 bg-gray-200 w-full">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-500 font-bold tracking-wider text-sm uppercase">Question {currentQIndex + 1} / {questions.length}</span>
            <div className="flex gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {config.difficulty}
                </span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {config.type}
                </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-6 flex-1 flex flex-col">
            <div className="p-6 sm:p-10 border-b border-gray-50 bg-gradient-to-b from-white to-gray-50/50">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed">
                {question.question}
                </h2>
            </div>

            <div className="p-6 sm:p-10 space-y-4 bg-white flex-1">
              {question.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQIndex] === idx;
                return (
                    <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                        ${isSelected 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.01]' 
                        : 'border-gray-100 hover:border-indigo-300 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                    >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0
                            ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-200 group-hover:text-indigo-700'}
                        `}>
                            {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`font-medium text-lg ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{opt}</span>
                    </div>
                    </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-2 pb-8">
            <button
              disabled={userAnswers[currentQIndex] === undefined}
              onClick={nextQuestion}
              className="bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-black text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              {currentQIndex === questions.length - 1 ? (
                  <>Finish Quiz <CheckCircle className="w-5 h-5" /></>
              ) : (
                  <>Next Question <ArrowLeft className="w-5 h-5 rotate-180" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Results View
  if (step === 'result') {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const isPass = percentage >= 40;

    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
            
            {/* Score Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10 text-center relative">
                <div className={`h-2 w-full ${isPass ? 'bg-green-500' : 'bg-orange-500'}`} />
                <div className="p-10 sm:p-14">
                    <div className="inline-block p-4 rounded-full bg-gray-50 mb-6 shadow-inner">
                        <Trophy className={`w-12 h-12 ${isPass ? 'text-yellow-500' : 'text-gray-400'}`} />
                    </div>
                    
                    <h2 className="text-4xl font-black text-gray-900 mb-2">
                        {isPass ? 'Great Job!' : 'Keep Practicing!'}
                    </h2>
                    <p className="text-gray-500 mb-8">You have completed the {decodeURIComponent(topic)} quiz</p>
                    
                    <div className="flex justify-center items-end gap-2 mb-8">
                        <span className={`text-7xl font-black leading-none ${isPass ? 'text-green-600' : 'text-orange-500'}`}>
                            {percentage}%
                        </span>
                        <span className="text-xl text-gray-400 font-bold mb-2">
                            ({score}/{questions.length})
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={restartQuiz} className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg hover:shadow-indigo-200 transition-all">
                            <RefreshCw className="w-5 h-5" /> Try Another Quiz
                        </button>
                        <button onClick={() => navigate('/')} className="px-8 py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold hover:text-gray-900 transition-all">
                            Back to Syllabus
                        </button>
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 px-2 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-gray-400" /> Answer Review
                </h3>
                
                <div className="grid gap-6">
                    {questions.map((q, idx) => {
                        const isCorrect = userAnswers[idx] === q.correctIndex;
                        return (
                            <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <span className="font-bold">{idx + 1}</span>
                                    </div>
                                    <h4 className="font-bold text-lg text-gray-900 leading-relaxed">{q.question}</h4>
                                </div>
                                
                                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                    <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {isCorrect ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                                            <span className={`text-xs font-bold uppercase tracking-wider ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>Your Answer</span>
                                        </div>
                                        <p className={`font-medium ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                                            {q.options[userAnswers[idx]]}
                                        </p>
                                    </div>

                                    {!isCorrect && (
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 opacity-75">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-4 h-4 text-gray-500" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Correct Answer</span>
                                            </div>
                                            <p className="font-medium text-gray-900">
                                                {q.options[q.correctIndex]}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        <span className="font-bold text-indigo-700 block mb-1">Explanation</span> 
                                        {q.explanation}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    );
  }
};

export default QuizPage;


