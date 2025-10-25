export interface Character {
  name: string;
  role: string;
  description: string;
  avatar?: string;
  level?: number;
}

export interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  id: string;
  episode: number;
  illustration?: string;
}

export interface GameSettings {
  name: string;
  setting: string;
  role: 'author' | 'hero';
  narrativeMode: 'first' | 'third' | 'love-interest';
  playerCount: number;
}

export const AI_STORY_URL = 'https://functions.poehali.dev/43b376d8-4248-4a7e-8065-56da54df84d7';
export const IMAGE_GEN_URL = 'https://functions.poehali.dev/16a136ce-ff21-4430-80df-ad1caa87a3a7';
