// TypeScript type definitions for the Stock Chat AI application

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  history: Message[];
}

export interface ChatResponse {
  response: string;
  error?: string;
}

export interface GeminiMessage {
  role: string;
  parts: { text: string }[];
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  tools?: {
    googleSearchRetrieval?: {
      dynamicRetrievalConfig?: {
        mode: string;
        dynamicThreshold: number;
      };
    };
  }[];
  generationConfig?: {
    temperature: number;
    maxOutputTokens: number;
  };
}

export interface GeminiResponse {
  candidates?: {
    content: {
      parts: { text: string }[];
    };
  }[];
  error?: {
    message: string;
    code: number;
  };
}
