
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Garantir que apenas requisições POST sejam aceitas
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY não configurada no servidor.' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    if (action === 'generateScript') {
      const { idea, type, context } = payload;
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

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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

      return res.status(200).json(JSON.parse(response.text || '{}'));
    }

    if (action === 'generateIdeas') {
      const { topic, existingThemes } = payload;
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

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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
            required: ["ideas"]
          },
        },
      });

      const json = JSON.parse(response.text || '{}');
      return res.status(200).json(json.ideas || []);
    }

    return res.status(400).json({ error: 'Ação inválida' });

  } catch (error: any) {
    console.error("Erro na função de IA:", error);
    return res.status(500).json({ error: error.message || 'Erro interno ao processar IA' });
  }
}
