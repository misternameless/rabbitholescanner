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
      scan_runs: {
        Row: {
          id: string;
          source: string;
          status: string;
        };
        Insert: {
          id?: string;
          source: string;
          status: string;
        };
        Update: {
          id?: string;
          source?: string;
          status?: string;
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
