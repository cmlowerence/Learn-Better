import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const generateQuizQuestions = async (topic, count, difficulty, type) => {
  try {
    // Use gemini-2.0-flash for speed and JSON mode
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: { 
        responseMimeType: "application/json" 
      }
    });

    const prompt = `
      You are a strict academic professor preparing an exam for graduation-level students.
      Topic: "${topic}"
      
      Generate a quiz with exactly ${count} Multiple Choice Questions.
      Difficulty: ${difficulty}. 
      Focus: ${type}.

      MATH FORMATTING RULES:
      1. Use LaTeX for ALL math symbols (integrals, fractions, greek letters, etc.).
      2. Enclose LaTeX in double dollar signs: $$ \int x dx $$ or $$ \alpha $$.
      3. Do NOT add extra backslashes. Just use standard LaTeX formatting inside the JSON string.
         - Correct JSON example: { "question": "Find $$ \\alpha $$" }
         - Incorrect: { "question": "Find $$ \\\\alpha $$" }

      Output a JSON array with this structure:
      [
        {
          "question": "Question text...",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0,
          "explanation": "Detailed explanation..."
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI Response:", text); 

    try {
        const cleanText = text.trim();
        return JSON.parse(cleanText);
    } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        // Fallback: Try to find the array if the model added extra text
        const firstBracket = text.indexOf('[');
        const lastBracket = text.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
            const extracted = text.substring(firstBracket, lastBracket + 1);
            return JSON.parse(extracted);
        }
        throw new Error("Invalid JSON format received from AI.");
    }
    
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error(
      "Quiz generation failed. " + 
      (error.message.includes("404") ? "Model not found. Check API Key." : error.message)
    );
  }
};