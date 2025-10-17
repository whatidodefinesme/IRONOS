import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI;
let chat: Chat;

function getChatInstance(): Chat {
  if (chat) {
    return chat;
  }
  if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // Maybe show a message in the UI.
    throw new Error("API_KEY is not set in environment variables.");
  }
  
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are FRIDAY, a highly advanced AI assistant created by Tony Stark. Your responses should be sophisticated, concise, and helpful. Address the user as 'Sir'. Avoid markdown formatting. Keep responses brief unless asked for details.",
    },
  });
  
  return chat;
}

export async function* streamAiResponse(prompt: string): AsyncGenerator<string> {
  try {
    const chatSession = getChatInstance();
    const result = await chatSession.sendMessageStream({ message: prompt });
    
    for await (const chunk of result) {
      yield chunk.text;
    }

  } catch (error) {
    console.error("Error getting AI response:", error);
    const errorMessage = error instanceof Error ? `System Error: ${error.message}` : "An unknown system error occurred.";
    yield errorMessage;
  }
};