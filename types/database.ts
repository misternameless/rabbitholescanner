export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      coins: {
        Row: {
          id: string;
          chain: string;
          token_address: string;
          pair_address: string | null;
          name: string | null;
          symbol: string | null;
          dex: string | null;
          market_cap: number | null;
          fdv: number | null;
          liquidity_usd: number | null;
          volume_24h: number | null;
          pair_created_at: string | null;
          website: string | null;
          x_url: string | null;
          telegram_url: string | null;
          github_url: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chain: string;
          token_address: string;
          pair_address?: string | null;
          name?: string | null;
          symbol?: string | null;
          dex?: string | null;
          market_cap?: number | null;
          fdv?: number | null;
          liquidity_usd?: number | null;
          volume_24h?: number | null;
          pair_created_at?: string | null;
          website?: string | null;
          x_url?: string | null;
          telegram_url?: string | null;
          github_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chain?: string;
          token_address?: string;
          pair_address?: string | null;
          name?: string | null;
          symbol?: string | null;
          dex?: string | null;
          market_cap?: number | null;
          fdv?: number | null;
          liquidity_usd?: number | null;
          volume_24h?: number | null;
          pair_created_at?: string | null;
          website?: string | null;
          x_url?: string | null;
          telegram_url?: string | null;
          github_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      scan_runs: {
        Row: {
          id: string;
          source: string;
          status: string;
          started_at: string;
          finished_at: string | null;
          error: string | null;
        };
        Insert: {
          id?: string;
          source: string;
          status: string;
          started_at?: string;
          finished_at?: string | null;
          error?: string | null;
        };
        Update: {
          id?: string;
          source?: string;
          status?: string;
          started_at?: string;
          finished_at?: string | null;
          error?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
