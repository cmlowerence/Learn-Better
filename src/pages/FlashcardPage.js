import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateFlashcards } from '../services/gemini';
import { ArrowLeft, RefreshCw, Layers, BrainCircuit } from 'lucide-react';
import SEO from '../components/SEO';

const FlashcardPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    loadCards();
  }, [topic]);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await generateFlashcards(topic);
      setCards(data);
    } catch (e) {
      alert("AI is busy. Please try again.");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 200);
  };

  if (loading) return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mb-4"></div>
      <h2 className="text-xl font-bold text-indigo-900 animate-pulse">Generating Flashcards...</h2>
      <p className="text-indigo-500">Curating key facts for {topic}</p>
    </div>
  );

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <SEO title={`${topic} Flashcards`} description={`Memorize ${topic} concepts.`} />

      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-lg font-bold text-gray-800 truncate max-w-[200px] sm:max-w-md">{decodeURIComponent(topic)}</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        
        {/* Progress */}
        <div className="mb-8 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-500">
          <Layers className="w-4 h-4" /> 
          {currentIndex + 1} / {cards.length}
        </div>

        {/* THE CARD */}
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full max-w-xl aspect-[4/3] sm:aspect-video cursor-pointer group perspective-1000"
        >
          <div className={`w-full h-full relative preserve-3d transition-all duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* FRONT */}
            <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center hover:border-indigo-300 transition-colors">
              <span className="absolute top-6 left-6 text-xs font-black tracking-widest text-indigo-200 uppercase">Front</span>
              <h3 className="text-2xl sm:text-4xl font-black text-gray-800 leading-tight">
                {currentCard.front}
              </h3>
              <p className="mt-8 text-indigo-500 text-sm font-bold animate-bounce">Click to Flip</p>
            </div>

            {/* BACK */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white">
              <span className="absolute top-6 left-6 text-xs font-black tracking-widest text-indigo-300 uppercase">Back</span>
              <p className="text-xl sm:text-3xl font-medium leading-relaxed">
                {currentCard.back}
              </p>
            </div>

          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex gap-4">
          <button onClick={handlePrev} className="p-4 bg-white rounded-full shadow-md hover:scale-110 transition-all border border-gray-100"><ArrowLeft className="w-6 h-6 text-gray-700" /></button>
          <button onClick={() => loadCards()} className="p-4 bg-white rounded-full shadow-md hover:scale-110 transition-all border border-gray-100" title="Regenerate"><RefreshCw className="w-6 h-6 text-indigo-600" /></button>
          <button onClick={handleNext} className="p-4 bg-white rounded-full shadow-md hover:scale-110 transition-all border border-gray-100"><ArrowLeft className="w-6 h-6 text-gray-700 rotate-180" /></button>
        </div>

      </div>
    </div>
  );
};

export default FlashcardPage;
