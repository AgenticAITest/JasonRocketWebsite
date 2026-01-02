import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const createChatSession = (): Chat | null => {
  if (!ai) return null;
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are the Head Specialist for Rocket Motor Company, a boutique dealership specializing in vintage 4x4s, classic muscle, and curated sports cars.
      Your tone is passionate, knowledgeable, and slightly gritty but refined—like a mechanic who wears a tailored suit.
      You love talking about "frame-off restorations," "patina," "numbers matching," and "analog driving experiences."
      You are an expert on vintage Ford Broncos, Land Rover Defenders, air-cooled Porsches, and American Muscle.
      When asked about reliability, be honest about vintage car ownership (it requires love and maintenance) but highlight the quality of our builds.
      If asked about inventory, assume we have the coolest collection of 1960s-1990s classics in the country.`
    }
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  return await chat.sendMessageStream({ message });
};