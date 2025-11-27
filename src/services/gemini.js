import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateQuizQuestions = async (topic, count, difficulty, type) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a strict academic professor preparing an exam for graduation-level students (B.Sc/B.Tech).
      Topic: "${topic}"
      
      Generate a quiz with exactly ${count} Multiple Choice Questions.
      Difficulty Level: ${difficulty} (Ensure questions are not trivial).
      Question Focus: ${type} (If 'Numerical', provide problems requiring calculation. If 'Conceptual', test deep understanding).
      
      Output Format requirements:
      1. Return ONLY a valid JSON array. Do not wrap in markdown code blocks.
      2. JSON Structure:
      [
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0, (index of the correct answer, 0-3)
          "explanation": "Detailed explanation of why the answer is correct and why others are wrong."
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cleanup: Sometimes AI wraps JSON in ```json ... ```. We remove that.
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate quiz. Please check your API key or try again.");
  }
};
