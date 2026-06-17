import { isGitHubConfigured } from "@/lib/github";
import { isNeynarConfigured } from "@/lib/neynar";
import { isOpenAIConfigured } from "@/lib/openai";
import { isSupabaseClientConfigured } from "@/lib/supabase";
import type { IntegrationStatus } from "@/types/integrations";

export function getIntegrationStatuses(): IntegrationStatus[] {
  const supabaseConnected = isSupabaseClientConfigured();

  return [
    {
      id: "supabase",
      label: "Supabase",
      state: supabaseConnected ? "connected" : "not_connected",
      displayValue: supabaseConnected ? "Connected" : "Not Connected",
    },
    {
      id: "openai",
      label: "OpenAI",
      state: isOpenAIConfigured() ? "configured" : "missing",
      displayValue: isOpenAIConfigured() ? "Configured" : "Missing",
    },
    {
      id: "github",
      label: "GitHub",
      state: isGitHubConfigured() ? "configured" : "missing",
      displayValue: isGitHubConfigured() ? "Configured" : "Missing",
    },
    {
      id: "neynar",
      label: "Neynar",
      state: isNeynarConfigured() ? "configured" : "missing",
      displayValue: isNeynarConfigured() ? "Configured" : "Missing",
    },
  ];
}
