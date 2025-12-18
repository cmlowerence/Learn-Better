import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

// ... (keep your existing generateQuizQuestions function here) ...

// NEW: Helper to list actual available models for debugging
export const getAvailableModels = async () => {
  const apiKey = import.meta.env.GEMINI_API_KEY;
  if (!apiKey) return "No API Key found in env.";

  try {
    // Direct REST call is often more reliable for listing than the client SDK
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      return `List Failed: ${response.status} ${response.statusText}`;
    }

    const data = await response.json();
    // Filter for "generateContent" capable models to keep list clean
    const names = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", "")) // remove 'models/' prefix
      .join(", ");
      
    return names || "No content generation models found.";
  } catch (err) {
    return "Network error fetching model list.";
  }
};
