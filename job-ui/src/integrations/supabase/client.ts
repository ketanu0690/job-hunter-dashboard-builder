/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =  'https://kylqmscivfenvsirwhuy.supabase.co';
const SUPABASE_ANON_KEY =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bHFtc2NpdmZlbnZzaXJ3aHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MzQ4NTQsImV4cCI6MjA2MTMxMDg1NH0.faOMyISRpis95lX5H9U1iFuuD_k_jvZn6fAyvIiHZ-g';

// Validate variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "supabase.auth.token", // optional: customize localStorage key
  },
});

