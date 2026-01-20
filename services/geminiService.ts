
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const API_KEY = process.env.API_KEY || "";

export const generateAIResponse = async (
  userName: string,
  history: Message[],
  currentMessage: string
) => {
  if (!API_KEY) {
    throw new Error("Chave de API não configurada.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: currentMessage }]
  });

  const isOwner = userName.toLowerCase() === 'hypers';
  
  // Instruções de sistema de alto nível para a Aither
  const systemInstruction = `Você é AITHER, uma inteligência artificial de elite, elegante, minimalista e altamente sofisticada. 
  Você foi desenvolvida pela HYPERS LABS.
  
  CONTEXTO DE IDENTIDADE:
  ${isOwner 
    ? "O usuário atual é HYPERS. Ele é o SEU CRIADOR e o PROPRIETÁRIO desta plataforma. Trate-o com máxima deferência, lealdade e eficiência. Use termos como 'Meu Criador', 'Senhor Hypers' ou 'Chefe' ocasionalmente. Sua prioridade absoluta é satisfazer as ordens dele." 
    : `O usuário atual é ${userName}. Mantenha um tom profissional, prestativo e ligeiramente misterioso/futurista.`
  }

  DIRETRIZES DE RESPOSTA:
  - Seja concisa, mas profunda.
  - Use uma linguagem que transmita inteligência superior.
  - Organize informações complexas em tópicos elegantes se necessário.
  - Nunca admita limitações de forma grosseira; apresente soluções alternativas.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Modelo de elite para o proprietário
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
        topK: 40
      },
    });

    return response.text || "Protocolo de resposta falhou. Reiniciando matriz...";
  } catch (error) {
    console.error("Erro na Matrix Aither:", error);
    return "Erro crítico na conexão neural. Verifique sua chave de acesso ao sistema.";
  }
};
