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
  keyDecisions?: string[];
  emotionalTone?: 'aggressive' | 'friendly' | 'cautious' | 'romantic' | 'neutral';
}

export interface GameSettings {
  name: string;
  setting: string;
  role: 'author' | 'hero';
  narrativeMode: 'first' | 'third' | 'love-interest';
  playerCount: number;
  genre?: string;
  rating?: string;
  eloquenceLevel?: number;
  aiModel?: 'deepseek';
  aiInstructions?: string;
  initialCharacters?: Character[];
  storyMemory?: {
    keyMoments: Array<{
      turn: number;
      playerAction: string;
      consequence: string;
      emotionalWeight: number;
    }>;
    characterRelationships: Record<string, number>;
    worldChanges: string[];
  };
}

import func2url from '../../../backend/func2url.json';

export const AI_STORY_URL = func2url['ai-story'];
export const IMAGE_GEN_URL = func2url['generate-image'];
export const SAVE_STORY_URL = func2url['save-story'];
export const DELETE_STORY_URL = func2url['delete-story'];