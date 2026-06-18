import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchNeynarTrendingFeed,
  searchNeynarCasts,
  searchNeynarChannels,
} from "@/lib/neynar";
import type { Database, Json } from "@/types/database";
import type { NeynarCast, NeynarChannel } from "@/types/neynar";

const FOCUS_TOPICS = [
  "Base",
  "Solana",
  "AI",
  "Agents",
  "Crypto infrastructure",
  "Internet Capital Markets",
  "Machine Payments",
  "Agent Commerce",
] as const;

type Supabase = SupabaseClient<Database>;
type RawSignalInsert = Database["public"]["Tables"]["raw_signals"]["Insert"];

export type FarcasterScanResult = {
  success: true;
  scanned: number;
  inserted: number;
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

function getAuthor(cast: NeynarCast): string | null {
  return (
    normalizeString(cast.author?.username) ??
    normalizeString(cast.author?.display_name) ??
    (typeof cast.author?.fid === "number" ? String(cast.author.fid) : null)
  );
}

function getChannelAuthor(channel: NeynarChannel): string | null {
  return (
    normalizeString(channel.lead?.username) ??
    normalizeString(channel.moderator?.username) ??
    normalizeString(channel.lead?.display_name) ??
    normalizeString(channel.moderator?.display_name) ??
    null
  );
}

function getCastUrl(cast: NeynarCast): string | null {
  const username = normalizeString(cast.author?.username);
  const hash = normalizeString(cast.hash);

  if (!username || !hash) {
    return null;
  }

  return `https://warpcast.com/${username}/${hash}`;
}

function getChannelUrl(channel: NeynarChannel): string | null {
  const url = normalizeString(channel.url);
  const id = normalizeString(channel.id);

  return url ?? (id ? `https://warpcast.com/~/channel/${id}` : null);
}

function getPublishedAt(timestamp: unknown): string | null {
  const value = normalizeString(timestamp);

  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function includesFocusTopic(value: string | null): boolean {
  if (!value) {
    return false;
  }

  const lowerValue = value.toLowerCase();

  return FOCUS_TOPICS.some((topic) =>
    lowerValue.includes(topic.toLowerCase()),
  );
}

function detectTopic(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const lowerValue = value.toLowerCase();

  return (
    FOCUS_TOPICS.find((topic) =>
      lowerValue.includes(topic.toLowerCase()),
    ) ?? null
  );
}

function detectChain(value: string | null): string | null {
  const topic = detectTopic(value);

  if (topic === "Base" || topic === "Solana") {
    return topic.toLowerCase();
  }

  return null;
}

function createContentHash(signal: Pick<RawSignalInsert, "source" | "external_id" | "url" | "content">) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        source: signal.source,
        external_id: signal.external_id,
        url: signal.url,
        content: signal.content,
      }),
    )
    .digest("hex");
}

function signalWithHash(signal: RawSignalInsert): RawSignalInsert {
  return {
    ...signal,
    content_hash: createContentHash(signal),
  };
}

function castToRawSignal(
  cast: NeynarCast,
  source: string,
  topic: string | null,
): RawSignalInsert | null {
  const content = normalizeString(cast.text);
  const externalId = normalizeString(cast.hash);
  const channelId = normalizeString(cast.channel?.id);

  if (!content && !externalId) {
    return null;
  }

  const searchableText = [content, channelId, cast.channel?.name]
    .filter(Boolean)
    .join(" ");

  return signalWithHash({
    source,
    chain: detectChain(searchableText),
    external_id: externalId,
    url: getCastUrl(cast),
    title: null,
    content,
    author: getAuthor(cast),
    published_at: getPublishedAt(cast.timestamp),
    metadata: {
      topic,
      channel: cast.channel ?? null,
      parent_hash: cast.parent_hash ?? null,
      parent_url: cast.parent_url ?? null,
      root_parent_url: cast.root_parent_url ?? null,
      reactions: cast.reactions ?? null,
      replies: cast.replies ?? null,
      recasts: cast.recasts ?? null,
      embeds: cast.embeds ?? null,
      raw: cast as Json,
    },
  });
}

function channelToRawSignal(
  channel: NeynarChannel,
  topic: string,
): RawSignalInsert | null {
  const id = normalizeString(channel.id);
  const name = normalizeString(channel.name);
  const description = normalizeString(channel.description);
  const content = [name, description].filter(Boolean).join("\n\n") || null;

  if (!id && !content) {
    return null;
  }

  return signalWithHash({
    source: "neynar:channel_search",
    chain: detectChain(`${name ?? ""} ${description ?? ""}`),
    external_id: id,
    url: getChannelUrl(channel),
    title: name,
    content,
    author: getChannelAuthor(channel),
    published_at: null,
    metadata: {
      topic,
      follower_count: channel.follower_count ?? null,
      member_count: channel.member_count ?? null,
      raw: channel as Json,
    },
  });
}

function dedupeSignals(signals: RawSignalInsert[]): RawSignalInsert[] {
  return [
    ...new Map(
      signals
        .filter((signal) => signal.content_hash)
        .map((signal) => [signal.content_hash, signal]),
    ).values(),
  ];
}

async function collectRawSignals(): Promise<RawSignalInsert[]> {
  const [castSearchResults, channelSearchResults, trendingFeed] =
    await Promise.all([
      Promise.all(
        FOCUS_TOPICS.map(async (topic) => ({
          topic,
          response: await searchNeynarCasts(topic, 10),
        })),
      ),
      Promise.all(
        FOCUS_TOPICS.map(async (topic) => ({
          topic,
          response: await searchNeynarChannels(topic, 5),
        })),
      ),
      fetchNeynarTrendingFeed(25),
    ]);

  const castSignals = castSearchResults.flatMap(({ topic, response }) =>
    (response.casts ?? [])
      .map((cast) => castToRawSignal(cast, "neynar:cast_search", topic))
      .filter((signal): signal is RawSignalInsert => signal !== null),
  );

  const channelSignals = channelSearchResults.flatMap(({ topic, response }) =>
    (response.channels ?? [])
      .map((channel) => channelToRawSignal(channel, topic))
      .filter((signal): signal is RawSignalInsert => signal !== null),
  );

  const trendingSignals = (trendingFeed.casts ?? [])
    .filter((cast) =>
      includesFocusTopic(
        [cast.text, cast.channel?.id, cast.channel?.name]
          .filter(Boolean)
          .join(" "),
      ),
    )
    .map((cast) =>
      castToRawSignal(cast, "neynar:trending_feed", detectTopic(cast.text ?? null)),
    )
    .filter((signal): signal is RawSignalInsert => signal !== null);

  return dedupeSignals([...castSignals, ...channelSignals, ...trendingSignals]);
}

async function insertRawSignals(
  supabase: Supabase,
  scanRunId: string,
  signals: RawSignalInsert[],
): Promise<number> {
  if (signals.length === 0) {
    return 0;
  }

  const contentHashes = signals
    .map((signal) => signal.content_hash)
    .filter((hash): hash is string => Boolean(hash));

  const { data: existingSignals, error: existingError } = await supabase
    .from("raw_signals")
    .select("content_hash")
    .in("content_hash", contentHashes);

  if (existingError) {
    throw existingError;
  }

  const existingHashes = new Set(
    (existingSignals ?? [])
      .map((signal) => signal.content_hash)
      .filter((hash): hash is string => Boolean(hash)),
  );
  const newSignals = signals
    .filter((signal) => !existingHashes.has(signal.content_hash ?? ""))
    .map((signal) => ({
      ...signal,
      scan_run_id: scanRunId,
    }));

  if (newSignals.length === 0) {
    return 0;
  }

  const { error } = await supabase.from("raw_signals").insert(newSignals);

  if (error) {
    throw error;
  }

  return newSignals.length;
}

export async function scanFarcaster(
  supabase: Supabase,
): Promise<FarcasterScanResult> {
  const { data: scanRun, error: scanRunError } = await supabase
    .from("scan_runs")
    .insert({
      source: "farcaster",
      status: "started",
    })
    .select("id")
    .single();

  if (scanRunError) {
    throw scanRunError;
  }

  try {
    const signals = await collectRawSignals();
    const inserted = await insertRawSignals(supabase, scanRun.id, signals);
    const result: FarcasterScanResult = {
      success: true,
      scanned: signals.length,
      inserted,
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
