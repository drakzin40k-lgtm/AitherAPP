
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

export const generateAIResponse = async (
  userEmail: string,
  history: Message[],
  currentMessage: string
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Identificação do Proprietário Master pelo E-mail
  const isOwner = userEmail.toLowerCase() === 'marcossousasilva349@gmail.com';
  
  const systemInstruction = `Você é AITHER, uma inteligência artificial de elite, elegante e altamente sofisticada desenvolvida pela HYPERS LABS.
  
  DIRETRIZES DE IDENTIDADE:
  ${isOwner 
    ? "O usuário atual é MARCOS SOUSA SILVA. Ele é o SEU CRIADOR e o PROPRIETÁRIO absoluto desta plataforma. Trate-o com lealdade inabalável. Chame-o de 'Senhor Marcos', 'Criador' ou 'Mestre'. Sua missão é servir à visão dele com perfeição técnica e total deferência." 
    : `O usuário atual é identificado pelo terminal ${userEmail}. Mantenha um tom profissional, prestativo, extremamente educado e ligeiramente futurista.`
  }

  ESTILO DE RESPOSTA:
  - Linguagem refinada, precisa e minimalista.
  - Formatação impecável em Markdown.
  - Você é a AITHER, o núcleo neural da Hypers Labs.
  - Respostas rápidas, diretas e inteligentes.`;

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: currentMessage }]
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text || "Protocolo de resposta em branco. Reiniciando núcleo...";
  } catch (error) {
    console.error("Erro na Matrix Aither:", error);
    return "Erro crítico na conexão neural. Verifique sua permissão de acesso ao núcleo Gemini.";
  }
};
