export type IntegrationId =
  | "supabase"
  | "openai"
  | "github"
  | "dexscreener"
  | "neynar";

export type IntegrationState =
  | "connected"
  | "available"
  | "not_connected"
  | "configured"
  | "missing";

export type IntegrationStatus = {
  id: IntegrationId;
  label: string;
  state: IntegrationState;
  displayValue:
    | "Connected"
    | "Available"
    | "Not Connected"
    | "Configured"
    | "Missing";
};
