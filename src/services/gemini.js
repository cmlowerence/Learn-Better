import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MODELS_TO_TRY = [
  "gemini-2.0-flash-exp",
  "gemini-flash-latest",
  "gemini-pro"
];

export const generateQuizQuestions = async (topic, count = 5, difficulty = "medium", type = "concept") => {
  const safeCount = Math.min(Math.max(1, Number(count) || 5), 50);
  if (!topic || typeof topic !== "string") throw new Error("Invalid topic provided.");
  if (!apiKey) throw new Error("API Key is missing. Check .env file.");

  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      let cleanText = text.trim()
        .replace(/^```json/, '')
        .replace(/^```/, '')
        .replace(/```$/, '');

      try {
        const parsed = JSON.parse(cleanText);
        if (!Array.isArray(parsed)) throw new Error("Output is not an array");
        return parsed;
      } catch (e) {
        const first = cleanText.indexOf("[");
        const last = cleanText.lastIndexOf("]");
        if (first === -1) throw new Error("No JSON found");
        const extracted = cleanText.slice(first, last + 1);
        return JSON.parse(extracted);
      }

    } catch (error) {
      console.warn(`Quiz Gen Failed with ${modelName}:`, error.message);
      lastError = error;
      
      if (error.message.includes("429")) {
        await delay(2000);
      }
      continue;
    }
  }

  console.error("All models failed.");
  throw new Error(
    "Quiz generation failed. Rate limit exceeded on all available models. Please wait 1 minute."
  );
};

export const generateFlashcards = async (topic) => {
  if (!topic) throw new Error("Invalid topic provided.");
  if (!apiKey) throw new Error("API Key is missing.");

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        Create 10 educational flashcards for the topic: "${topic}".
        Focus on key definitions, formulas, important dates, or sections (if legal/act).
        
        Return strictly a JSON array of objects with "front" and "back" keys.
        Example: [{"front": "Newton's 2nd Law", "back": "F = ma"}, {"front": "Chemical formula of Ozone", "back": "O3"}]
        
        Do not add markdown formatting. Just the raw JSON array.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      
      const cleanText = text.trim()
        .replace(/^```json/, '')
        .replace(/^```/, '')
        .replace(/```$/, '');

      return JSON.parse(cleanText);

    } catch (error) {
      console.warn(`Flashcard Gen Failed with ${modelName}:`, error.message);
      if (error.message.includes("429")) await delay(2000);
      continue;
    }
  }

  throw new Error("Flashcard generation failed. Please try again later.");
};

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
