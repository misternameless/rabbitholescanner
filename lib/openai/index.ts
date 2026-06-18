import { getOpenAIConfig } from "@/lib/env";

export function isOpenAIConfigured(): boolean {
  return getOpenAIConfig() !== null;
}

export function getOpenAIHeaders(): HeadersInit | null {
  const config = getOpenAIConfig();

  if (!config) {
    return null;
  }

  return {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
  };
}
