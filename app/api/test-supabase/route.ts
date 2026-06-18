import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        inserted: false,
        error: "Supabase service role configuration is missing.",
      },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("scan_runs")
    .insert({
      source: "system-test",
      status: "success",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      {
        success: false,
        inserted: false,
        error,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      inserted: true,
      id: data.id,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
