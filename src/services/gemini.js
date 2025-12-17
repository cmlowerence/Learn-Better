import { GoogleGenerativeAI } from "@google/generative-ai";

// Use process.env for Next.js. 
// Ensure this runs server-side (Server Action) to keep the key safe.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateQuizQuestions = async (topic, count = 5, difficulty = "medium") => {
  // 1. Input Sanitization
  const cleanCount = Math.min(Math.max(1, Number(count) || 5), 10); // Cap at 10 for speed
  const cleanDiff = String(difficulty).slice(0, 20);
  
  if (!topic) throw new Error("Invalid topic provided.");

  try {
    // 2. Model Selection
    // 'gemini-2.0-flash-exp' is great but experimental. 
    // Fallback to 'gemini-1.5-flash' if you hit stability issues.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp", 
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.7, // Add some creativity but keep it focused
      }
    });

    // 3. Structured Prompting (Crucial for consistent JSON)
    const prompt = `
      You are a teacher. Generate ${cleanCount} multiple-choice questions about "${topic}".
      Difficulty Level: ${cleanDiff}.
      
      Return a raw JSON array. Each object in the array MUST follow this exact structure:
      {
        "question": "The question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "The correct option text (must match one of the options exactly)",
        "explanation": "Brief explanation of why the answer is correct"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Parse
    const quizData = JSON.parse(text);
    return quizData;

  } catch (error) {
    console.error("Quiz Generation Error:", error);
    throw new Error("Failed to generate quiz. Please try again.");
  }
};
