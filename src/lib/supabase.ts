
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgzyctbjbwetriagenqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnenljdGJqYndldHJpYWdlbnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjA5NzcsImV4cCI6MjA1NTQzNjk3N30.PCFgLwhwOGKe6OpUqgMMafN4_Gg6sUaTDY_278IR6A8';
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
