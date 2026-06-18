import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { scanDexscreener } from "@/services/dexscreener-scanner";
import { scanGitHub } from "@/services/github-scanner";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: "Supabase service role configuration is missing.",
      },
      { status: 500 },
    );
  }

  try {
    const [github, dexscreener] = await Promise.all([
      scanGitHub(supabase),
      scanDexscreener(supabase),
    ]);

    return NextResponse.json(
      {
        success: true,
        github,
        dexscreener,
        farcaster: {
          skipped: true,
          reason:
            "Neynar cast/channel/trending APIs are blocked by the current plan.",
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 500 },
    );
  }
}
