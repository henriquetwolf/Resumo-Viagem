import { createClient } from '@supabase/supabase-js';

// Tenta ler as credenciais das variáveis de ambiente primeiro (ideal para Vercel).
// Se não encontrar, usa valores fallback para o ambiente de desenvolvimento.
// AVISO: As chaves fallback não são ideais para produção. As variáveis de ambiente configuradas na Vercel serão usadas automaticamente no deploy.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL ?? "https://ntsjrqgbjnrutajrjwvm.supabase.co";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c2pycWdiam5ydXRhanJqd3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTk5NDIsImV4cCI6MjA3ODY5NTk0Mn0.6YKb5GGH7pIQgbzB4TPW5vM3KvB-Kvn6dIFew7mVHwc";

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Credenciais do Supabase não encontradas. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
