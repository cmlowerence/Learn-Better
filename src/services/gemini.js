import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
const apiKey = import.meta.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generates quiz questions using Google Gemini.
 * @param {string} topic - The subject of the quiz.
 * @param {number} count - Number of questions (default 5).
 * @param {string} difficulty - Difficulty level (e.g., "Medium").
 * @param {string} type - Question type (e.g., "Conceptual").
 * @returns {Promise<Array>} - Array of question objects.
 */
export const generateQuizQuestions = async (topic, count = 5, difficulty = "medium", type = "concept") => {
  // 1. Input Validation
  const safeCount = Math.min(Math.max(1, Number(count) || 5), 20); // Cap at 20 to prevent timeouts
  if (!topic || typeof topic !== "string") throw new Error("Invalid topic provided.");
  if (!apiKey) throw new Error("API Key is missing. Check .env file.");

  try {
    // 2. Select Model
    // Use 'gemini-1.5-flash' for speed and stability.
    // If you have access to 2.0, use 'gemini-2.0-flash-exp'
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    // 3. Construct Prompt
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

      Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    `;

    // 4. API Call
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // 5. Cleaning & Parsing
    // Remove markdown code blocks if present (common AI behavior)
    let cleanText = text.trim()
      .replace(/^```json/, '') // Remove start block
      .replace(/^```/, '')     // Remove start block if just ```
      .replace(/```$/, '');    // Remove end block

    // Attempt Parse
    try {
      const parsed = JSON.parse(cleanText);
      if (!Array.isArray(parsed)) throw new Error("Output is not an array");
      return parsed;
    } catch (parseError) {
      console.warn("Direct JSON parse failed, attempting substring extraction...");
      
      // Fallback: Find the first '[' and last ']'
      const first = cleanText.indexOf("[");
      const last = cleanText.lastIndexOf("]");
      
      if (first === -1 || last === -1) {
        throw new Error("No JSON array found in response.");
      }

      const extracted = cleanText.slice(first, last + 1);
      return JSON.parse(extracted);
    }

  } catch (error) {
    console.error("Gemini Service Error:", error);
    
    // Pass specific error messages up to the UI
    const msg = error.message.toLowerCase();
    if (msg.includes("404") || msg.includes("not found")) {
      throw new Error("Model not found. The API Key might be invalid or the model name is wrong.");
    } else if (msg.includes("429")) {
      throw new Error("Rate limit exceeded. Please wait a moment.");
    } else {
      throw error; // Re-throw original error
    }
  }
};

/**
 * DEBUG HELPER: Lists available models for your API key.
 * This helps diagnose "404 Model Not Found" errors.
 */
export const getAvailableModels = async () => {
  if (!apiKey) return "No API Key available.";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      return `Error ${response.status}: ${response.statusText}`;
    }

    const data = await response.json();
    
    // Filter to only show models that can generate content
    const modelNames = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", ""))
      .join(", ");

    return modelNames || "No compatible models found.";
  } catch (err) {
    return "Network error: Could not fetch model list.";
  }
};
