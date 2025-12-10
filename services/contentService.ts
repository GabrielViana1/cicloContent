import { supabase } from '../lib/supabase';
import { ContentItem } from '../types';

export const contentService = {
  // Ler todos os itens do usuário atual
  fetchItems: async (): Promise<ContentItem[]> => {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar itens:', error);
      return [];
    }

    // Mapear snake_case do banco para camelCase do frontend
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      idea: item.idea,
      context: item.context,
      theme: item.theme,
      type: item.type,
      platform: item.platform,
      status: item.status,
      script: item.script,
      cta: item.cta,
      scheduledDate: item.scheduled_date,
      createdAt: item.created_at,
    }));
  },

  // Criar ou Atualizar item (Upsert)
  upsertItem: async (item: ContentItem, userId: string): Promise<ContentItem | null> => {
    // Converter para formato do banco
    const dbItem = {
      id: item.id,
      user_id: userId,
      title: item.title,
      idea: item.idea,
      context: item.context,
      theme: item.theme,
      type: item.type,
      platform: item.platform,
      status: item.status,
      script: item.script,
      cta: item.cta,
      scheduled_date: item.scheduledDate,
      created_at: item.createdAt,
    };

    const { data, error } = await supabase
      .from('content_items')
      .upsert(dbItem)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar item:', error);
      return null;
    }

    return item;
  },

  // Deletar item
  deleteItem: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar item:', error);
      return false;
    }
    return true;
  },
  
  // Atualizar apenas o status (otimização para drag and drop)
  updateStatus: async (id: string, status: string): Promise<boolean> => {
    const { error } = await supabase
      .from('content_items')
      .update({ status })
      .eq('id', id);

    if (error) {
       console.error('Erro ao atualizar status', error);
       return false;
    }
    return true;
  }
};