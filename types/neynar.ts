import type { Json } from "@/types/database";

export type NeynarUser = {
  fid?: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
};

export type NeynarChannel = {
  id?: string;
  name?: string;
  description?: string;
  url?: string;
  image_url?: string;
  follower_count?: number;
  member_count?: number;
  lead?: NeynarUser;
  moderator?: NeynarUser;
};

export type NeynarCast = {
  hash?: string;
  thread_hash?: string;
  parent_hash?: string | null;
  parent_url?: string | null;
  text?: string;
  timestamp?: string;
  author?: NeynarUser;
  channel?: NeynarChannel;
  root_parent_url?: string | null;
  reactions?: Json;
  replies?: Json;
  recasts?: Json;
  embeds?: Json;
};

export type NeynarCastSearchResponse = {
  casts?: NeynarCast[];
  next?: {
    cursor?: string;
  };
};

export type NeynarChannelSearchResponse = {
  channels?: NeynarChannel[];
  next?: {
    cursor?: string;
  };
};

export type NeynarFeedResponse = {
  casts?: NeynarCast[];
  next?: {
    cursor?: string;
  };
};

export type NeynarApiError = {
  status: number;
  statusText: string;
  body: unknown;
};
