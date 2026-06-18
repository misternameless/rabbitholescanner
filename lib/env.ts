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

export const REQUIRED_ENVIRONMENT_VARIABLES = [
  "OPENAI_API_KEY",
  "GITHUB_TOKEN",
  "NEYNAR_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "CRON_SECRET",
] as const;

export type RequiredEnvironmentVariable =
  (typeof REQUIRED_ENVIRONMENT_VARIABLES)[number];

export type ConfigCheck = Record<RequiredEnvironmentVariable, boolean>;

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

function normalizeSupabaseUrl(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

export function getConfigCheck(): ConfigCheck {
  return REQUIRED_ENVIRONMENT_VARIABLES.reduce<ConfigCheck>(
    (status, variable) => ({
      ...status,
      [variable]: readEnv(variable) !== undefined,
    }),
    {} as ConfigCheck,
  );
}

export function getSupabaseClientConfig(): SupabaseClientConfig | null {
  const rawUrl = readEnv("SUPABASE_URL");
  const anonKey = readEnv("SUPABASE_ANON_KEY");

  if (!rawUrl || !anonKey) {
    return null;
  }

  return { url: normalizeSupabaseUrl(rawUrl), anonKey };
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
