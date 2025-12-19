import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateFlashcards } from '../services/gemini';
import { ArrowLeft, RefreshCw, Layers, Sparkles, BookOpen, RotateCw, Lightbulb, AlertCircle } from 'lucide-react';
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
  const CustomStyles = () => (
    <style>{`
      .perspective-1000 { perspective: 1000px; }
      .preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      
      /* Hide scrollbar for Chrome, Safari and Opera */
      .no-scrollbar::-webkit-scrollbar { display: none; }
      /* Hide scrollbar for IE, Edge and Firefox */
      .no-scrollbar { -ms-overflow-style: none;  scrollbar-width: none; }
    `}</style>
  );

  // --- DATA LOADING ---
  useEffect(() => {
    loadCards();
  }, [topic]);

  // Cycle loading tips
  useEffect(() => {
    if (!loading) return;
    const tips = ["Scanning syllabus...", "Extracting key formulas...", "Formatting for memory...", "Almost ready..."];
    let i = 0;
    const interval = setInterval(() => { setLoadingTip(tips[i % tips.length]); i++; }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

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


  // --- SUB-COMPONENTS ---
  
  // 1. Skeleton Card (Prevents layout resizing)
  const SkeletonCard = () => (
    <div className="relative w-full h-full bg-white rounded-[2rem] border border-white/60 p-8 shadow-xl overflow-hidden">
      <div className="animate-pulse flex flex-col items-center justify-center h-full gap-4">
        <div className="h-4 w-24 bg-slate-200 rounded-full mb-4"></div>
        <div className="h-6 w-3/4 bg-slate-200 rounded-lg"></div>
        <div className="h-6 w-1/2 bg-slate-200 rounded-lg"></div>
        <div className="h-6 w-2/3 bg-slate-200 rounded-lg"></div>
        <div className="mt-8 h-3 w-32 bg-indigo-100 rounded-full"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]"></div>
    </div>
  );

  // 2. Error Card
  const ErrorCard = () => (
    <div className="relative w-full h-full bg-red-50 rounded-[2rem] border border-red-100 p-8 flex flex-col items-center justify-center text-center shadow-sm">
      <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
      <h3 className="text-lg font-bold text-red-900">Content Unavailable</h3>
      <p className="text-sm text-red-600 mb-6">We couldn't generate cards right now.</p>
      <button onClick={loadCards} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
        Try Again
      </button>
    </div>
  );

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans relative overflow-hidden">
      <CustomStyles />
      <SEO title={`${decodeURIComponent(topic)} Flashcards`} description={`Memorize ${decodeURIComponent(topic)} concepts.`} />

      {/* Header - Always visible to maintain structure */}
      <header className="px-6 py-5 flex items-center justify-between relative z-10 shrink-0 h-20">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm font-bold text-slate-600 hover:bg-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> <span className="hidden sm:inline">Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-extrabold text-slate-800 truncate max-w-[200px]">{decodeURIComponent(topic)}</h1>
          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">FLASHCARDS</span>
        </div>
        <button onClick={loadCards} className="p-2 bg-white/70 backdrop-blur-md rounded-xl shadow-sm text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors">
           <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-4xl mx-auto">
        
        <div className="w-full max-w-2xl perspective-1000">
          
          {/* Progress Indicator */}
          <div className="flex justify-between items-end mb-4 px-2 text-slate-500 font-bold text-sm h-6">
            {!loading && !error && (
              <div className="flex items-center gap-2 animate-fade-in">
                 <Layers className="w-4 h-4 text-indigo-500" /> {currentIndex + 1} / {cards.length}
              </div>
            )}
            {loading && <span className="text-indigo-400 text-xs animate-pulse">{loadingTip}</span>}
          </div>

          {/* THE CARD CONTAINER */}
          {/* Fixed Aspect Ratio ensures no jumping */}
          <div 
            onClick={!loading && !error ? handleFlip : undefined}
            className={`relative w-full aspect-[4/3] sm:aspect-[16/9] ${(!loading && !error) ? 'cursor-pointer' : ''}`}
          >
            {loading ? (
              <SkeletonCard />
            ) : error ? (
              <ErrorCard />
            ) : (
              <div className={`relative w-full h-full duration-500 preserve-3d transition-all ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                
                {/* --- FRONT SIDE --- */}
                {/* zIndex logic prevents ghosting */}
                <div 
                  className="absolute inset-0 backface-hidden bg-white rounded-[2rem] border border-white/60 shadow-xl overflow-hidden"
                  style={{ zIndex: isFlipped ? 0 : 10 }}
                >
                  {/* Internal Flex Structure for Overflow Handling */}
                  <div className="w-full h-full flex flex-col p-6 sm:p-8">
                    
                    {/* Top: Decoration */}
                    <div className="flex justify-between items-start shrink-0 mb-2">
                       <div className="opacity-[0.1] text-indigo-600"><Sparkles className="w-6 h-6" /></div>
                       {currentCard.reference && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          <BookOpen className="w-3 h-3" /> {currentCard.reference}
                        </div>
                      )}
                    </div>

                    {/* Middle: Scrollable Content */}
                    <div className="flex-1 flex items-center justify-center overflow-y-auto no-scrollbar py-2">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 leading-snug text-center select-none">
                        {currentCard.front}
                      </h3>
                    </div>

                    {/* Bottom: Hint */}
                    <div className="mt-auto shrink-0 pt-4 flex items-center justify-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest opacity-60">
                      <RotateCw className="w-3 h-3" /> Click to Flip
                    </div>
                  </div>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                </div>


                {/* --- BACK SIDE --- */}
                <div 
                  className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] shadow-xl overflow-hidden"
                  style={{ zIndex: isFlipped ? 10 : 0 }}
                >
                   {/* Internal Flex Structure */}
                   <div className="w-full h-full flex flex-col p-6 sm:p-8 text-white">
                      
                      {/* Top: Icon */}
                      <div className="shrink-0 mb-4 flex justify-start">
                        <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm text-indigo-100">
                          <Lightbulb className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Middle: Scrollable Content */}
                      <div className="flex-1 flex items-center justify-center overflow-y-auto no-scrollbar py-2">
                         <p className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-center select-none">
                           {currentCard.back}
                         </p>
                      </div>

                      {/* Bottom: Label */}
                      <div className="mt-auto shrink-0 pt-4 text-center">
                        <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest opacity-80 border-t border-indigo-400/30 pt-4 px-8">
                          Answer
                        </span>
                      </div>
                   </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Controls - Fixed height wrapper prevents jumping when disabled */}
        <div className="mt-8 h-20 flex items-center justify-center gap-4 sm:gap-6 w-full max-w-md">
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
            disabled={loading || cards.length === 0}
            className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <ArrowLeft className="w-6 h-6 text-slate-400" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleFlip(); }} 
            disabled={loading || cards.length === 0}
            className="flex-1 max-w-[200px] h-14 bg-slate-900 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Sparkles className={`w-5 h-5 ${isFlipped ? 'text-yellow-300' : 'text-slate-400'}`} />
            <span className="whitespace-nowrap">{isFlipped ? "Show Question" : "Reveal Answer"}</span>
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }} 
            disabled={loading || cards.length === 0}
            className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <ArrowLeft className="w-6 h-6 rotate-180 text-slate-400" />
          </button>
        </div>

      </main>
    </div>
  );
};

export default FlashcardPage;
