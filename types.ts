

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  streak: number;
  xpToNextLevel: number;
  rewards: Reward[];
}

export interface ProgressEntry {
  id: string;
  date: string;
  type: 'fitness' | 'skill' | 'productivity' | 'general';
  mediaUrl: string; // Base64 or URL
  mediaType: 'image' | 'video';
  aiAnalysis: {
    score: number; // 0-100
    emotion: string;
    feedback: string;
    tags: string[];
  };
}

export interface Goal {
  id: string;
  title: string;
  targetDate: string;
  progress: number; // 0-100
  milestones: { title: string; completed: boolean }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Reward {
  id: string;
  title: string;
  rarity: 'common' | 'rare' | 'legendary' | 'mythic';
  xpBonus: number;
  icon: string;
  unlockedAt?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  isPinned: boolean;
  color?: string; // e.g., 'blue', 'purple', 'cyan' for neon accents
}

export interface FocusTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export type AppMode = 'neon' | 'zen' | 'hyper';

// Window Augmentation for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}