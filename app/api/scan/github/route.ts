import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { scanGitHub } from "@/services/github-scanner";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    {
      status: 500,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function GET() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return errorResponse("Supabase service role configuration is missing.");
  }

  try {
    const result = await scanGitHub(supabase);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
