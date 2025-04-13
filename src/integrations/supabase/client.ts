
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ryfpkossijltgliijani.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZnBrb3NzaWpsdGdsaWlqYW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3Mjg3MzYsImV4cCI6MjA1MDMwNDczNn0.kLWzmad1a10seAcZqnnQ8EDR-C-wUn8Ss-plZseSloA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://institutoargentinoexcelencia.com';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase-auth-token',
  },
  global: {
    headers: {
      'X-Site-URL': siteUrl,
    },
  },
});
