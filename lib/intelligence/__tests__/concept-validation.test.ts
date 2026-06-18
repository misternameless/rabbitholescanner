import assert from "node:assert/strict";
import { test } from "node:test";
import {
  validateConcept,
  type ConceptEvidence,
} from "../concept-validation";

/**
 * Two independent evidence items from two distinct authors. Provided so that
 * "accept" cases fail ONLY if the concept name itself is invalid, never because
 * of missing evidence.
 */
const STRONG_EVIDENCE: ConceptEvidence[] = [
  { id: "repo-1", source: "github", author: "alice" },
  { id: "repo-2", source: "github", author: "bob" },
];

// These must always be rejected regardless of evidence strength.
const MUST_REJECT = ["of", "on", "in", "is", "to", "a", "the", "ai"];

for (const candidate of MUST_REJECT) {
  test(`rejects stop-word / generic / short concept: "${candidate}"`, () => {
    const result = validateConcept(candidate, STRONG_EVIDENCE);
    assert.equal(
      result.valid,
      false,
      `expected "${candidate}" to be rejected, got ${JSON.stringify(result)}`,
    );
  });
}

// These must be accepted when real cross-source evidence supports them.
const MUST_ACCEPT = [
  "agent commerce",
  "machine payments",
  "x402",
  "autonomous companies",
];

for (const candidate of MUST_ACCEPT) {
  test(`accepts real concept with cross-source evidence: "${candidate}"`, () => {
    const result = validateConcept(candidate, STRONG_EVIDENCE);
    assert.equal(
      result.valid,
      true,
      `expected "${candidate}" to be accepted, got ${JSON.stringify(result)}`,
    );
  });
}

test("rejects a real concept that lacks independent evidence", () => {
  const singleAuthor: ConceptEvidence[] = [
    { id: "repo-1", source: "github", author: "alice" },
    { id: "repo-2", source: "github", author: "alice" },
  ];
  const result = validateConcept("agent commerce", singleAuthor);
  assert.equal(result.valid, false);
  assert.equal(result.reason, "insufficient_independent_sources");
});

test("rejects a real concept with only one evidence item", () => {
  const result = validateConcept("machine payments", [
    { id: "repo-1", source: "github", author: "alice" },
  ]);
  assert.equal(result.valid, false);
  assert.equal(result.reason, "insufficient_evidence");
});

test("rejects purely numeric candidates", () => {
  const result = validateConcept("2026", STRONG_EVIDENCE);
  assert.equal(result.valid, false);
  assert.equal(result.reason, "numeric");
});
