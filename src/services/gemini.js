import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const generateQuizQuestions = async (topic, count = 5, difficulty = "medium", type = "concept") => {
  // Input validation
  count = Math.min(Math.max(1, Number(count) || 5), 50);
  difficulty = String(difficulty).slice(0, 20);
  type = String(type).slice(0, 50);
  if (!topic || typeof topic !== "string") throw new Error("Invalid topic");

  try {
    // 1. Check Model Name (See point #2 below)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp", // Updated to the correct experimental name
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Generate ${count} ${difficulty} difficulty multiple choice questions about "${topic}". Return ONLY a JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Clean and Parse
    let cleanText = text.trim().replace(/^\uFEFF/, ""); // Remove BOM
    
    // Attempt parsing
    try {
      return JSON.parse(cleanText);
    } catch (e) {
      // Fallback extraction
      const first = cleanText.indexOf("[");
      const last = cleanText.lastIndexOf("]");
      if (first === -1 || last === -1) throw new Error("No JSON array found");
      
      const extracted = cleanText.slice(first, last + 1);
      return JSON.parse(extracted);
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Better error message for debugging
    throw new Error(
      "Quiz generation failed: " + 
      (error.message.includes("404") ? "Model not found (check model name)." : error.message)
    );
  }
};
