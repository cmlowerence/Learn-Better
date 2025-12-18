import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Helper function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates quiz questions using Google Gemini.
 * Includes automatic retry for rate limits (429 errors).
 */
export const generateQuizQuestions = async (topic, count = 5, difficulty = "medium", type = "concept") => {
  // 1. Input Validation
  const safeCount = Math.min(Math.max(1, Number(count) || 5), 20);
  if (!topic || typeof topic !== "string") throw new Error("Invalid topic provided.");
  if (!apiKey) throw new Error("API Key is missing. Check .env file.");

  // Retry configuration
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      // 2. Select Model (gemini-2.0-flash is confirmed working for your key)
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
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
      let cleanText = text.trim()
        .replace(/^```json/, '')
        .replace(/^```/, '')
        .replace(/```$/, '');

      try {
        const parsed = JSON.parse(cleanText);
        if (!Array.isArray(parsed)) throw new Error("Output is not an array");
        return parsed; // Success! Return immediately.
      } catch (parseError) {
        // Fallback for messy JSON
        const first = cleanText.indexOf("[");
        const last = cleanText.lastIndexOf("]");
        if (first === -1 || last === -1) throw new Error("No JSON array found in response.");
        const extracted = cleanText.slice(first, last + 1);
        return JSON.parse(extracted);
      }

    } catch (error) {
      const msg = error.message ? error.message.toLowerCase() : "";
      
      // Check specifically for Rate Limit (429)
      if (msg.includes("429") || msg.includes("rate limit") || msg.includes("quota")) {
        attempt++;
        console.warn(`Rate limit hit. Retrying in ${attempt * 2} seconds... (Attempt ${attempt}/${MAX_RETRIES})`);
        
        if (attempt >= MAX_RETRIES) {
          throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
        }
        
        // Wait 2s, 4s, then 6s
        await delay(attempt * 2000);
        continue; // Retry loop
      }

      // If it's NOT a rate limit error, throw immediately (don't retry 404s)
      console.error("Gemini Service Error:", error);
      if (msg.includes("404") || msg.includes("not found")) {
        throw new Error("Model not found. The API Key might be invalid or the model name is wrong.");
      } else {
        throw error;
      }
    }
  }
};

/**
 * DEBUG HELPER: Lists available models for your API key.
 */
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
