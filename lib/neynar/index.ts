import { getNeynarConfig } from "@/lib/env";

export const NEYNAR_API_BASE_URL = "https://api.neynar.com";

export function isNeynarConfigured(): boolean {
  return getNeynarConfig() !== null;
}

export function getNeynarHeaders(): HeadersInit | null {
  const config = getNeynarConfig();

  if (!config) {
    return null;
  }

  return {
    api_key: config.apiKey,
    Accept: "application/json",
  };
}
