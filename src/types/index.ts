export interface Event {
  id: string;
  title: string;
  date: Date;
  emoji: string;
  category: EventCategory;
  isCompleted: boolean;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EventCategory = 'holiday' | 'birthday' | 'vacation' | 'anniversary' | 'other';

export interface Theme {
  id: string;
  name: string;
  icon: string;
  primaryColor: string;
  backgroundColor: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  theme: string;
}

export interface CountdownDisplay {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isPast: boolean;
}

export interface AppSettings {
  selectedTheme: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export const DEFAULT_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    icon: '🎨',
    primaryColor: '#87CEEB',
    backgroundColor: 'linear-gradient(135deg, #B8D4E3 0%, #87CEEB 100%)'
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    primaryColor: '#2E8B57',
    backgroundColor: 'linear-gradient(135deg, #90EE90 0%, #2E8B57 100%)'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    primaryColor: '#FF6B6B',
    backgroundColor: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    primaryColor: '#4A90E2',
    backgroundColor: 'linear-gradient(135deg, #E0F7FA 0%, #4A90E2 100%)'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    icon: '🌙',
    primaryColor: '#6C63FF',
    backgroundColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  }
];

export const EVENT_EMOJIS: { [key in EventCategory]: string[] } = {
  holiday: ['🎄', '🎃', '🎆', '🐰', '🦃', '🎁'],
  birthday: ['🎂', '🎉', '🎈', '🎊', '🥳', '🍰'],
  vacation: ['✈️', '🏖️', '🏔️', '🗽', '🌴', '🚢'],
  anniversary: ['💑', '💍', '❤️', '🥂', '🌹', '💝'],
  other: ['⏰', '📅', '🎯', '✨', '🌟', '🔔']
};