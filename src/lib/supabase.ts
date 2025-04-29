
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhhmrqpmaszrahlfyuif.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaG1ycXBtYXN6cmFobGZ5dWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTA0MzcsImV4cCI6MjA2MTI2NjQzN30.-oDu3wltoypI3OidiIrOJj-YChJ7-CgnKAIpTrHGb-Q';
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
