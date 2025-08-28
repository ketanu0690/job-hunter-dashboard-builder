const API_KEY = "AIzaSyC3kbeRnjbsxZEqDA9uqRUeIs87e5Bv0SA"; // Replace with your actual Gemini API key

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function summarizeContent(content: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: `Summarize this article in 3-5 sentences and highlight key takeaways:\n\n${content}`,
    });

    return (
      response?.candidates?.[0]?.content?.parts?.[0].text ||
      "No summary available"
    );
  } catch (err: any) {
    console.error("Google GenAI API error:", err.message);
    return "AI summary unavailable at the moment.";
  }
}
