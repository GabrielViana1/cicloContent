import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, ContentType } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateContentScript = async (
  idea: string,
  type: ContentType,
  context: string = ""
): Promise<GeneratedContent | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  const prompt = `
    Atue como um especialista em Marketing Digital e Criação de Conteúdo.
    Crie um roteiro detalhado para um conteúdo do tipo "${type}".
    
    A ideia principal é: "${idea}".
    Contexto adicional: "${context}".
    
    Retorne APENAS um objeto JSON com os seguintes campos:
    - title: Um título chamativo e viral.
    - script: O roteiro completo (se for vídeo, inclua falas; se for post, o texto da legenda).
    - suggestedCta: Uma chamada para ação (CTA) estratégica.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            script: { type: Type.STRING },
            suggestedCta: { type: Type.STRING },
          },
          required: ["title", "script", "suggestedCta"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
};

export const generateMoreIdeas = async (
  topic?: string,
  existingThemes: string[] = []
): Promise<string[]> => {
  const ai = getAiClient();
  if (!ai) return [];

  let promptContext = "";
  if (topic && topic.trim() !== "") {
    promptContext = `no tema: "${topic}"`;
  } else {
    const themesStr = existingThemes.join(", ");
    promptContext = `nestes temas: ${themesStr || "Marketing, Negócios, Lifestyle"}`;
  }

  const prompt = `
    Gere 5 ideias curtas e criativas para novos posts de redes sociais baseadas ${promptContext}.
    Retorne apenas a lista de ideias em JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });
    
    const text = response.text;
    if(!text) return [];
    
    const json = JSON.parse(text);
    return json.ideas || [];

  } catch (error) {
    console.error("Error generating ideas:", error);
    return [];
  }
};