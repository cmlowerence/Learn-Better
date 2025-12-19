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
  const [error, setError] = useState(null);

  // --- 0. INJECT REQUIRED CSS ---
  // This ensures the 3D effects work even without specific Tailwind plugins
  const CustomStyles = () => (
    <style>{`
      .perspective-1000 { perspective: 1000px; }
      .preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      .rotate-y-180 { transform: rotateY(180deg); }
    `}</style>
  );

  // --- LOADING ANIMATION ---
  useEffect(() => {
    if (!loading) return;
    const tips = ["Scanning syllabus...", "Extracting key formulas...", "Formatting for memory...", "Almost ready..."];
    let i = 0;
    const interval = setInterval(() => { setLoadingTip(tips[i % tips.length]); i++; }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  // --- DATA LOADING ---
  useEffect(() => {
    loadCards();
  }, [topic]);

  const loadCards = async () => {
    setLoading(true);
    setError(null);
    setCards([]);
    try {
      const data = await generateFlashcards(topic);
      if (Array.isArray(data) && data.length > 0) {
        setCards(data);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        throw new Error("No data received");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load cards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleNext = useCallback(() => {
    if (loading || cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % cards.length), 150);
  }, [cards.length, loading]);

  const handlePrev = useCallback(() => {
    if (loading || cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length), 150);
  }, [cards.length, loading]);

  const handleFlip = useCallback(() => {
    if (!loading) setIsFlipped(prev => !prev);
  }, [loading]);

  // --- KEYBOARD SUPPORT ---
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

  // --- RENDER STATES ---

  if (loading) return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-6 text-center">
      <CustomStyles />
      <div className="bg-white/50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-xl">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-indigo-900 mb-2">Generating...</h2>
        <p className="text-slate-500 text-sm animate-pulse">{loadingTip}</p>
      </div>
    </div>
  );

  if (error || !cards[currentIndex]) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <CustomStyles />
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RotateCw className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Unavailable</h2>
        <p className="text-gray-500 mb-6">We couldn't generate cards for this topic right now.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-gray-200 rounded-xl font-bold text-gray-700">Go Back</button>
          <button onClick={loadCards} className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white">Retry</button>
        </div>
      </div>
    </div>
  );

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans relative overflow-hidden">
      <CustomStyles />
      <SEO title={`${decodeURIComponent(topic)} Flashcards`} description={`Memorize ${decodeURIComponent(topic)} concepts.`} />

      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between relative z-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm font-bold text-slate-600">
          <ArrowLeft className="w-5 h-5" /> <span className="hidden sm:inline">Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-extrabold text-slate-800 truncate max-w-[200px]">{decodeURIComponent(topic)}</h1>
          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">FLASHCARDS</span>
        </div>
        <button onClick={loadCards} className="p-2 bg-white/70 backdrop-blur-md rounded-xl shadow-sm text-slate-500 hover:text-indigo-600">
           <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-2xl mx-auto perspective-1000">
          
          {/* Progress */}
          <div className="flex justify-between items-end mb-4 px-2 text-slate-500 font-bold text-sm">
            <div className="flex items-center gap-2">
               <Layers className="w-4 h-4 text-indigo-500" /> {currentIndex + 1} / {cards.length}
            </div>
          </div>

          {/* THE CARD */}
          <div 
            onClick={handleFlip}
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] cursor-pointer"
          >
            <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* FRONT SIDE */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] border border-white/60 p-8 flex flex-col items-center justify-center text-center shadow-xl z-20">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                
                {currentCard.reference && (
                  <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <BookOpen className="w-3 h-3" /> {currentCard.reference}
                  </div>
                )}

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug">{currentCard.front}</h3>
                
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest opacity-60">
                  <RotateCw className="w-3 h-3" /> Click to Flip
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center text-white shadow-xl z-20">
                 <div className="absolute top-6 left-6 text-indigo-200/80"><Lightbulb className="w-6 h-6" /></div>
                 <p className="text-xl sm:text-2xl font-medium leading-relaxed">{currentCard.back}</p>
                 <div className="mt-8 text-[10px] font-bold text-indigo-200 uppercase tracking-widest opacity-80">Answer</div>
              </div>

            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform">
            <ArrowLeft className="w-6 h-6 text-slate-400" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleFlip(); }} className="px-8 h-16 bg-slate-900 text-white font-bold rounded-2xl shadow-xl flex items-center gap-3 hover:-translate-y-1 transition-transform">
            <Sparkles className={`w-5 h-5 ${isFlipped ? 'text-yellow-300' : 'text-slate-400'}`} />
            {isFlipped ? "Show Question" : "Reveal Answer"}
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform">
            <ArrowLeft className="w-6 h-6 rotate-180 text-slate-400" />
          </button>
        </div>

      </main>
    </div>
  );
};

export default FlashcardPage;
