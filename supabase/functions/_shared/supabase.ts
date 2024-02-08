import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Define Supabase credentials
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
// const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function getSupabaseClient(api_key: string): SupabaseClient<any, "data", any> {
  return createClient(SUPABASE_URL, api_key.replace(/^Bearer\s+/, ""), {
    db: {
      schema: "data",
    },
  });
}

export { getSupabaseClient };
