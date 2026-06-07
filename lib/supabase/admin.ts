import { createClient } from "@supabase/supabase-js";

// Create a Supabase admin client that bypasses Row Level Security (RLS)
// using the service role key. This should ONLY be used in server environments
// like webhooks where user authentication is not present.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
