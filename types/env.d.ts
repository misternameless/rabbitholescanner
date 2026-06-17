declare namespace NodeJS {
  interface ProcessEnv {
    OPENAI_API_KEY?: string;
    GITHUB_TOKEN?: string;
    NEYNAR_API_KEY?: string;
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    CRON_SECRET?: string;
  }
}
