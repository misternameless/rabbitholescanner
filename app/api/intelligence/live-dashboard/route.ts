import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIntelligenceDashboard } from "@/services/intelligence-product";

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
    return NextResponse.json(await getIntelligenceDashboard(supabase), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
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
