import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Define Supabase credentials
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Create the Supabase client statically so it's created only once
const sbclient: SupabaseClient<any, "data", any> = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: "data",
    },
  }
);

export { sbclient };
