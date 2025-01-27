import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://zrfitufsdpzvppwyqrfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZml0dWZzZHB6dnBwd3lxcmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzU2ODAsImV4cCI6MjAyNTQxMTY4MH0.mYqGNLJoqFhRQDGHXsLVFNNYHPxKi_Ov0O_YKvdGXKY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);