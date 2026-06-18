"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ScanState = "idle" | "running" | "success" | "error";

export function ScanControls() {
  const router = useRouter();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function runDexscreenerScan() {
    setScanState("running");
    setMessage(null);

    try {
      const response = await fetch("/api/scan/dexscreener", {
        method: "GET",
        cache: "no-store",
      });
      const body = await response.json();

      if (!response.ok || body.success !== true) {
        throw new Error(JSON.stringify(body));
      }

      setScanState("success");
      setMessage(
        `Scanned ${body.scanned}; inserted ${body.inserted}; updated ${body.updated}.`,
      );
      router.refresh();
    } catch (error) {
      setScanState("error");
      setMessage(error instanceof Error ? error.message : "Scan failed.");
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        Scan Controls
      </h2>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={runDexscreenerScan}
          disabled={scanState === "running"}
          className="w-full border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm uppercase tracking-[0.16em] text-zinc-100 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {scanState === "running"
            ? "Running Dexscreener Scan"
            : "Run Dexscreener Scan"}
        </button>

        {message ? (
          <p
            className={`font-mono text-sm ${
              scanState === "error" ? "text-red-300" : "text-zinc-400"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
