// REPLACE THIS STRING WITH YOUR ACTUAL API KEY
const API_KEY = "none"; 

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

  console.log("Checking available models...");

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("Error:", data.error.message);
      return;
    }

    console.log("\n--- YOUR AVAILABLE MODELS ---");
    const usefulModels = data.models.filter(m => 
      m.supportedGenerationMethods && 
      m.supportedGenerationMethods.includes("generateContent")
    );

    usefulModels.forEach(model => {
      console.log(`Name: ${model.name}`);
      console.log(`ID:   ${model.name.replace('models/', '')}`); // This is what you put in the code
      console.log("-------------------");
    });

  } catch (error) {
    console.error("Failed to fetch models:", error);
  }
}

listModels();