import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const DRAMATIC_PHRASES = [
  "Consulting the digital oracle...",
  "Weaving the threads of knowledge...",
  "Summoning the spirits of academia...",
  "Calibrating quantum difficulty...",
  "Extracting wisdom from the ether...",
  "Polishing the gems of inquiry...",
  "Constructing your intellectual gauntlet..."
];

const QuizLoading = () => {
  const [loadingPhrase, setLoadingPhrase] = useState(DRAMATIC_PHRASES[0]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % DRAMATIC_PHRASES.length;
      setLoadingPhrase(DRAMATIC_PHRASES[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[500px] sm:h-[500px] bg-indigo-500 rounded-full blur-[80px] sm:blur-[120px] opacity-30 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <div className="relative mb-8 sm:mb-10">
           <div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-40 animate-ping rounded-full"></div>
           <Loader2 className="w-16 h-16 sm:w-24 sm:h-24 text-white animate-spin relative z-10" />
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 mb-4 sm:mb-6 animate-pulse tracking-tight">
          Generating Intelligence...
        </h2>
        <p className="text-indigo-200 text-lg sm:text-xl font-medium leading-relaxed italic opacity-90 transition-all duration-500 font-serif">
          "{loadingPhrase}"
        </p>
      </div>
    </div>
  );
};

export default QuizLoading;
