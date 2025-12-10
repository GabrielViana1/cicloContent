import { createClient } from '@supabase/supabase-js';

// URL do projeto
const supabaseUrl = 'https://xytqxhwkqxhsxjnnvchh.supabase.co';

// Chave anônima pública (Anon Public Key)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dHF4aHdrcXhoc3hqbm52Y2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODczNTQsImV4cCI6MjA4MDk2MzM1NH0.RwNxJUmuP5V2vBl5DwAHY3XZ_A-9rfFjr5MHWZhJG3o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper mantido apenas para compatibilidade de tipos se necessário, mas agora sempre true
export const isConfigured = () => true;