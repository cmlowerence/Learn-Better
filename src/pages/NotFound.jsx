// src/pages/NotFound.jsx
import React from 'react';
import SEO from '../components/SEO'; 
import { useNavigate } from 'react-router-dom';
import { Home, MoveLeft, FileQuestion, SearchX } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
      <SEO title="404 Not Found" description="The page you are looking for does not exist." />
      
      {/* --- DECORATIVE BACKGROUND BLOBS --- */}
      {/* Purple Blob */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      {/* Indigo Blob */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700" />
      {/* Pink Blob */}
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />

      {/* --- MAIN CARD --- */}
      <div className="relative z-10 max-w-lg w-full mx-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 text-center">
          
          {/* Icon Wrapper */}
          <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <SearchX className="w-12 h-12 text-indigo-600" />
          </div>

          {/* 404 Text */}
          <h1 className="text-6xl font-black text-gray-900 mb-2 tracking-tight">
            404
          </h1>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Oops! It seems the topic or page you are looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Go Back Button */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
            >
              <MoveLeft className="w-4 h-4" />
              Go Back
            </button>

            {/* Go Home Button */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </div>

        </div>

        {/* Footer decoration */}
        <p className="mt-8 text-center text-gray-400 text-sm font-medium">
          TGT Explorer
        </p>
      </div>
    </div>
  );
};

export default NotFound;
