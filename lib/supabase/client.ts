import { createClient } from "@supabase/supabase-js";
import { getSupabaseClientConfig } from "@/lib/env";
import type { Database } from "@/types/database";

export function createSupabaseClient() {
  const config = getSupabaseClientConfig();

  if (!config) {
    return null;
  }

  return createClient<Database>(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function isSupabaseClientConfigured(): boolean {
  return getSupabaseClientConfig() !== null;
}
