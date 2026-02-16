
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Fix: Added optional history parameter to match call signature in AIHub.tsx line 45
  static async chat(message: string, history: any[] = []) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: "You are the MiMi Games RPG Bot assistant. Help players with game lore and mechanics in a fantasy setting using emojis.",
      },
    });
    return response.text;
  }

  // Fix: Added optional aspectRatio and imageSize parameters to match call signature in AIHub.tsx line 60
  static async generateImage(prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K") {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `High quality fantasy pixel art or cinematic RPG artwork: ${prompt}` }],
      },
      config: {
        imageConfig: { 
          aspectRatio: aspectRatio as any, 
          imageSize: imageSize as any 
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  }

  // Fix: Added optional aspectRatio parameter to match call signature in AIHub.tsx line 74
  static async animateImage(prompt: string, base64Image: string, aspectRatio: string = '16:9') {
    const ai = this.getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Animate this fantasy RPG scene',
      image: {
        imageBytes: base64Image.split(',')[1],
        mimeType: 'image/png',
      },
      config: { 
        numberOfVideos: 1, 
        resolution: '720p', 
        aspectRatio: aspectRatio as any
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
