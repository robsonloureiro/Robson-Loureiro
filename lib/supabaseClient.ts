import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types';

// !! IMPORTANTE !!
// Os valores abaixo foram preenchidos por você com a URL e Chave Pública Anon do seu projeto Supabase.
const supabaseUrl: string = 'https://umlzncshrrvkjrmczfyv.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbHpuY3NocnJ2a2pybWN6Znl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzM0OTYsImV4cCI6MjA3NDgwOTQ5Nn0.v8WjfdmAgylRnhFCZ0rUZbmrJMirHvpWBdNKDjKrdyY';

let supabase: SupabaseClient<Database> | null = null;

// O AppContext já possui uma tela de configuração caso as credenciais abaixo
// não sejam preenchidas. Esta lógica garante que o cliente seja criado
// assim que as credenciais corretas forem inseridas por você.
// A verificação `!supabaseUrl.includes('YOUR_SUPABASE_URL')` é uma salvaguarda para 
// garantir que as credenciais de placeholder não sejam usadas.
if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE_URL') && !supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
    try {
        supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    } catch (error) {
        console.error("Erro ao inicializar o cliente Supabase. Verifique sua URL e Chave em lib/supabaseClient.ts", error);
    }
}

export { supabase };