import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/types/database";
import type {
  ClusterCoinEvidence,
  ClusterRepositoryEvidence,
  EmergingCluster,
  EmergingClustersResponse,
} from "@/types/intelligence";

const STOP_WORDS = new Set([
  "about",
  "after",
  "all",
  "also",
  "and",
  "any",
  "app",
  "are",
  "based",
  "best",
  "bot",
  "build",
  "builder",
  "built",
  "can",
  "client",
  "code",
  "coding",
  "data",
  "demo",
  "dev",
  "developer",
  "for",
  "from",
  "get",
  "github",
  "has",
  "into",
  "kit",
  "lib",
  "like",
  "new",
  "next",
  "node",
  "not",
  "one",
  "open",
  "platform",
  "project",
  "repo",
  "rust",
  "sdk",
  "self",
  "server",
  "service",
  "simple",
  "source",
  "stack",
  "starter",
  "system",
  "that",
  "the",
  "this",
  "tool",
  "tools",
  "typescript",
  "use",
  "using",
  "web",
  "with",
  "your",
]);

const CONCEPT_ALIASES: Array<{
  clusterName: string;
  patterns: RegExp[];
}> = [
  {
    clusterName: "ai",
    patterns: [
      /\bai\b/i,
      /\bartificial intelligence\b/i,
      /\bllm\b/i,
      /\bllms\b/i,
      /\blanguage model/i,
    ],
  },
  {
    clusterName: "agents",
    patterns: [
      /\bagent\b/i,
      /\bagents\b/i,
      /\bai agent/i,
      /\bautonomous agent/i,
      /\bcoding agent/i,
    ],
  },
  {
    clusterName: "agent commerce",
    patterns: [/\bagent commerce\b/i, /\bcommerce agent/i, /\bai commerce\b/i],
  },
  {
    clusterName: "base",
    patterns: [/\bbase\b/i, /\bbase chain\b/i],
  },
  {
    clusterName: "crypto infrastructure",
    patterns: [
      /\bcrypto infrastructure\b/i,
      /\bblockchain infrastructure\b/i,
      /\bweb3 infrastructure\b/i,
    ],
  },
  {
    clusterName: "internet capital markets",
    patterns: [/\binternet capital markets\b/i, /\bicm\b/i],
  },
  {
    clusterName: "machine payments",
    patterns: [
      /\bmachine payments\b/i,
      /\bmachine payment\b/i,
      /\bx402\b/i,
      /\bmicropayments\b/i,
      /\bpayment rails\b/i,
    ],
  },
  {
    clusterName: "solana",
    patterns: [/\bsolana\b/i],
  },
];

type Supabase = SupabaseClient<Database>;
type CoinRow = Pick<
  Database["public"]["Tables"]["coins"]["Row"],
  "id" | "chain" | "token_address" | "name" | "symbol" | "metadata"
>;
type RepositoryRow = Pick<
  Database["public"]["Tables"]["github_repos"]["Row"],
  "id" | "repo_full_name" | "url" | "description" | "stars" | "topics" | "metadata"
>;

type SourceDocument =
  | {
      kind: "coin";
      text: string;
      evidence: ClusterCoinEvidence;
    }
  | {
      kind: "repository";
      text: string;
      evidence: ClusterRepositoryEvidence;
    };

type ClusterAccumulator = {
  cluster_name: string;
  coinEvidence: Map<string, ClusterCoinEvidence>;
  repositoryEvidence: Map<string, ClusterRepositoryEvidence>;
};

function isJsonRecord(value: Json | null | undefined): value is Record<string, Json | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getMetadataString(metadata: Json | null, key: string): string | null {
  if (!isJsonRecord(metadata)) {
    return null;
  }

  const value = metadata[key];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeToken(token: string): string {
  if (token.length > 4 && token.endsWith("ies")) {
    return `${token.slice(0, -3)}y`;
  }

  if (token.length > 3 && token.endsWith("s") && token !== "base") {
    return token.slice(0, -1);
  }

  return token;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .map(normalizeToken)
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

function getNgrams(tokens: string[]): string[] {
  const terms = new Set<string>();

  for (let index = 0; index < tokens.length; index += 1) {
    terms.add(tokens[index]);

    if (tokens[index + 1]) {
      terms.add(`${tokens[index]} ${tokens[index + 1]}`);
    }

    if (tokens[index + 1] && tokens[index + 2]) {
      terms.add(`${tokens[index]} ${tokens[index + 1]} ${tokens[index + 2]}`);
    }
  }

  return [...terms];
}

function extractConcepts(text: string): Set<string> {
  const concepts = new Set<string>();

  for (const alias of CONCEPT_ALIASES) {
    if (alias.patterns.some((pattern) => pattern.test(text))) {
      concepts.add(alias.clusterName);
    }
  }

  for (const term of getNgrams(tokenize(text))) {
    concepts.add(term);
  }

  return concepts;
}

function getCoinText(coin: CoinRow): string {
  return [
    coin.name,
    coin.symbol,
    getMetadataString(coin.metadata, "description"),
  ]
    .filter(Boolean)
    .join(" ");
}

function getRepositoryText(repository: RepositoryRow): string {
  return [
    repository.description,
    ...(repository.topics ?? []),
    getMetadataString(repository.metadata, "repository"),
  ]
    .filter(Boolean)
    .join(" ");
}

function coinToDocument(coin: CoinRow): SourceDocument | null {
  const text = getCoinText(coin);

  if (!text.trim()) {
    return null;
  }

  return {
    kind: "coin",
    text,
    evidence: {
      id: coin.id,
      chain: coin.chain,
      token_address: coin.token_address,
      name: coin.name,
      symbol: coin.symbol,
    },
  };
}

function repositoryToDocument(repository: RepositoryRow): SourceDocument | null {
  const text = getRepositoryText(repository);

  if (!text.trim()) {
    return null;
  }

  return {
    kind: "repository",
    text,
    evidence: {
      id: repository.id,
      repository: repository.repo_full_name,
      url: repository.url,
      stars: repository.stars,
    },
  };
}

function addDocumentToCluster(
  clustersByName: Map<string, ClusterAccumulator>,
  clusterName: string,
  document: SourceDocument,
) {
  const cluster = clustersByName.get(clusterName) ?? {
    cluster_name: clusterName,
    coinEvidence: new Map<string, ClusterCoinEvidence>(),
    repositoryEvidence: new Map<string, ClusterRepositoryEvidence>(),
  };

  if (document.kind === "coin") {
    cluster.coinEvidence.set(document.evidence.id, document.evidence);
  } else {
    cluster.repositoryEvidence.set(document.evidence.id, document.evidence);
  }

  clustersByName.set(clusterName, cluster);
}

function toEmergingCluster(cluster: ClusterAccumulator): EmergingCluster {
  const relatedCoins = [...cluster.coinEvidence.values()];
  const relatedRepositories = [...cluster.repositoryEvidence.values()];

  return {
    cluster_name: cluster.cluster_name,
    evidence_count: relatedCoins.length + relatedRepositories.length,
    related_coins: relatedCoins,
    related_repositories: relatedRepositories,
  };
}

function buildClusters(documents: SourceDocument[]): EmergingCluster[] {
  const documentFrequency = new Map<string, number>();
  const documentConcepts = documents.map((document) => {
    const concepts = extractConcepts(document.text);

    for (const concept of concepts) {
      documentFrequency.set(concept, (documentFrequency.get(concept) ?? 0) + 1);
    }

    return { document, concepts };
  });
  const clustersByName = new Map<string, ClusterAccumulator>();

  for (const { document, concepts } of documentConcepts) {
    for (const concept of concepts) {
      if ((documentFrequency.get(concept) ?? 0) < 2) {
        continue;
      }

      addDocumentToCluster(clustersByName, concept, document);
    }
  }

  return [...clustersByName.values()]
    .map(toEmergingCluster)
    .filter((cluster) => cluster.evidence_count >= 2)
    .sort((left, right) => {
      if (right.evidence_count !== left.evidence_count) {
        return right.evidence_count - left.evidence_count;
      }

      return left.cluster_name.localeCompare(right.cluster_name);
    })
    .slice(0, 25);
}

export async function getEmergingClusters(
  supabase: Supabase,
): Promise<EmergingClustersResponse> {
  const [{ data: coins, error: coinsError }, { data: repositories, error: repositoriesError }] =
    await Promise.all([
      supabase
        .from("coins")
        .select("id, chain, token_address, name, symbol, metadata")
        .limit(500),
      supabase
        .from("github_repos")
        .select("id, repo_full_name, url, description, stars, topics, metadata")
        .limit(500),
    ]);

  if (coinsError) {
    throw coinsError;
  }

  if (repositoriesError) {
    throw repositoriesError;
  }

  const documents = [
    ...(coins ?? []).map(coinToDocument),
    ...(repositories ?? []).map(repositoryToDocument),
  ].filter((document): document is SourceDocument => document !== null);

  return {
    success: true,
    clusters: buildClusters(documents),
  };
}
