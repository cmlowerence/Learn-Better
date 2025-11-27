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
  AlertCircle 
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-3 rounded-full">
              <BrainCircuit className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Quiz Setup</h1>
          </div>
          
          <p className="text-gray-600 mb-6">Topic: <span className="font-semibold text-indigo-600">{topic}</span></p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
              <input 
                type="number" 
                min="3" max="20"
                value={config.count}
                onChange={(e) => setConfig({...config, count: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select 
                value={config.difficulty}
                onChange={(e) => setConfig({...config, difficulty: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option>Medium (Graduation Standard)</option>
                <option>Hard (Advanced/GATE level)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
              <select 
                value={config.type}
                onChange={(e) => setConfig({...config, type: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option>Conceptual</option>
                <option>Numerical</option>
                <option>Mixed</option>
              </select>
            </div>

            <button 
              onClick={startQuiz}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <BrainCircuit className="w-5 h-5" /> Generate Quiz with AI
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Loading View
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Gemini AI is crafting your questions...</h2>
        <p className="text-gray-500 mt-2">Analyzing {topic} at {config.difficulty} level.</p>
      </div>
    );
  }

  // 3. Quiz Taking View
  if (step === 'quiz') {
    const question = questions[currentQIndex];
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-medium">Question {currentQIndex + 1} of {questions.length}</span>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
              {config.type}
            </span>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 
                    ${userAnswers[currentQIndex] === idx 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <button
              disabled={userAnswers[currentQIndex] === undefined}
              onClick={nextQuestion}
              className="bg-indigo-600 disabled:bg-gray-300 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
            >
              {currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
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

    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                <div className={`text-6xl font-black my-6 ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
                    {percentage}%
                </div>
                <p className="text-gray-600 text-lg">
                    You scored {score} out of {questions.length}
                </p>
                <div className="flex justify-center gap-4 mt-8">
                    <button onClick={restartQuiz} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold">
                        <RefreshCw className="w-5 h-5" /> Take New Test
                    </button>
                    <button onClick={() => navigate('/')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold">
                        Back to Syllabus
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Detailed Review</h3>
                {questions.map((q, idx) => {
                    const isCorrect = userAnswers[idx] === q.correctIndex;
                    return (
                        <div key={idx} className={`bg-white rounded-xl p-6 border-l-8 shadow-sm ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                            <div className="flex items-start gap-3 mb-3">
                                {isCorrect ? <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" /> : <XCircle className="text-red-500 w-6 h-6 flex-shrink-0" />}
                                <h4 className="font-semibold text-lg text-gray-900">{q.question}</h4>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Your Answer</span>
                                    {q.options[userAnswers[idx]]}
                                </div>
                                <div className="p-3 bg-green-50 text-green-800 rounded-lg">
                                    <span className="block text-green-600 text-xs uppercase font-bold mb-1">Correct Answer</span>
                                    {q.options[q.correctIndex]}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-gray-600 text-sm">
                                    <span className="font-bold text-indigo-600">Explanation:</span> {q.explanation}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    );
  }
};

export default QuizPage;
