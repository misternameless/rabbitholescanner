import type { SupabaseClient } from "@supabase/supabase-js";
import { searchGitHubRepositories } from "@/lib/github";
import type { Database, Json } from "@/types/database";
import type { GitHubRepository } from "@/types/github";

const GITHUB_TOPICS = [
  "AI",
  "Agents",
  "Crypto Infrastructure",
  "Base",
  "Solana",
  "Machine Payments",
  "x402",
  "Agent Commerce",
] as const;

type Supabase = SupabaseClient<Database>;
type GitHubRepoInsert = Database["public"]["Tables"]["github_repos"]["Insert"];
type ExistingRepo = Pick<
  Database["public"]["Tables"]["github_repos"]["Row"],
  "id" | "repo_full_name"
>;

export type GitHubScanResult = {
  success: true;
  scanned: number;
  inserted: number;
  updated: number;
};

type RepoWriteResult =
  | {
      success: true;
      inserted: number;
      updated: number;
    }
  | {
      success: false;
      error: unknown;
    };

function serializeError(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

function normalizeString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeTimestamp(value: unknown): string | null {
  const timestamp = normalizeString(value);

  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function buildRepositoryQuery(topic: string): string {
  return `${topic} in:name,description,readme,topics archived:false fork:false`;
}

function toGitHubRepoInsert(
  repository: GitHubRepository,
  queryTopic: string,
): GitHubRepoInsert | null {
  const repoFullName = normalizeString(repository.full_name);

  if (!repoFullName) {
    return null;
  }

  const repoCreatedAt = normalizeTimestamp(repository.created_at);
  const repoUpdatedAt = normalizeTimestamp(repository.updated_at);
  const topics = Array.isArray(repository.topics) ? repository.topics : [];
  const metadata: Json = {
    query_topic: queryTopic,
    repository: normalizeString(repository.name),
    owner: normalizeString(repository.owner?.login),
    owner_url: normalizeString(repository.owner?.html_url),
    github_id: repository.id ?? null,
    node_id: normalizeString(repository.node_id),
    language: normalizeString(repository.language),
    archived: repository.archived ?? null,
    fork: repository.fork ?? null,
    repo_created_at: repoCreatedAt,
    repo_updated_at: repoUpdatedAt,
    license: repository.license ?? null,
  };

  return {
    repo_full_name: repoFullName,
    url: normalizeString(repository.html_url),
    description: normalizeString(repository.description),
    stars: normalizeNumber(repository.stargazers_count),
    forks: normalizeNumber(repository.forks_count),
    topics,
    last_push: normalizeTimestamp(repository.pushed_at),
    metadata,
    created_at: repoCreatedAt ?? undefined,
    updated_at: repoUpdatedAt ?? undefined,
  };
}

function dedupeRepositories(repositories: GitHubRepoInsert[]): GitHubRepoInsert[] {
  return [
    ...new Map(
      repositories.map((repository) => [
        repository.repo_full_name,
        repository,
      ]),
    ).values(),
  ];
}

async function collectRepositories(): Promise<GitHubRepoInsert[]> {
  const searchResults = await Promise.all(
    GITHUB_TOPICS.map(async (topic) => ({
      topic,
      response: await searchGitHubRepositories(buildRepositoryQuery(topic), 20),
    })),
  );

  return dedupeRepositories(
    searchResults.flatMap(({ topic, response }) =>
      response.items
        .map((repository) => toGitHubRepoInsert(repository, topic))
        .filter(
          (repository): repository is GitHubRepoInsert => repository !== null,
        ),
    ),
  );
}

async function fetchExistingRepositories(
  supabase: Supabase,
  repositories: GitHubRepoInsert[],
): Promise<
  | {
      success: true;
      existingByName: Map<string, ExistingRepo>;
    }
  | {
      success: false;
      error: unknown;
    }
> {
  const repoNames = repositories.map((repository) => repository.repo_full_name);

  if (repoNames.length === 0) {
    return { success: true, existingByName: new Map() };
  }

  const { data, error } = await supabase
    .from("github_repos")
    .select("id, repo_full_name")
    .in("repo_full_name", repoNames);

  if (error) {
    return { success: false, error };
  }

  return {
    success: true,
    existingByName: new Map(
      (data ?? []).map((repository) => [
        repository.repo_full_name,
        repository,
      ]),
    ),
  };
}

async function writeRepositories(
  supabase: Supabase,
  repositories: GitHubRepoInsert[],
): Promise<RepoWriteResult> {
  const existingResult = await fetchExistingRepositories(supabase, repositories);

  if (!existingResult.success) {
    return existingResult;
  }

  const repositoriesToInsert: GitHubRepoInsert[] = [];
  const repositoriesToUpdate: Array<{
    id: string;
    repository: GitHubRepoInsert;
  }> = [];

  for (const repository of repositories) {
    const existingRepository = existingResult.existingByName.get(
      repository.repo_full_name,
    );

    if (existingRepository) {
      repositoriesToUpdate.push({
        id: existingRepository.id,
        repository,
      });
    } else {
      repositoriesToInsert.push(repository);
    }
  }

  if (repositoriesToInsert.length > 0) {
    const { error } = await supabase
      .from("github_repos")
      .insert(repositoriesToInsert);

    if (error) {
      return { success: false, error };
    }
  }

  for (const { id, repository } of repositoriesToUpdate) {
    const { error } = await supabase
      .from("github_repos")
      .update(repository)
      .eq("id", id);

    if (error) {
      return { success: false, error };
    }
  }

  return {
    success: true,
    inserted: repositoriesToInsert.length,
    updated: repositoriesToUpdate.length,
  };
}

export async function scanGitHub(
  supabase: Supabase,
): Promise<GitHubScanResult> {
  const { data: scanRun, error: scanRunError } = await supabase
    .from("scan_runs")
    .insert({
      source: "github",
      status: "started",
    })
    .select("id")
    .single();

  if (scanRunError) {
    throw scanRunError;
  }

  try {
    const repositories = await collectRepositories();
    const writeResult = await writeRepositories(supabase, repositories);

    if (!writeResult.success) {
      throw writeResult.error;
    }

    const result: GitHubScanResult = {
      success: true,
      scanned: repositories.length,
      inserted: writeResult.inserted,
      updated: writeResult.updated,
    };

    const { error: finishError } = await supabase
      .from("scan_runs")
      .update({
        status: "success",
        finished_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", scanRun.id);

    if (finishError) {
      throw finishError;
    }

    return result;
  } catch (error) {
    await supabase
      .from("scan_runs")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error: serializeError(error),
      })
      .eq("id", scanRun.id);

    throw error;
  }
}
