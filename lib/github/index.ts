import { getGitHubConfig } from "@/lib/env";
import type {
  GitHubApiError,
  GitHubRepositorySearchResponse,
} from "@/types/github";

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

async function fetchGitHubJson<T>(path: string): Promise<T> {
  const headers = getGitHubHeaders();

  if (!headers) {
    throw {
      status: 500,
      statusText: "Missing GitHub configuration",
      body: "GITHUB_TOKEN is missing.",
    } satisfies GitHubApiError;
  }

  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers,
    cache: "no-store",
  });
  const body = await response.json().catch(async () => response.text());

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      body,
    } satisfies GitHubApiError;
  }

  return body as T;
}

export function searchGitHubRepositories(
  query: string,
  perPage = 20,
): Promise<GitHubRepositorySearchResponse> {
  const params = new URLSearchParams({
    q: query,
    sort: "updated",
    order: "desc",
    per_page: String(perPage),
  });

  return fetchGitHubJson<GitHubRepositorySearchResponse>(
    `/search/repositories?${params.toString()}`,
  );
}
