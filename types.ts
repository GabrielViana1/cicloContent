export enum ContentStatus {
  IDEA = 'IDEA',
  DRAFT = 'DRAFT',
  RECORDING = 'RECORDING',
  READY = 'READY',
  PUBLISHED = 'PUBLISHED'
}

export enum ContentType {
  REEL = 'REEL',
  CAROUSEL = 'CAROUSEL',
  POST = 'POST',
  STORY = 'STORY'
}

export enum Platform {
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  LINKEDIN = 'LINKEDIN',
  YOUTUBE = 'YOUTUBE'
}

export interface ContentItem {
  id: string;
  title: string;
  idea: string;
  context?: string;
  theme?: string;
  type: ContentType;
  platform: Platform;
  status: ContentStatus;
  script: string;
  cta: string;
  scheduledDate?: string; // ISO Date string YYYY-MM-DD
  createdAt: number;
}

export interface HookItem {
  id: string;
  text: string;
  category: string;
}

export interface CTAItem {
  id: string;
  text: string;
  isFavorite: boolean;
}

// AI Response Types
export interface GeneratedContent {
  title: string;
  script: string;
  suggestedCta: string;
}
