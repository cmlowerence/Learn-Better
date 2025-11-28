import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateQuizQuestions } from './services/gemini';
import { useAuth } from './context/AuthContext';
import SEO from './components/SEO';

import { Bot, MessageSquare, ExternalLink, X } from 'lucide-react';
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
  const [error, setError] = useState('');
  
  // --- TTS STATES ---
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [audioErrorId, setAudioErrorId] = useState(null); 
  const [availableVoices, setAvailableVoices] = useState([]);

  // --- AI MODAL STATES ---
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAI, setSelectedAI] = useState('gemini'); 

  // --- TTS SETUP & LOGIC ---
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
    if (/[\u0900-\u097F]/.test(cleanText)) return 'hi-IN'; // Hindi
    if (/[\u0400-\u04FF]/.test(cleanText)) return 'ru-RU'; // Russian
    if (/[áéíóúñüÁÉÍÓÚÑÜ]/.test(cleanText)) return 'es-ES'; // Spanish (Approx)
    return 'en-US'; // Default
  };

  const handleSpeak = (text, id) => {
    if (!('speechSynthesis' in window)) return;
    
    // Clear previous audio
    window.speechSynthesis.cancel();
    // Do NOT clear error state globally here, only if starting new valid audio
    
    if (activeAudioId === id) {
      setActiveAudioId(null);
      return;
    }

    // Reset error for THIS specific new attempt
    setAudioErrorId(null);

    const detectedLang = detectLanguage(text);
    
    // Voice Selection Logic
    const voice = availableVoices.find(v => v.lang.startsWith(detectedLang)) || 
                  availableVoices.find(v => v.lang.includes(detectedLang.split('-')[0]));

    // --- FIX: Strict Error Handling ---
    // Only trigger error if we truly cannot find a voice for a non-English text
    if (!voice && detectedLang !== 'en-US') {
       if(availableVoices.length > 0) {
          setAudioErrorId(id);
          return; 
       }
    }

    const cleanText = text.replace(/\$\$/g, '').replace(/\\/g, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onend = () => setActiveAudioId(null);
    
    // --- FIX: Ignore Interrupted Error ---
    utterance.onerror = (event) => {
        // If the error is simply that we cancelled it (interrupted), do NOT show red icon
        if (event.error === 'interrupted' || event.error === 'canceled') {
            setActiveAudioId(null);
            return; 
        }
        // Genuine error
        setActiveAudioId(null);
        setAudioErrorId(id);
    };

    setActiveAudioId(id);
    window.speechSynthesis.speak(utterance);
  };

  // --- QUIZ ACTIONS ---

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
        // Updated call with full data
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
    setError('');
  };

  const handleAskAI = (questionText, options, aiType) => {
    setSelectedAI(aiType);
    const formattedOptions = options.map((opt, i) => `${String.fromCharCode(65+i)}) ${opt}`).join('\n');
    const vividPrompt = `I am studying "${decodeURIComponent(topic)}". \n\nPlease explain the concept behind this question vividly using real-world analogies:\n\nQuestion: "${questionText}"\n\nOptions:\n${formattedOptions}\n\nProvide a thorough exploration of why the correct answer is correct and why others are wrong.`;
    navigator.clipboard.writeText(vividPrompt);
    setShowAIModal(true);
  };

  // --- AI MODAL RENDER ---
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

  const aiConfig = getAIConfig();

  return (
    <>
      <SEO 
        title={`${decodeURIComponent(topic)} Quiz`}
        description={`Take a free AI-generated quiz on ${decodeURIComponent(topic)} for HPRCA TGT Non-Medical preparation. Test your knowledge now.`}
        keywords={`Quiz, ${decodeURIComponent(topic)}, MCQ, Practice, TGT Exam`}
      />
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
                onClick={() => {
                   window.open(selectedAI === 'gemini' ? "https://gemini.google.com" : "https://chatgpt.com", "_blank");
                   setShowAIModal(false);
                }}
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

      {step === 'config' && (
        <QuizConfig 
          topic={topic} 
          config={config} 
          setConfig={setConfig} 
          onStart={startQuiz} 
          onBack={() => navigate('/')} 
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
          score={(() => {
            let s = 0;
            questions.forEach((q, i) => { if(userAnswers[i] === q.correctIndex) s++; });
            return s;
          })()}
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