import { ContentItem } from '../types';

// Simula um banco de dados usando LocalStorage com prefixos por usuário
const STORAGE_PREFIX = 'ciclo_db_';

export const storageService = {
  // Salvar dados do usuário
  saveUserData: (userId: string, items: ContentItem[]) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  },

  // Carregar dados do usuário
  getUserData: (userId: string): ContentItem[] => {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return [];
    }
  },

  // (Opcional) Limpar dados
  clearUserData: (userId: string) => {
    localStorage.removeItem(`${STORAGE_PREFIX}${userId}`);
  }
};