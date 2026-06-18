"use client";

import { useMemo } from "react";
import type { IntegrationStatus } from "@/types/integrations";

export function useIntegrationStatus(statuses: IntegrationStatus[]) {
  return useMemo(() => statuses, [statuses]);
}
