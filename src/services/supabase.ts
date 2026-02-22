import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kwhfwpktguujjlpttmbn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3aGZ3cGt0Z3V1ampscHR0bWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODI1ODAsImV4cCI6MjA4NzM1ODU4MH0.Hr-0VF0-7pM_VoMHAvoXRqdmAeVNQp5aVgIjCR0Oar4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
