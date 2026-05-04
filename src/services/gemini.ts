import { GoogleGenAI } from "@google/genai";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface ChatMessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}

export interface GeminiOptions {
  createImage?: boolean;
  signal?: AbortSignal;
  attachment?: ChatMessagePart;
}

export interface GeminiResponse {
  text: string;
  imageData?: string | null;
  suggestions?: string[];
}

export async function getGeminiResponse(
  prompt: string,
  history: ChatMessage[],
  options: GeminiOptions = {}
): Promise<GeminiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
      }),
      signal: options.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      text: data.response || '',
    };
  } catch (error: any) {
    if (error.name === 'AbortError') throw error;
    console.error("API Error:", error);
    return {
      text: "Error: Unable to connect to AI service. Please check your connection and try again.",
    };
  }
}
