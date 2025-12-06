import { GoogleGenAI, Type } from "@google/genai";
import { MorningBriefingData } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini client safely
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateMorningBriefing = async (time: string): Promise<MorningBriefingData> => {
  if (!ai) {
    return {
      greeting: "Good Morning!",
      quote: "Please set your API Key to unlock AI briefings.",
      fact: "Did you know you can customize this app?"
    };
  }

  try {
    const prompt = `It is currently ${time}. Generate a short, encouraging morning briefing for a user who just woke up. 
    Return a JSON object with:
    1. 'greeting': A friendly greeting tailored to the time of day.
    2. 'quote': A short motivational quote.
    3. 'fact': An interesting, random fun fact to start the brain working.
    Keep it concise.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            quote: { type: Type.STRING },
            fact: { type: Type.STRING },
          },
          required: ["greeting", "quote", "fact"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as MorningBriefingData;

  } catch (error) {
    console.error("Gemini Briefing Error:", error);
    return {
      greeting: "Good Morning!",
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      fact: "The Gemini API connection seems to be having a hiccup, but you're up and running!"
    };
  }
};
