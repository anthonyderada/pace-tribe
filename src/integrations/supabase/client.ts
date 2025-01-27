import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://tjdtlgwldbqicavrkewh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqZHRsZ3dsZGJxaWNhdnJrZXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NzE5NzcsImV4cCI6MjAyNjQ0Nzk3N30.KqGfXt1HXlHWiI-ydvv5F6Vr6xRqXMwKEA7yHQVxDYI';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);