export type IntegrationId = "supabase" | "openai" | "github" | "neynar";

export type IntegrationState =
  | "connected"
  | "not_connected"
  | "configured"
  | "missing";

export type IntegrationStatus = {
  id: IntegrationId;
  label: string;
  state: IntegrationState;
  displayValue: "Connected" | "Not Connected" | "Configured" | "Missing";
};
