import { getGitHubConfig } from "@/lib/env";

export const GITHUB_API_BASE_URL = "https://api.github.com";

export function isGitHubConfigured(): boolean {
  return getGitHubConfig() !== null;
}

export function getGitHubHeaders(): HeadersInit | null {
  const config = getGitHubConfig();

  if (!config) {
    return null;
  }

  return {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}
