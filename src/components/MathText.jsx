// src/components/MathText.jsx
import React, { useState, useEffect, useRef } from 'react';

const MathText = ({ text, className = "" }) => {
  const containerRef = useRef(null);
  const [isKatexLoaded, setIsKatexLoaded] = useState(false);

  // 1. Inject KaTeX scripts only once
  useEffect(() => {
    // Check if already present
    if (window.katex) {
      setIsKatexLoaded(true);
      return;
    }

    // Inject CSS
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
    }

    // Inject JS
    if (!document.getElementById('katex-js')) {
      const script = document.createElement('script');
      script.id = 'katex-js';
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.defer = true;
      script.onload = () => setIsKatexLoaded(true);
      script.onerror = () => console.error("KaTeX failed to load");
      document.body.appendChild(script);
    } else {
      // Script tag exists but might not be loaded yet
      const checkInterval = setInterval(() => {
        if (window.katex) {
          setIsKatexLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }
  }, []);

  // 2. Render logic
  useEffect(() => {
    if (!containerRef.current) return;

    // Fallback: Display text raw if empty or script failed
    if (!text) {
      containerRef.current.innerText = "";
      return;
    }

    if (!isKatexLoaded) {
      // While loading, strip delimiters so it looks readable
      containerRef.current.innerText = text.replace(/\$\$/g, '');
      return;
    }

    try {
      // Split by $$ to separate text from math
      const parts = text.split('$$');
      containerRef.current.innerHTML = ''; // Clear

      parts.forEach((part, index) => {
        const span = document.createElement('span');
        
        // Odd indices (1, 3, 5...) are the math parts between $$...$$
        if (index % 2 === 1) { 
          try {
            window.katex.render(part, span, { 
              throwOnError: false, 
              displayMode: false // Inline math
            });
            span.classList.add('text-indigo-700', 'font-bold', 'px-1'); // Styling for math
          } catch (e) {
            span.innerText = `$$${part}$$`; // Keep raw if parse fails
          }
        } else {
          // Even indices are normal text
          span.innerText = part;
        }
        containerRef.current.appendChild(span);
      });
    } catch (err) {
      console.error("Math Render Error:", err);
      containerRef.current.innerText = text;
    }
  }, [text, isKatexLoaded]);

  return <span ref={containerRef} className={`math-content ${className}`} />;
};

export default MathText;

