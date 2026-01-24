const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

async function listModels() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  try {
    // There isn't a direct listModels on the instance in some versions,
    // but let's try a direct fetch if the SDK is obscure,
    // actually SDK usually has it on the internal or via a simpler method.
    // However, for v1beta it might be cleaner to just test a simple one.
    // Let's try to just run a simple generate on 'gemini-pro' first as a fallback check script.

    // Better yet, let's just log what happens with gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    console.log("gemini-pro works:", result.response.text());
  } catch (err) {
    console.log("gemini-pro failed:", err.message);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });
    const result = await model.generateContent("Hello");
    console.log("models/gemini-1.5-flash works:", result.response.text());
  } catch (err) {
    console.log("models/gemini-1.5-flash failed:", err.message);
  }
}

listModels();
