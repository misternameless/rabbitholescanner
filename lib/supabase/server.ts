import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "@/lib/env";
import type { Database } from "@/types/database";

export function createSupabaseServerClient() {
  const config = getSupabaseServerConfig();

  if (!config) {
    return null;
  }

  return createClient<Database>(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function isSupabaseServerConfigured(): boolean {
  return getSupabaseServerConfig() !== null;
}
