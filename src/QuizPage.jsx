import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateQuizQuestions } from './services/gemini';
import { useAuth } from './context/AuthContext';
import MathText from './components/MathText';
import { 
  ArrowLeft, BrainCircuit, CheckCircle, XCircle, RefreshCw, 
  Loader2, AlertCircle, Trophy, BookOpen, Target, Sparkles, 
  Volume2, VolumeX, LogIn, Search, Bot, ExternalLink,
  ClipboardCheck, X, MessageSquare
} from 'lucide-react';

const DRAMATIC_PHRASES = [
  "Consulting the digital oracle...",
  "Weaving the threads of knowledge...",
  "Summoning the spirits of academia...",
  "Calibrating quantum difficulty...",
  "Extracting wisdom from the ether...",
  "Polishing the gems of inquiry...",
  "Constructing your intellectual gauntlet..."
];

const QuizPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { user, saveQuizResult } = useAuth(); 

  // --- STATES ---
  const [step, setStep] = useState('config'); 
  const [config, setConfig] = useState({
    count: 5,
    difficulty: 'Medium',
    type: 'Conceptual'
  });
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [error, setError] = useState('');
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [loadingPhrase, setLoadingPhrase] = useState(DRAMATIC_PHRASES[0]);
  
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAI, setSelectedAI] = useState('gemini'); 

  // --- DRAMATIC LOADING EFFECT ---
  useEffect(() => {
    let interval;
    if (step === 'loading') {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % DRAMATIC_PHRASES.length;
        setLoadingPhrase(DRAMATIC_PHRASES[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [step]);

  // --- CLEANUP ---
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleSpeak = (text, id) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (activeAudioId === id) {
      setActiveAudioId(null);
      return;
    }
    // Clean text for speech
    const cleanText = text.replace(/\$\$/g, '').replace(/\\/g, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US'; 
    utterance.onend = () => setActiveAudioId(null);
    setActiveAudioId(id);
    window.speechSynthesis.speak(utterance);
  };

  const startQuiz = async () => {
    setStep('loading');
    setError('');
    try {
      const data = await generateQuizQuestions(topic, config.count, config.difficulty, config.type);
      if (!Array.isArray(data) || data.length === 0) throw new Error("Received empty data.");
      setQuestions(data);
      setStep('quiz');
    } catch (err) {
      console.error(err);
      setError("The oracle failed to respond. Check your connection.");
      setStep('config');
    }
  };

  const handleOptionSelect = (optionIndex) => {
    setUserAnswers({ ...userAnswers, [currentQIndex]: optionIndex });
  };

  const nextQuestion = () => {
    window.speechSynthesis.cancel();
    setActiveAudioId(null);
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      let finalScore = 0;
      questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctIndex) finalScore++;
      });
      if (user) {
        saveQuizResult(decodeURIComponent(topic), finalScore, questions.length);
      }
      setStep('result');
    }
  };

  const restartQuiz = () => {
    window.speechSynthesis.cancel();
    setActiveAudioId(null);
    setStep('config');
    setQuestions([]);
    setCurrentQIndex(0);
    setUserAnswers({});
    setError('');
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  const handleAskAI = (questionText, options, aiType) => {
    setSelectedAI(aiType);
    const formattedOptions = options.map((opt, i) => `${String.fromCharCode(65+i)}) ${opt}`).join('\n');
    const vividPrompt = `I am studying "${decodeURIComponent(topic)}". \n\nPlease explain the concept behind this question vividly using real-world analogies:\n\nQuestion: "${questionText}"\n\nOptions:\n${formattedOptions}\n\nProvide a thorough exploration of why the correct answer is correct and why others are wrong.`;
    navigator.clipboard.writeText(vividPrompt);
    setShowAIModal(true);
  };

  const confirmRedirection = () => {
    const url = selectedAI === 'gemini' ? "https://gemini.google.com" : "https://chatgpt.com";
    window.open(url, "_blank");
    setShowAIModal(false);
  };

  const getAIConfig = () => {
    return selectedAI === 'gemini' ? {
      name: 'Gemini',
      color: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-indigo-200',
      icon: <Bot className="w-8 h-8 text-white" />,
      storeLink: 'https://play.google.com/store/apps/details?id=com.google.android.apps.bard'
    } : {
      name: 'ChatGPT',
      color: 'from-green-500 to-teal-600',
      shadow: 'shadow-teal-200',
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      storeLink: 'https://play.google.com/store/apps/details?id=com.openai.chatgpt'
    };
  };

  // --- VIEWS ---

  if (step === 'config') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-white/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
              <BrainCircuit className="w-40 h-40" />
            </div>
            <button onClick={() => navigate('/')} className="text-indigo-100 hover:text-white flex items-center gap-2 mb-6 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-extrabold flex items-center gap-3 tracking-tight">
              <Sparkles className="w-8 h-8 text-yellow-300" /> 
              Quiz Setup
            </h1>
            <p className="mt-3 text-indigo-100 text-lg opacity-90">Customize your practice session for <span className="font-bold text-white border-b-2 border-indigo-400 pb-0.5">{decodeURIComponent(topic)}</span></p>
          </div>

          <div className="p-8 sm:p-10">
            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start gap-3 font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-indigo-500" /> Number of Questions
                </label>
                <div className="flex items-center gap-6">
                  <input 
                    type="range" 
                    min="3" max="15" 
                    value={config.count}
                    onChange={(e) => setConfig({...config, count: e.target.value})}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                  />
                  <span className="text-2xl font-black text-indigo-600 w-12 text-center bg-indigo-50 rounded-lg py-1">{config.count}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    <Target className="w-4 h-4 text-indigo-500" /> Difficulty
                  </label>
                  <div className="relative">
                    <select 
                      value={config.difficulty}
                      onChange={(e) => setConfig({...config, difficulty: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-100"
                    >
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    <BrainCircuit className="w-4 h-4 text-indigo-500" /> Focus
                  </label>
                  <div className="relative">
                    <select 
                      value={config.type}
                      onChange={(e) => setConfig({...config, type: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-100"
                    >
                      <option>Conceptual</option>
                      <option>Numerical</option>
                      <option>Mixed</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={startQuiz}
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-indigo-200 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 group text-lg"
              >
                <BrainCircuit className="w-6 h-6 group-hover:animate-pulse" /> 
                Start AI Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] opacity-30 animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
          <div className="relative mb-10">
             <div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-40 animate-ping rounded-full"></div>
             <Loader2 className="w-24 h-24 text-white animate-spin relative z-10" />
          </div>
          
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 mb-6 animate-pulse tracking-tight">
            Generating Intelligence...
          </h2>
          <p className="text-indigo-200 text-xl font-medium leading-relaxed italic opacity-90 transition-all duration-500 font-serif">
            "{loadingPhrase}"
          </p>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const question = questions[currentQIndex];
    const progress = ((currentQIndex + 1) / questions.length) * 100;
    const isPlaying = activeAudioId === 'current-question';

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <div className="h-2 bg-gray-200 w-full">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-400 font-extrabold tracking-widest text-xs uppercase bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">Question {currentQIndex + 1} / {questions.length}</span>
            <div className="flex gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-indigo-200">{config.difficulty}</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-purple-200">{config.type}</span>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden mb-8 flex-1 flex flex-col">
            <div className="p-8 sm:p-12 border-b border-gray-50 bg-gradient-to-b from-white to-gray-50/30 flex justify-between items-start gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug tracking-tight">
                    <MathText text={question.question} />
                  </h2>
                </div>
                <button 
                  onClick={() => handleSpeak(`${question.question}. The options are: ${question.options.join('. ')}`, 'current-question')}
                  className={`p-4 rounded-full transition-all flex-shrink-0 shadow-sm ${isPlaying ? 'bg-red-50 text-red-600 animate-pulse ring-2 ring-red-100' : 'bg-white text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 ring-1 ring-gray-100'}`}
                >
                  {isPlaying ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
            </div>

            <div className="p-8 sm:p-12 space-y-5 bg-white flex-1">
              {question.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQIndex] === idx;
                return (
                    <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                        ${isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100 transform scale-[1.01]' 
                          : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50 hover:shadow-md'
                        }`}
                    >
                    <div className="flex items-center gap-5 relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-colors flex-shrink-0 shadow-sm
                            ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-indigo-600'}`}>
                            {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`font-bold text-xl ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                           <MathText text={opt} />
                        </span>
                    </div>
                    </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-10">
            <button
              disabled={userAnswers[currentQIndex] === undefined}
              onClick={nextQuestion}
              className="bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-black text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              {currentQIndex === questions.length - 1 ? (
                  <>Finish & Save <CheckCircle className="w-6 h-6" /></>
              ) : (
                  <>Next Question <ArrowLeft className="w-6 h-6 rotate-180" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const isPass = percentage >= 40;
    const aiConfig = getAIConfig();

    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans">
        
        {/* --- AI INSTRUCTION MODAL --- */}
        {showAIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 relative animate-in zoom-in-95 duration-300 border border-white/20">
              <button 
                onClick={() => setShowAIModal(false)}
                className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 bg-gradient-to-tr ${aiConfig.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-gray-200 transform rotate-3`}>
                  {aiConfig.icon}
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Prompt Copied!</h3>
                <p className="text-gray-500 mb-8 text-base leading-relaxed font-medium">
                  We've prepared a specialized prompt for you.<br/>
                  <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${aiConfig.color}`}>
                    Paste it into {aiConfig.name}
                  </span> for a vivid deep dive.
                </p>

                <button 
                  onClick={confirmRedirection}
                  className={`w-full bg-gradient-to-r ${aiConfig.color} text-white font-bold py-4 rounded-xl shadow-lg ${aiConfig.shadow} hover:shadow-xl transform hover:-translate-y-1 transition-all mb-6 flex items-center justify-center gap-3 text-lg`}
                >
                  Launch {aiConfig.name} <ExternalLink className="w-5 h-5" />
                </button>

                <div className="text-xs font-semibold text-gray-400 border-t border-gray-100 pt-6 w-full">
                  App didn't open? <a href={aiConfig.storeLink} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">Get it on Play Store</a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 overflow-hidden mb-12 text-center relative border border-gray-100">
                <div className={`h-3 w-full ${isPass ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`} />
                <div className="p-12 sm:p-16">
                    <div className="inline-block p-6 rounded-full bg-gray-50 mb-8 shadow-inner ring-8 ring-gray-50">
                        <Trophy className={`w-16 h-16 ${isPass ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'}`} />
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">{isPass ? 'Great Job!' : 'Keep Practicing!'}</h2>
                    <p className="text-gray-500 mb-10 text-lg font-medium">
                      {user 
                        ? <span className="flex items-center justify-center gap-2">Progress saved for <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{decodeURIComponent(topic)}</span></span> 
                        : "You are in Guest Mode. Login to save this score!"}
                    </p>
                    <div className="flex justify-center items-baseline gap-3 mb-12">
                        <span className={`text-8xl font-black leading-none tracking-tighter ${isPass ? 'text-emerald-500' : 'text-orange-500'}`}>{percentage}%</span>
                        <span className="text-2xl text-gray-400 font-bold">({score}/{questions.length})</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-5">
                        <button onClick={restartQuiz} className="flex items-center justify-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                            <RefreshCw className="w-5 h-5" /> Try Another Quiz
                        </button>
                        {user ? (
                           <button onClick={() => navigate('/leaderboard')} className="px-10 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 font-bold transition-all">
                               View Statistics
                           </button>
                        ) : (
                           <button onClick={() => navigate('/login')} className="flex items-center justify-center gap-2 px-10 py-4 border-2 border-indigo-100 text-indigo-600 rounded-2xl hover:bg-indigo-50 font-bold transition-all">
                               <LogIn className="w-5 h-5" /> Login to Save
                           </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="space-y-8">
                <h3 className="text-3xl font-extrabold text-gray-900 px-4 flex items-center gap-3"><BookOpen className="w-8 h-8 text-indigo-500" /> Answer Review</h3>
                <div className="grid gap-8">
                    {questions.map((q, idx) => {
                        const isCorrect = userAnswers[idx] === q.correctIndex;
                        const explId = `expl-${idx}`;
                        return (
                            <div key={idx} className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-lg shadow-gray-100 border border-gray-100 transition-all hover:shadow-xl">
                                <div className="flex items-start gap-6 mb-8">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 font-black text-lg shadow-sm ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {idx + 1}
                                    </div>
                                    <h4 className="font-bold text-xl text-gray-900 leading-relaxed">
                                      <MathText text={q.question} />
                                    </h4>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                    <div className={`p-6 rounded-2xl border-2 ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
                                            <span className={`text-xs font-extrabold uppercase tracking-wider ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>Your Answer</span>
                                        </div>
                                        <p className={`font-bold text-lg ${isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
                                          <MathText text={q.options[userAnswers[idx]]} />
                                        </p>
                                    </div>
                                    {!isCorrect && (
                                        <div className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-100 opacity-80">
                                            <div className="flex items-center gap-2 mb-3">
                                                <CheckCircle className="w-5 h-5 text-gray-400" />
                                                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Correct Answer</span>
                                            </div>
                                            <p className="font-bold text-lg text-gray-900">
                                              <MathText text={q.options[q.correctIndex]} />
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 border border-indigo-100 relative">
                                    <div className="flex justify-between items-start mb-4">
                                      <span className="font-bold text-indigo-900 uppercase tracking-wider text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400" /> Smart Explanation</span>
                                      <button 
                                        onClick={() => handleSpeak(`Explanation: ${q.explanation}`, explId)}
                                        className={`p-3 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100 shadow-sm transition-colors`}
                                      >
                                        <Volume2 className="w-5 h-5" />
                                      </button>
                                    </div>
                                    <div className="text-gray-700 text-base leading-relaxed mb-8 font-medium">
                                      <MathText text={q.explanation} />
                                    </div>
                                    
                                    {/* --- DEEP DIVE SECTION --- */}
                                    <div className="pt-6 border-t border-indigo-100 flex flex-wrap items-center gap-3">
                                       <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider mr-2">Deep Dive:</span>
                                       
                                       <a 
                                         href={`https://www.google.com/search?q=${encodeURIComponent(q.question + " " + topic + " explanation")}`}
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
                                         title="Search this concept on Google"
                                       >
                                          <Search className="w-3.5 h-3.5" /> Google It
                                       </a>

                                       <button 
                                          onClick={() => handleAskAI(q.question, q.options, 'gemini')}
                                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                                          title="Ask Gemini"
                                       >
                                           <Bot className="w-3.5 h-3.5" /> Gemini
                                       </button>

                                       <button 
                                          onClick={() => handleAskAI(q.question, q.options, 'chatgpt')}
                                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95"
                                          title="Ask ChatGPT"
                                       >
                                           <MessageSquare className="w-3.5 h-3.5" /> ChatGPT
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
  }
};

export default QuizPage;


