import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://cnalyhtalikwsopogula.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuYWx5aHRhbGlrd3NvcG9ndWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTQyMzAsImV4cCI6MjAyMjQ3MDIzMH0.0e0CWn-lTcbMk-QYvmHXEs8qGXszOyVZcslqtC0Uu_U';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);