import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://cnalyhtalikwsopogula.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);