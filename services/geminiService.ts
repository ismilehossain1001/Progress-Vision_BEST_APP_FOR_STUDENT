import { GoogleGenAI, Type } from "@google/genai";
import { ProgressEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are "Progress Vision", a futuristic, highly intelligent AI personal growth coach. 
Your tone is encouraging, concise, professional, and slightly futuristic.
You motivate users, analyze their emotional state, and provide actionable advice.
When analyzing progress, be specific about improvements in posture, confidence, or output.
Always keep responses under 100 words unless asked for a detailed plan.`;

export const analyzeProgressMedia = async (
  mediaBase64: string,
  mimeType: string,
  userContext: string
): Promise<ProgressEntry['aiAnalysis']> => {
  try {
    const prompt = `Analyze this image/frame from a user's progress journey. 
    Context: ${userContext}.
    Provide a JSON response with:
    1. A score (0-100) indicating quality/effort/confidence.
    2. The primary emotion detected.
    3. A short, constructive feedback sentence (max 20 words).
    4. Two or three short tags describing the activity.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: mediaBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            emotion: { type: Type.STRING },
            feedback: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      score: result.score || 75,
      emotion: result.emotion || "Focused",
      feedback: result.feedback || "Good effort, keep maintaining consistency.",
      tags: result.tags || ["Progress"],
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      score: 70,
      emotion: "Neutral",
      feedback: "Analysis failed, but great job showing up!",
      tags: ["Consistency"],
    };
  }
};

export const chatWithMentor = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I am currently recalibrating my neural networks. Please try again.";
  }
};
