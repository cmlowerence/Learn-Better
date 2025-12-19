import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { Bot, MessageSquare, ExternalLink, X, Trash2, ArrowLeft } from 'lucide-react';

// Reuse your existing Quiz components
import QuizGame from '../components/quiz/QuizGame';
import QuizResult from '../components/quiz/QuizResult';

const MistakesPage = () => {
  const navigate = useNavigate();
  const { user, saveQuizResult } = useAuth(); // We reuse saveQuizResult to track progress even on mistakes

  const [step, setStep] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  
  // TTS & AI States
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [audioErrorId, setAudioErrorId] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAI, setSelectedAI] = useState('gemini');

  // Load Mistakes on Mount
  useEffect(() => {
    const rawMistakes = localStorage.getItem('mistake_bin');
    const parsedMistakes = rawMistakes ? JSON.parse(rawMistakes) : [];
    
    // Shuffle and take max 30 to avoid fatigue
    const shuffled = parsedMistakes.sort(() => 0.5 - Math.random()).slice(0, 30);

    if (shuffled.length > 0) {
      setQuestions(shuffled);
      setStep('quiz');
    } else {
      setStep('empty');
    }

    // Init TTS
    const updateVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();
  }, []);

  const clearMistakes = () => {
    if(window.confirm("Are you sure you want to clear your mistake history?")) {
      localStorage.removeItem('mistake_bin');
      setQuestions([]);
      setStep('empty');
    }
  };

  // --- REUSED HELPER FUNCTIONS (TTS & AI) ---
  const handleSpeak = (text, id) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (activeAudioId === id) { setActiveAudioId(null); return; }
    
    const utterance = new SpeechSynthesisUtterance(text.replace(/\$\$/g, '').replace(/\\/g, ''));
    // Simple voice selection logic
    const voice = availableVoices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    
    utterance.onend = () => setActiveAudioId(null);
    setActiveAudioId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleAskAI = (questionText, options, aiType) => {
    setSelectedAI(aiType);
    const formattedOptions = options.map((opt, i) => `${String.fromCharCode(65+i)}) ${opt}`).join('\n');
    const prompt = `Explain this question I got wrong previously:\n\n"${questionText}"\n\nOptions:\n${formattedOptions}`;
    navigator.clipboard.writeText(prompt);
    setShowAIModal(true);
  };

  const nextQuestion = () => {
    window.speechSynthesis.cancel();
    setActiveAudioId(null);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate score and finish
      // Note: We don't save mistakes OF mistakes to avoid infinite loops, 
      // but we do save the result to track effort.
      let finalScore = 0;
      questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctIndex) finalScore++;
      });
      if (user) {
        saveQuizResult("Mistake Review", finalScore, questions.length, questions, userAnswers);
      }
      setStep('result');
    }
  };

  // --- RENDER ---
  
  if (step === 'empty') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <Trash2 className="w-10 h-10 text-green-600" />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Clean Slate!</h2>
           <p className="text-gray-500 mb-8">You haven't made any mistakes yet, or you've cleared them all. Go take a quiz to populate this list.</p>
           <button onClick={() => navigate('/')} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">
             Back to Dashboard
           </button>
        </div>
      </div>
    );
  }

  const aiConfig = selectedAI === 'gemini' 
    ? { name: 'Gemini', color: 'from-blue-600 to-indigo-600', icon: <Bot className="w-8 h-8 text-white" />, url: "https://gemini.google.com" } 
    : { name: 'ChatGPT', color: 'from-green-500 to-teal-600', icon: <MessageSquare className="w-8 h-8 text-white" />, url: "https://chatgpt.com" };

  return (
    <>
      <SEO title="Mistake Review" description="Review your past incorrect answers." />
      
      {/* AI Modal (Reused) */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 relative">
            <button onClick={() => setShowAIModal(false)} className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
            <div className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-tr ${aiConfig.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>{aiConfig.icon}</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Prompt Copied!</h3>
              <button onClick={() => { window.open(aiConfig.url, "_blank"); setShowAIModal(false); }} className={`w-full bg-gradient-to-r ${aiConfig.color} text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-3`}>
                Launch {aiConfig.name} <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'quiz' && (
        <div className="relative">
          {/* Header specific to Review Mode */}
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none">
             <button onClick={() => navigate('/')} className="pointer-events-auto p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
             <button onClick={clearMistakes} className="pointer-events-auto px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 hover:bg-red-100 flex items-center gap-2">
                <Trash2 className="w-3 h-3" /> Clear History
             </button>
          </div>
          
          <QuizGame 
            questions={questions}
            currentQIndex={currentQIndex}
            userAnswers={userAnswers}
            config={{ difficulty: 'Mixed', type: 'Review' }} // Dummy config for display
            onOptionSelect={(idx) => setUserAnswers({ ...userAnswers, [currentQIndex]: idx })}
            onNext={nextQuestion}
            ttsState={{ activeAudioId, audioErrorId }}
            onSpeak={handleSpeak}
          />
        </div>
      )}

      {step === 'result' && (
        <QuizResult 
          questions={questions}
          userAnswers={userAnswers}
          score={questions.reduce((acc, q, i) => acc + (userAnswers[i] === q.correctIndex ? 1 : 0), 0)}
          topic="Mistake Review"
          user={user}
          onRestart={() => { setStep('loading'); setTimeout(() => window.location.reload(), 100); }} // Simple reload to reshuffle
          onNavigate={navigate}
          onAskAI={handleAskAI}
          ttsState={{ activeAudioId, audioErrorId }}
          onSpeak={handleSpeak}
        />
      )}
    </>
  );
};

export default MistakesPage;
