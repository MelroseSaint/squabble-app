import { GoogleGenAI, Type } from "@google/genai";
import { Fighter, Message } from '../types';
import { MOCK_FIGHTERS } from '../constants';

export const generateFighters = async (apiKey: string): Promise<Fighter[]> => {
  if (!apiKey) {
    console.log("No API Key. Returning local mock fighters.");
    // Return mock data so the app is usable without AI
    // We shuffle them slightly to make it feel dynamic
    return [...MOCK_FIGHTERS].sort(() => Math.random() - 0.5);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Generate 5 fictional, funny, and edgy 'Squabble' profiles. They should be angry or weird. Locations should be specific (e.g., 'Waffle House', 'Planet Fitness Parking Lot'). Include fighting stats like weight class, stance (Orthodox/Southpaw), and experience level.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              age: { type: Type.NUMBER },
              height: { type: Type.STRING },
              weight: { type: Type.STRING },
              weightClass: { type: Type.STRING, enum: ["Featherweight", "Lightweight", "Welterweight", "Middleweight", "Heavyweight"] },
              stance: { type: Type.STRING, enum: ["Orthodox", "Southpaw", "Switch"] },
              experience: { type: Type.STRING, enum: ["Novice", "Amateur", "Pro", "Street"] },
              bio: { type: Type.STRING },
              fightingStyle: { type: Type.STRING },
              location: { type: Type.STRING },
              distance: { type: Type.NUMBER },
              imageUrl: { type: Type.STRING },
              wins: { type: Type.NUMBER },
              losses: { type: Type.NUMBER },
              winStreak: { type: Type.NUMBER },
              badges: { type: Type.ARRAY, items: { type: Type.STRING } },
              stats: {
                type: Type.OBJECT,
                properties: {
                  strength: { type: Type.NUMBER },
                  speed: { type: Type.NUMBER },
                  anger: { type: Type.NUMBER },
                  durability: { type: Type.NUMBER },
                  crazy: { type: Type.NUMBER },
                },
                required: ['strength', 'speed', 'anger', 'durability', 'crazy']
              }
            },
            required: ['id', 'name', 'age', 'height', 'weight', 'weightClass', 'stance', 'experience', 'bio', 'fightingStyle', 'location', 'distance', 'stats', 'wins', 'losses', 'winStreak', 'badges']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return MOCK_FIGHTERS;

    const data = JSON.parse(text);
    // Fix image URLs to be truly random for React rendering and calculate compatibility
    return data.map((f: any, index: number) => ({
      ...f,
      imageUrl: `https://picsum.photos/400/600?random=${Math.floor(Math.random() * 1000) + index}`,
      compatibility: Math.floor(Math.random() * 40) + 60 // Random score between 60-100 for fun
    }));

  } catch (error) {
    console.error("Gemini API failed", error);
    return MOCK_FIGHTERS;
  }
};

export const generateChatReply = async (apiKey: string, fighter: Fighter, history: Message[]): Promise<string> => {
  if (!apiKey) {
    // Fallback for non-AI users
    // Simulate a small network/typing delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const replies = [
      "PULL UP!",
      "I'm at the Waffle House on 3rd St. Come get some.",
      "You talk too much.",
      "Send location.",
      "I ain't reading all that. Fight me.",
      "Bet.",
      "You scared?",
      "Lol ok tough guy.",
      "Less typing, more fighting.",
      "Meet me in the parking lot."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const lastMessage = history[history.length - 1].text;
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `User said: "${lastMessage}". History: ${JSON.stringify(history)}. Reply as ${fighter.name}. You are angry, aggressive, and want to fight. Suggest a location like Walmart or a parking lot. Keep it short (under 20 words).`,
      config: {
        systemInstruction: `You are playing the character ${fighter.name} on an app called Squabble (Tinder for fighting). Your bio is: ${fighter.bio}. You are extremely aggressive but in a funny way.`,
        maxOutputTokens: 100,
      }
    });
    return response.text || "PULL UP!";
  } catch (error) {
    console.error("Gemini chat error", error);
    return "I'M READY WHEN YOU ARE!";
  }
}