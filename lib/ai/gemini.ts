import "server-only";
import { GoogleGenAI } from "@google/genai";

let geminiClientInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return null;
  }
  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({
      apiKey: apiKey.trim(),
    });
  }
  return geminiClientInstance;
}

export const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() })
  : (null as unknown as GoogleGenAI);
