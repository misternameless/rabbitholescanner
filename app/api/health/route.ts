import { NextResponse } from "next/server";
import { getIntegrationStatuses } from "@/services/integration-status";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      name: "Nameless Intelligence",
      status: "ok",
      integrations: getIntegrationStatuses(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
