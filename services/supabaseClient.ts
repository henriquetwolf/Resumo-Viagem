import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntsjrqgbjnrutajrjwvm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c2pycWdiam5ydXRhanJqd3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTk5NDIsImV4cCI6MjA3ODY5NTk0Mn0.6YKb5GGH7pIQgbzB4TPW5vM3KvB-Kvn6dIFew7mVHwc';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or anon key is missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
