import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateQuizQuestions = async (topic, count, difficulty, type) => {
  try {
    // We use 'gemini-2.0-flash' as it appeared explicitly in your available models list
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a strict academic professor preparing an exam for graduation-level students (B.Sc/B.Tech).
      Topic: "${topic}"
      
      Generate a quiz with exactly ${count} Multiple Choice Questions.
      Difficulty Level: ${difficulty}.
      Question Focus: ${type}.
      
      Output Format requirements:
      1. Return ONLY a valid JSON array. Do not wrap in markdown code blocks.
      2. JSON Structure:
      [
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0,
          "explanation": "Detailed explanation."
        }
      ]
      
      IMPORTANT: The "correctIndex" must be a number (0-3) corresponding to the correct option.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI Response:", text); // Helpful for debugging

    // --- ROBUST JSON PARSING ---
    // This logic extracts the JSON array even if the AI adds text around it
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');

    if (firstBracket === -1 || lastBracket === -1) {
      throw new Error("AI response did not contain a valid JSON array.");
    }

    const cleanJson = text.substring(firstBracket, lastBracket + 1);

    return JSON.parse(cleanJson);
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Provide a user-friendly error message
    throw new Error(
      "Quiz generation failed. " + 
      (error.message.includes("404") ? "Model not found (Check SDK version)." : error.message)
    );
  }
};