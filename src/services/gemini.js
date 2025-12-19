import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Helper to pause execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates quiz questions with MODEL FALLBACK.
 * If one model is rate-limited or missing, it tries the next one.
 */
export const generateQuizQuestions = async (topic, count = 5, difficulty = "medium", type = "concept") => {
  // 1. Validation
  const safeCount = Math.min(Math.max(1, Number(count) || 5), 20);
  if (!topic || typeof topic !== "string") throw new Error("Invalid topic provided.");
  if (!apiKey) throw new Error("API Key is missing. Check .env file.");

  // 2. Define the Priority List of Models to try
  // We use the exact names from your debug list
  const MODELS_TO_TRY = [
    "gemini-2.5-flash",      // Priority 1: Newest
    "gemini-2.0-flash-exp",  // Priority 2: Experimental Channel
    "gemini-flash-latest",   // Priority 3: Stable Alias
    "gemini-2.0-flash"       // Priority 4: Previous Attempt
  ];

  let lastError = null;

  // 3. Loop through models until one works
  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Attempting to generate with model: ${modelName}...`);
      
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        You are a strict JSON generator.
        Generate a quiz with exactly ${safeCount} questions about "${topic}".
        Difficulty: ${difficulty}.
        Focus: ${type}.

        Output must be a raw JSON array of objects.
        Schema per object:
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctIndex": number (0-3),
          "explanation": "string (brief explanation)"
        }
        
        Do not include markdown.
      `;

      // API Call
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      // Parse Logic
      let cleanText = text.trim()
        .replace(/^```json/, '')
        .replace(/^```/, '')
        .replace(/```$/, '');

      try {
        const parsed = JSON.parse(cleanText);
        if (!Array.isArray(parsed)) throw new Error("Output is not an array");
        return parsed; // SUCCESS! Return result and exit loop.
      } catch (e) {
        // Fallback extraction
        const first = cleanText.indexOf("[");
        const last = cleanText.lastIndexOf("]");
        if (first === -1) throw new Error("No JSON found");
        const extracted = cleanText.slice(first, last + 1);
        return JSON.parse(extracted);
      }

    } catch (error) {
      console.warn(`Failed with ${modelName}:`, error.message);
      lastError = error;
      
      // If it's a Rate Limit (429), wait 2 seconds before trying the NEXT model
      if (error.message.includes("429")) {
        await delay(2000);
      }
      // If it's a 404 (Model not found), just loop immediately to the next one
      continue;
    }
  }

  // 4. If all models fail, throw the last error
  console.error("All models failed.");
  throw new Error(
    "Quiz generation failed. Rate limit exceeded on all available models. Please wait 1 minute."
  );
};

// ... keep getAvailableModels same as before ...
export const getAvailableModels = async () => {
  if (!apiKey) return "No API Key available.";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) return `Error ${response.status}: ${response.statusText}`;
    const data = await response.json();
    const modelNames = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", ""))
      .join(", ");
    return modelNames || "No compatible models found.";
  } catch (err) {
    return "Network error: Could not fetch model list.";
  }
};
