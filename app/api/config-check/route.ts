import { NextResponse } from "next/server";
import { getConfigCheck } from "@/lib/env";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(getConfigCheck(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
