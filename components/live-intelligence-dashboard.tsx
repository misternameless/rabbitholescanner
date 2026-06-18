"use client";

import { useEffect, useMemo, useState } from "react";
import { IntelligenceCommandCenter } from "@/components/intelligence-command-center";
import { IntelligenceBriefPanel } from "@/components/intelligence-brief";
import { LiveAlerts } from "@/components/live-alerts";
import { NarrativeBubbleMap } from "@/components/narrative-bubble-map";
import { OpportunityRadar } from "@/components/opportunity-radar";
import { RabbitHoleCards } from "@/components/rabbit-hole-cards";
import { RelatedAssets } from "@/components/related-assets";
import { TribeCards } from "@/components/tribe-cards";
import { WeakSignals } from "@/components/weak-signals";
import type { IntelligenceDashboard } from "@/types/intelligence-product";

type LiveIntelligenceDashboardProps = {
  initialData: IntelligenceDashboard;
};

const RESCAN_INTERVAL_SECONDS = 60;

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function LiveIntelligenceDashboard({
  initialData,
}: LiveIntelligenceDashboardProps) {
  const [data, setData] = useState(initialData);
  const [secondsUntilScan, setSecondsUntilScan] = useState(
    RESCAN_INTERVAL_SECONDS,
  );
  const [scanState, setScanState] = useState<"idle" | "scanning">("idle");
  const [lastSweepResult, setLastSweepResult] = useState<string | null>(null);

  const generatedAt = useMemo(
    () => formatTimestamp(data.generated_at),
    [data.generated_at],
  );

  async function refreshDashboard() {
    const response = await fetch("/api/intelligence/live-dashboard", {
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    setData((await response.json()) as IntelligenceDashboard);
  }

  async function runLiveSweep() {
    if (scanState === "scanning") {
      return;
    }

    setScanState("scanning");

    try {
      const response = await fetch("/api/scan/live-sweep", {
        cache: "no-store",
      });
      const body = await response.json();

      if (response.ok && body.success === true) {
        setLastSweepResult(
          `GitHub ${body.github?.scanned ?? 0} / Dex ${
            body.dexscreener?.scanned ?? 0
          }`,
        );
      } else {
        setLastSweepResult("Sweep returned an error");
      }
    } catch {
      setLastSweepResult("Sweep failed");
    } finally {
      await refreshDashboard();
      setSecondsUntilScan(RESCAN_INTERVAL_SECONDS);
      setScanState("idle");
    }
  }

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      void refreshDashboard();
    }, 15000);

    return () => window.clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsUntilScan((current) => {
        if (current <= 1) {
          void runLiveSweep();
          return RESCAN_INTERVAL_SECONDS;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/5 px-5 py-4 font-mono text-xs uppercase tracking-[0.16em] text-cyan-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
          </span>
          <span>Live intelligence loop active</span>
          <span className="text-zinc-500">Generated {generatedAt} UTC</span>
        </div>
        <div className="text-zinc-400">
          {scanState === "scanning"
            ? "Rescanning sources now"
            : `Next rescan in ${secondsUntilScan}s`}
          {lastSweepResult ? ` / ${lastSweepResult}` : ""}
        </div>
      </div>

      <LiveAlerts alerts={data.alerts} />
      <IntelligenceCommandCenter
        readiness={data.readiness}
        sources={data.source_inventory}
      />
      <IntelligenceBriefPanel brief={data.brief} />
      <RabbitHoleCards rabbitHoles={data.rabbit_holes} />
      <TribeCards tribes={data.digital_tribes} />
      <NarrativeBubbleMap bubbles={data.narrative_bubbles} />
      <OpportunityRadar items={data.opportunity_radar} />
      <WeakSignals signals={data.weak_signals} />
      <RelatedAssets assets={data.related_assets} />
    </div>
  );
}
