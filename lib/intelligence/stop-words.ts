/**
 * Comprehensive English stop-word list.
 *
 * Based on the standard NLTK English stop-word corpus plus common contraction
 * fragments and high-frequency function words. This is intentionally broad: the
 * extraction failure that shipped "of / on / in / is / to" as narratives came
 * from a short hand-rolled list. Do not trim this down.
 */
export const STOP_WORDS: ReadonlySet<string> = new Set([
  "a", "about", "above", "after", "again", "against", "ain", "all", "am", "an",
  "and", "any", "are", "aren", "as", "at", "be", "because", "been", "before",
  "being", "below", "between", "both", "but", "by", "can", "couldn", "d", "did",
  "didn", "do", "does", "doesn", "doing", "don", "down", "during", "each", "few",
  "for", "from", "further", "had", "hadn", "has", "hasn", "have", "haven",
  "having", "he", "her", "here", "hers", "herself", "him", "himself", "his",
  "how", "i", "if", "in", "into", "is", "isn", "it", "its", "itself", "just",
  "ll", "m", "ma", "me", "might", "mightn", "more", "most", "must", "mustn",
  "my", "myself", "need", "needn", "no", "nor", "not", "now", "o", "of", "off",
  "on", "once", "only", "or", "other", "our", "ours", "ourselves", "out", "over",
  "own", "re", "s", "same", "shan", "she", "should", "shouldn", "so", "some",
  "such", "t", "than", "that", "the", "their", "theirs", "them", "themselves",
  "then", "there", "these", "they", "this", "those", "through", "to", "too",
  "under", "until", "up", "ve", "very", "was", "wasn", "we", "were", "weren",
  "what", "when", "where", "which", "while", "who", "whom", "why", "will",
  "with", "won", "would", "wouldn", "y", "you", "your", "yours", "yourself",
  "yourselves",
  // common high-frequency words that are not concepts on their own
  "also", "able", "across", "along", "already", "always", "another", "anyone",
  "around", "back", "been", "best", "better", "come", "could", "current",
  "easy", "even", "every", "first", "free", "full", "get", "gets", "give",
  "going", "good", "great", "help", "high", "however", "include", "includes",
  "including", "instead", "into", "keep", "know", "last", "let", "like", "long",
  "look", "made", "make", "makes", "making", "many", "may", "much", "new",
  "next", "non", "one", "ones", "open", "per", "put", "really", "say", "see",
  "set", "show", "since", "small", "still", "take", "takes", "thing", "things",
  "today", "two", "use", "used", "uses", "using", "via", "want", "way", "well",
  "within", "without", "work", "works", "yet",
]);

export function isStopWord(word: string): boolean {
  return STOP_WORDS.has(word.trim().toLowerCase());
}
