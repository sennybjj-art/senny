
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getSmarterPaymentTip(total: number, paid: number): Promise<string> {
    if (!process.env.API_KEY) return "";

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise este pagamento: Total R$ ${total.toFixed(2)}, Pago R$ ${paid.toFixed(2)}. 
        Se houver uma forma do cliente pagar que facilite o troco (ex: dar moedas para receber uma nota redonda), sugira em uma frase curta e amigável em Português. 
        Se o pagamento já for otimizado ou não houver sugestão óbvia, retorne vazio.`,
        config: {
          temperature: 0.7,
        }
      });

      return response.text || "";
    } catch (error) {
      console.error("Gemini suggestion error:", error);
      return "";
    }
  }
}

export const geminiService = new GeminiService();
