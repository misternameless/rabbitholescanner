import { StatusList } from "@/components/status-list";
import { getIntegrationStatuses } from "@/services/integration-status";

export default function Home() {
  const statuses = getIntegrationStatuses();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <div className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.42em] text-zinc-500">
            AI + Crypto Opportunity Intelligence
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Nameless Intelligence
          </h1>
          <p className="mt-5 text-2xl font-medium text-zinc-300 sm:text-3xl">
            Signal Before Noise
          </p>
        </div>

        <StatusList statuses={statuses} />
      </div>
    </main>
  );
}
