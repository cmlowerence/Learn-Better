import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateFlashcards } from '../services/gemini';
import { ArrowLeft, RefreshCw, Layers, Sparkles, BookOpen, RotateCw, Lightbulb } from 'lucide-react';
import SEO from '../components/SEO';

const FlashcardPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loadingTip, setLoadingTip] = useState("Curating key concepts...");

  // --- LOADING TIPS ANIMATION ---
  useEffect(() => {
    if (!loading) return;
    const tips = [
      "Scanning syllabus...",
      "Extracting key formulas...",
      "Identifying important dates...",
      "Formatting for memory retention...",
      "Almost ready..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingTip(tips[i % tips.length]);
      i++;
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  // --- DATA LOADING ---
  useEffect(() => {
    loadCards();
  }, [topic]);

  const loadCards = async () => {
    setLoading(true);
    setCards([]); // Clear previous cards
    try {
      const data = await generateFlashcards(topic);
      if (Array.isArray(data) && data.length > 0) {
        setCards(data);
      } else {
        throw new Error("No data");
      }
    } catch (e) {
      console.error(e);
      // Optional: Add error state here instead of alert
      alert("AI is busy or high traffic. Please try reloading.");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // --- NAVIGATION HANDLERS ---
  const handleNext = useCallback(() => {
    if (loading || cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  }, [cards.length, loading]);

  const handlePrev = useCallback(() => {
    if (loading || cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  }, [cards.length, loading]);

  const handleFlip = useCallback(() => {
    if (!loading) setIsFlipped(prev => !prev);
  }, [loading]);

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFlip]);

  // --- LOADING VIEW ---
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <div className="relative z-10 bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl max-w-sm w-full">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-t-4 border-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-b-4 border-purple-500 rounded-full animate-spin reverse"></div>
          <BrainCircuit className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
        </div>
        <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          Generating Flashcards
        </h2>
        <p className="text-sm font-medium text-slate-500 min-h-[1.5rem] transition-all duration-300">
          {loadingTip}
        </p>
      </div>
    </div>
  );

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      <SEO title={`${decodeURIComponent(topic)} Flashcards`} description={`Memorize ${decodeURIComponent(topic)} concepts.`} />

      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-600 font-bold hover:text-indigo-600"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          <span className="hidden sm:inline">Back</span>
        </button>
        
        <div className="flex flex-col items-center">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight text-center max-w-[200px] sm:max-w-md truncate">
            {decodeURIComponent(topic)}
          </h1>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full mt-1">
            Flashcard Mode
          </span>
        </div>

        <div className="w-[88px] flex justify-end"> {/* Spacer/Action */}
           <button onClick={loadCards} title="Regenerate" className="p-2 bg-white/70 backdrop-blur-md rounded-xl hover:bg-white text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
             <RefreshCw className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10">
        
        {/* Card Container */}
        <div className="w-full max-w-2xl mx-auto perspective-1000">
          
          {/* Progress Indicator */}
          <div className="flex justify-between items-end mb-4 px-2">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
               <Layers className="w-4 h-4 text-indigo-500" />
               Card {currentIndex + 1} <span className="text-slate-300">/</span> {cards.length}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
              Press Space to Flip
            </div>
          </div>

          {/* THE CARD */}
          <div 
            onClick={handleFlip}
            className="group relative w-full aspect-[4/3] sm:aspect-[16/9] cursor-pointer"
            style={{ perspective: "1000px" }}
          >
            <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''} shadow-2xl shadow-indigo-100/50 rounded-[2rem]`}>
              
              {/* --- FRONT SIDE --- */}
              <div className={`absolute inset-0 backface-hidden bg-white rounded-[2rem] border border-white/60 p-8 sm:p-12 flex flex-col items-center justify-center text-center overflow-hidden ${isFlipped ? 'z-0' : 'z-10'}`}>
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                
                {/* Reference Tag */}
                {currentCard.reference && (
                  <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100/50">
                    <BookOpen className="w-3 h-3" /> {currentCard.reference}
                  </div>
                )}

                <div className="flex-1 flex items-center justify-center z-10 w-full">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-snug">
                    {currentCard.front}
                  </h3>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                  <RotateCw className="w-3 h-3" /> Click to Flip
                </div>
              </div>

              {/* --- BACK SIDE --- */}
              <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-[2rem] p-8 sm:p-12 flex flex-col items-center justify-center text-center text-white overflow-hidden shadow-inner ${isFlipped ? 'z-10' : 'z-0'}`}>
                 {/* Decorative circles */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                 <div className="absolute top-6 left-6 text-indigo-200/80">
                   <Lightbulb className="w-6 h-6" />
                 </div>

                 <div className="flex-1 flex items-center justify-center z-10 w-full">
                   <p className="text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed drop-shadow-sm">
                     {currentCard.back}
                   </p>
                 </div>
                 
                 <div className="mt-4 text-[10px] font-bold text-indigo-200 uppercase tracking-widest opacity-80">
                   Answer
                 </div>
              </div>

            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-6 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
            className="w-14 h-14 flex items-center justify-center bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleFlip(); }} 
            className="h-16 px-8 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:shadow-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            <Sparkles className={`w-5 h-5 ${isFlipped ? 'text-yellow-300 fill-yellow-300' : 'text-slate-400'}`} />
            {isFlipped ? "Show Question" : "Reveal Answer"}
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }} 
            className="w-14 h-14 flex items-center justify-center bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 group"
          >
            <ArrowLeft className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
          </button>
        </div>

      </main>
    </div>
  );
};

export default FlashcardPage;
