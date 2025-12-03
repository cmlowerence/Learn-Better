import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const generateQuizQuestions = async (topic, count = 5, difficulty = "medium", type = "concept") => {
  // Basic input validation
  count = Math.min(Math.max(1, Number(count) || 5), 50);
  difficulty = String(difficulty).slice(0, 20);
  type = String(type).slice(0, 50);
  if (!topic || typeof topic !== "string") throw new Error("Invalid topic");

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `...`; // keep your prompt text

    const result = await model.generateContent(prompt);
    // result.response may be an object with .text() async; ensure awaiting
    const response = await result.response;
    const text = await response.text(); // <<--- MUST await

    // Normalize BOM and whitespace
    let cleanText = text.trim().replace(/^\uFEFF/, "");

    // Try direct parse
    try {
      const parsed = JSON.parse(cleanText);
      return parsed;
    } catch (err) {
      // Fallback: extract first JSON array-like substring and sanitize trailing commas
      const first = cleanText.indexOf("[");
      const last = cleanText.lastIndexOf("]");
      if (first === -1 || last === -1) throw new Error("No JSON array found in model output");
      let extracted = cleanText.slice(first, last + 1);

      // Remove trailing commas before closing brackets (simple sanitization)
      extracted = extracted.replace(/,\s*(\]|})/g, "$1");

      const parsed = JSON.parse(extracted);
      return parsed;
    }
  } catch (error) {
    console.error("Quiz generation failed:", error.message || error);
    throw new Error("Quiz generation failed: " + (error.message || "unknown error"));
  }
};    console.error("Gemini Service Error:", error);
    throw new Error(
      "Quiz generation failed. " + 
      (error.message.includes("404") ? "Model not found. Check API Key." : error.message)
    );
  }
};
