import { STOP_WORDS } from "./stop-words";

export const MIN_CONCEPT_LENGTH = 4;
export const MIN_EVIDENCE_ITEMS = 2;
export const MIN_DISTINCT_SOURCES = 2;

/**
 * Single words that are too generic to be a concept/tribe/narrative on their
 * own. They are allowed only as part of a multi-word concept
 * (e.g. "agent commerce", "ai agents marketplace").
 */
export const GENERIC_SINGLE_WORDS: ReadonlySet<string> = new Set([
  "ai", "agent", "agents", "api", "app", "apps", "bot", "bots", "chain",
  "coin", "coins", "crypto", "dao", "data", "defi", "dev", "framework",
  "library", "llm", "llms", "mcp", "meme", "model", "models", "network", "nft",
  "node", "protocol", "sdk", "service", "services", "stack", "token", "tokens",
  "tool", "tools", "web", "web3",
]);

export type ConceptEvidence = {
  id: string;
  /** Source system, e.g. "github", "dexscreener", "farcaster". */
  source: string;
  /** Distinct author/owner/account when available (repo owner, fid, handle). */
  author?: string | null;
};

export type ConceptValidationResult = {
  valid: boolean;
  normalized: string;
  reason?:
    | "empty"
    | "too_short"
    | "numeric"
    | "stop_word"
    | "generic_single_word"
    | "insufficient_evidence"
    | "insufficient_independent_sources";
};

function normalizeCandidate(candidate: string): string {
  return candidate.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Hard, write-time validation gate.
 *
 * This MUST run before any concept name is written to Supabase or rendered.
 * A candidate that fails here is dropped and logged — there is no path for an
 * invalid concept to reach the `narratives`/tribe data or the UI.
 */
export function validateConcept(
  candidate: string,
  evidence: ConceptEvidence[] = [],
): ConceptValidationResult {
  const normalized = normalizeCandidate(candidate ?? "");

  if (!normalized) {
    return { valid: false, normalized, reason: "empty" };
  }

  const compact = normalized.replace(/\s+/g, "");

  if (compact.length < MIN_CONCEPT_LENGTH) {
    return { valid: false, normalized, reason: "too_short" };
  }

  if (/^[0-9]+$/.test(compact)) {
    return { valid: false, normalized, reason: "numeric" };
  }

  const words = normalized.split(" ");

  if (words.every((word) => STOP_WORDS.has(word))) {
    return { valid: false, normalized, reason: "stop_word" };
  }

  if (words.length === 1 && GENERIC_SINGLE_WORDS.has(words[0])) {
    return { valid: false, normalized, reason: "generic_single_word" };
  }

  const realEvidence = evidence.filter((item) => item && item.id);

  if (realEvidence.length < MIN_EVIDENCE_ITEMS) {
    return { valid: false, normalized, reason: "insufficient_evidence" };
  }

  const distinctSources = new Set(
    realEvidence.map((item) => {
      const author = item.author?.trim().toLowerCase();

      return author ? `author:${author}` : `source:${item.source}`;
    }),
  );

  if (distinctSources.size < MIN_DISTINCT_SOURCES) {
    return {
      valid: false,
      normalized,
      reason: "insufficient_independent_sources",
    };
  }

  return { valid: true, normalized };
}

export function isConceptValid(
  candidate: string,
  evidence: ConceptEvidence[] = [],
): boolean {
  return validateConcept(candidate, evidence).valid;
}
