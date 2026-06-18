import type { Json } from "@/types/database";

export type GitHubRepositoryOwner = {
  login?: string;
  html_url?: string;
};

export type GitHubRepository = {
  id?: number;
  node_id?: string;
  name?: string;
  full_name?: string;
  html_url?: string;
  description?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  created_at?: string;
  updated_at?: string;
  pushed_at?: string | null;
  topics?: string[];
  language?: string | null;
  owner?: GitHubRepositoryOwner;
  archived?: boolean;
  fork?: boolean;
  license?: Json;
};

export type GitHubRepositorySearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
};

export type GitHubApiError = {
  status: number;
  statusText: string;
  body: unknown;
};
