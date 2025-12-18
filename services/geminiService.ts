
import { GeneratedContent, ContentType } from "../types";

/**
 * Faz a chamada para a nossa Serverless Function segura na Vercel.
 * Isso impede a exposição da API_KEY no navegador.
 */
async function callAiProxy(action: string, payload: any) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro na resposta do servidor de IA');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao chamar proxy de IA:", error);
    return null;
  }
}

export const generateContentScript = async (
  idea: string,
  type: ContentType,
  context: string = ""
): Promise<GeneratedContent | null> => {
  return await callAiProxy('generateScript', { idea, type, context });
};

export const generateMoreIdeas = async (
  topic?: string,
  existingThemes: string[] = []
): Promise<string[]> => {
  const ideas = await callAiProxy('generateIdeas', { topic, existingThemes });
  return Array.isArray(ideas) ? ideas : [];
};
