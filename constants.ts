import { ContentStatus, ContentType, Platform, HookItem, CTAItem } from './types';
import { 
  Lightbulb, 
  FileText, 
  Video, 
  CheckCircle, 
  Send,
  Instagram,
  Linkedin,
  Youtube,
  Smartphone
} from 'lucide-react';

export const INITIAL_HOOKS: HookItem[] = [
  { id: '1', text: 'Eu preciso te mostrar isso...', category: 'Curiosidade' },
  { id: '2', text: 'Você está fazendo errado, vou explicar!', category: 'Polêmica' },
  { id: '3', text: '3 Segredos que ninguém te conta sobre...', category: 'Educativo' },
  { id: '4', text: 'Pare de perder tempo com...', category: 'Dores' },
  { id: '5', text: 'O tutorial definitivo para...', category: 'Tutorial' },
];

export const INITIAL_CTAS: CTAItem[] = [
  { id: '1', text: 'Salve esse post para consultar depois.', isFavorite: true },
  { id: '2', text: 'Me conta aqui nos comentários: já passou por isso?', isFavorite: false },
  { id: '3', text: 'Compartilhe com um amigo que precisa saber disso.', isFavorite: true },
  { id: '4', text: 'Clique no link da bio para saber mais.', isFavorite: false },
];

export const STATUS_CONFIG = {
  [ContentStatus.IDEA]: { label: 'Ideia', color: 'bg-gray-100 text-gray-700', icon: Lightbulb },
  [ContentStatus.DRAFT]: { label: 'Rascunho', color: 'bg-yellow-100 text-yellow-700', icon: FileText },
  [ContentStatus.RECORDING]: { label: 'Em Gravação', color: 'bg-blue-100 text-blue-700', icon: Video },
  [ContentStatus.READY]: { label: 'Pronto', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  [ContentStatus.PUBLISHED]: { label: 'Postado', color: 'bg-red-100 text-red-700', icon: Send },
};

export const TYPE_CONFIG = {
  [ContentType.REEL]: { label: 'Reel/Video', icon: Video },
  [ContentType.CAROUSEL]: { label: 'Carrossel', icon: FileText },
  [ContentType.POST]: { label: 'Post Simples', icon: FileText },
  [ContentType.STORY]: { label: 'Story', icon: Smartphone },
};

export const PLATFORM_CONFIG = {
  [Platform.INSTAGRAM]: { label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  [Platform.TIKTOK]: { label: 'TikTok', icon: Video, color: 'text-black' }, // Lucide doesn't have tiktok standard
  [Platform.LINKEDIN]: { label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  [Platform.YOUTUBE]: { label: 'YouTube', icon: Youtube, color: 'text-red-600' },
};
