export type SupabaseClientConfig = {
  url: string;
  anonKey: string;
};

export type SupabaseServerConfig = SupabaseClientConfig & {
  serviceRoleKey: string;
};

export type TokenConfig = {
  apiKey: string;
};

export type GitHubConfig = {
  token: string;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

export function getSupabaseClientConfig(): SupabaseClientConfig | null {
  const url = readEnv("SUPABASE_URL");
  const anonKey = readEnv("SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getSupabaseServerConfig(): SupabaseServerConfig | null {
  const clientConfig = getSupabaseClientConfig();
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!clientConfig || !serviceRoleKey) {
    return null;
  }

  return { ...clientConfig, serviceRoleKey };
}

export function getOpenAIConfig(): TokenConfig | null {
  const apiKey = readEnv("OPENAI_API_KEY");

  return apiKey ? { apiKey } : null;
}

export function getGitHubConfig(): GitHubConfig | null {
  const token = readEnv("GITHUB_TOKEN");

  return token ? { token } : null;
}

export function getNeynarConfig(): TokenConfig | null {
  const apiKey = readEnv("NEYNAR_API_KEY");

  return apiKey ? { apiKey } : null;
}

export function getCronSecret(): string | null {
  return readEnv("CRON_SECRET") ?? null;
}
