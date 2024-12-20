import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cnalyhtalikwsopogula.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuYWx5aHRhbGlrd3NvcG9ndWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyMzc2MDEsImV4cCI6MjA0MTgxMzYwMX0.GaBwZWM0dKP_0hHy8Dzw75u15eXVG3vi8RmD7mv7PkQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);