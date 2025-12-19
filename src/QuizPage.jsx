import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateQuizQuestions } from './services/gemini';
import { useAuth } from './context/AuthContext';
import SEO from './components/SEO';

import { Bot, MessageSquare, ExternalLink, X, AlertCircle } from 'lucide-react';
import QuizConfig from './components/quiz/QuizConfig';
import QuizLoading from './components/quiz/QuizLoading';
import QuizGame from './components/quiz/QuizGame';
import QuizResult from './components/quiz/QuizResult';

const QuizPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { user, saveQuizResult } = useAuth(); 

  // --- MAIN STATES ---
  const [step, setStep] = useState('config'); 
  const [config, setConfig] = useState({ count: 5, difficulty: 'Medium', type: 'Conceptual' });
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [error, setError] = useState(null); // Changed to null for cleaner initial state
  
  // --- TTS STATES ---
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [audioErrorId, setAudioErrorId] = useState(null); 
  const [availableVoices, setAvailableVoices] = useState([]);

  // --- AI MODAL STATES ---
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAI, setSelectedAI] = useState('gemini'); 

  // --- TTS SETUP ---
  useEffect(() => {
    const updateVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();
    return () => window.speechSynthesis.cancel();
  }, []);

  const detectLanguage = (text) => {
    const cleanText = text.replace(/\$\$/g, '').replace(/\\/g, ''); 
    if (/[\u0900-\u097F]/.test(cleanText)) return 'hi-IN';
    if (/[\u0400-\u04FF]/.test(cleanText)) return 'ru-RU'; 
    if (/[áéíóúñüÁÉÍÓÚÑÜ]/.test(cleanText)) return 'es-ES';
    return 'en-US';
  };

  const handleSpeak = (text, id) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    if (activeAudioId === id) {
      setActiveAudioId(null);
      return;
    }
    setAudioErrorId(null);

    const detectedLang = detectLanguage(text);
    const voice = availableVoices.find(v => v.lang.startsWith(detectedLang)) || 
                  availableVoices.find(v => v.lang.includes(detectedLang.split('-')[0]));

    if (!voice && detectedLang !== 'en-US' && availableVoices.length > 0) {
       setAudioErrorId(id);
       return; 
    }

    const cleanText = text.replace(/\$\$/g, '').replace(/\\/g, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.onend = () => setActiveAudioId(null);
    utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
            setActiveAudioId(null);
            setAudioErrorId(id);
        }
    };
    setActiveAudioId(id);
    window.speechSynthesis.speak(utterance);
  };

  // --- QUIZ ACTIONS ---

  const startQuiz = async () => {
    setStep('loading');
    setError(null);
    
    try {
      const data = await generateQuizQuestions(topic, config.count, config.difficulty, config.type);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("EMPTY_DATA");
      }
      
      setQuestions(data);
      setStep('quiz');

    } catch (err) {
      console.error("Quiz Generation Failed:", err);
      
      // --- CLEAN ERROR MESSAGING ---
      let userMessage = "Something went wrong. Please try again.";
      const rawMsg = err.message || "";

      if (rawMsg.includes("Rate limit") || rawMsg.includes("429")) {
        userMessage = "High traffic! The AI is a bit overwhelmed. Please wait 30 seconds and try again.";
      } else if (rawMsg.includes("Invalid topic") || rawMsg.includes("EMPTY_DATA")) {
        userMessage = "We couldn't generate questions for this specific topic. Try a broader term (e.g., instead of 'Newton's 3rd Law details', try 'Newton's Laws').";
      } else if (rawMsg.includes("Network")) {
        userMessage = "Network issue. Please check your internet connection.";
      } else if (rawMsg.includes("Model")) {
        userMessage = "Service configuration error. Please contact support.";
      }

      setError(userMessage);
      setStep('config');
    }
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
        saveQuizResult(decodeURIComponent(topic), finalScore, questions.length, questions, userAnswers);
      }
      setStep('result');
    }
  };

  const restartQuiz = () => {
    window.speechSynthesis.cancel();
    setActiveAudioId(null);
    setAudioErrorId(null);
    setStep('config');
    setQuestions([]);
    setCurrentQIndex(0);
    setUserAnswers({});
    setError(null);
  };

  // --- AI HELPERS ---
  const handleAskAI = (questionText, options, aiType) => {
    setSelectedAI(aiType);
    const formattedOptions = options.map((opt, i) => `${String.fromCharCode(65+i)}) ${opt}`).join('\n');
    const vividPrompt = `I am studying "${decodeURIComponent(topic)}". \n\nPlease explain this vividly:\n\nQuestion: "${questionText}"\n\nOptions:\n${formattedOptions}`;
    navigator.clipboard.writeText(vividPrompt);
    setShowAIModal(true);
  };

  const aiConfig = selectedAI === 'gemini' 
    ? { name: 'Gemini', color: 'from-blue-600 to-indigo-600', shadow: 'shadow-indigo-200', icon: <Bot className="w-8 h-8 text-white" />, url: "https://gemini.google.com" } 
    : { name: 'ChatGPT', color: 'from-green-500 to-teal-600', shadow: 'shadow-teal-200', icon: <MessageSquare className="w-8 h-8 text-white" />, url: "https://chatgpt.com" };

  return (
    <>
      <SEO 
        title={`${decodeURIComponent(topic)} Quiz`}
        description={`AI-generated quiz on ${decodeURIComponent(topic)}.`}
      />

      {/* --- ERROR TOAST (Appears at top if error exists) --- */}
      {error && step === 'config' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300 w-[90%] max-w-lg">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 text-red-600 shrink-0" />
            <div className="flex-1 text-sm font-medium">{error}</div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* --- AI MODAL --- */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 relative animate-in zoom-in-95 border border-white/20">
            <button onClick={() => setShowAIModal(false)} className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 bg-gradient-to-tr ${aiConfig.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl transform rotate-3`}>
                {aiConfig.icon}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Prompt Copied!</h3>
              <p className="text-gray-500 mb-8 text-sm font-medium">
                Paste the copied prompt into <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${aiConfig.color}`}>{aiConfig.name}</span> for a detailed explanation.
              </p>
              <button 
                onClick={() => { window.open(aiConfig.url, "_blank"); setShowAIModal(false); }}
                className={`w-full bg-gradient-to-r ${aiConfig.color} text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3`}
              >
                Launch {aiConfig.name} <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PAGE CONTENT --- */}
      {step === 'config' && (
        <QuizConfig 
          topic={topic} 
          config={config} 
          setConfig={setConfig} 
          onStart={startQuiz} 
          onBack={() => navigate('/')} 
          // We handle the error display globally above now, but passing it just in case your component uses it
          error={error} 
        />
      )}

      {step === 'loading' && <QuizLoading />}

      {step === 'quiz' && (
        <QuizGame 
          questions={questions}
          currentQIndex={currentQIndex}
          userAnswers={userAnswers}
          config={config}
          onOptionSelect={(idx) => setUserAnswers({ ...userAnswers, [currentQIndex]: idx })}
          onNext={nextQuestion}
          ttsState={{ activeAudioId, audioErrorId }}
          onSpeak={handleSpeak}
        />
      )}

      {step === 'result' && (
        <QuizResult 
          questions={questions}
          userAnswers={userAnswers}
          score={questions.reduce((acc, q, i) => acc + (userAnswers[i] === q.correctIndex ? 1 : 0), 0)}
          topic={topic}
          user={user}
          onRestart={restartQuiz}
          onNavigate={navigate}
          onAskAI={handleAskAI}
          ttsState={{ activeAudioId, audioErrorId }}
          onSpeak={handleSpeak}
        />
      )}
    </>
  );
};

export default QuizPage;
