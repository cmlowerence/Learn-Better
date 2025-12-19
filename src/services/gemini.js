import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY_1,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3
].filter(Boolean);

const MODELS_TO_TRY = [
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash",
  "gemini-exp-1206",
  "gemini-flash-latest"
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Rotates keys to avoid 429 errors
const generateWithKeyRotation = async (modelName, prompt, jsonMode = true) => {
  if (API_KEYS.length === 0) throw new Error("No API Keys found.");

  const shuffledKeys = [...API_KEYS].sort(() => 0.5 - Math.random());
  let lastError = null;

  for (const apiKey of shuffledKeys) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: jsonMode ? { responseMimeType: "application/json" } : {}
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return await response.text();

    } catch (error) {
      const isRateLimit = error.message.includes("429") || error.message.includes("503");
      if (isRateLimit) {
        console.warn(`Key limit hit (${modelName}). Switching...`);
        lastError = error;
        continue;
      }
      throw error;
    }
  }
  throw lastError || new Error(`All keys failed for ${modelName}`);
};

export const generateQuizQuestions = async (topic, count = 5, difficulty = "medium", type = "concept") => {
  const safeCount = Math.min(Math.max(1, Number(count) || 5), 50);
  if (!topic) throw new Error("Invalid topic.");

  for (const modelName of MODELS_TO_TRY) {
    try {
      const prompt = `
        Generate a quiz with exactly ${safeCount} questions about "${topic}".
        Difficulty: ${difficulty}. Focus: ${type}.
        Output: JSON array of objects.
        Schema: { "question": "string", "options": ["string", "string", "string", "string"], "correctIndex": number, "explanation": "string" }
      `;

      const text = await generateWithKeyRotation(modelName, prompt, true);
      const cleanText = text.replace(/```json|```/g, '').trim();

      try {
        return JSON.parse(cleanText);
      } catch (e) {
        const match = cleanText.match(/\[.*\]/s);
        if (match) return JSON.parse(match[0]);
      }
    } catch (error) {
      console.warn(`${modelName} failed. Retrying...`);
      await delay(500);
    }
  }
  throw new Error("Quiz generation failed. Please wait a moment.");
};

export const generateFlashcards = async (topic) => {
  if (!topic) throw new Error("Invalid topic.");

  for (const modelName of MODELS_TO_TRY) {
    try {
      const prompt = `
        Create 10 flashcards for "${topic}".
        Output: JSON array of objects.
        Schema: { "front": "term", "back": "definition", "reference": "context tag" }
      `;

      const text = await generateWithKeyRotation(modelName, prompt, true);
      const cleanText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.warn(`${modelName} failed. Retrying...`);
      await delay(500);
    }
  }
  throw new Error("Flashcard generation failed.");
};

export const getAvailableModels = async () => {
  if (API_KEYS.length === 0) return "No API Keys.";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEYS[0]}`);
    if (!response.ok) return "Error fetching models";
    const data = await response.json();
    return data.models.map(m => m.name.replace("models/", "")).join(", ");
  } catch (err) {
    return "Network error.";
  }
};
