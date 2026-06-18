import type { CoinOpportunity } from "@/types/dashboard";

type OpportunitiesTableProps = {
  title: string;
  opportunities: CoinOpportunity[];
};

function formatNumber(value: number | null): string {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function OpportunitiesTable({
  title,
  opportunities,
}: OpportunitiesTableProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {title}
      </h2>

      {opportunities.length === 0 ? (
        <p className="mt-4 font-mono text-sm text-zinc-400">
          No scan results yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-zinc-500">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Symbol</th>
                <th className="py-2 pr-4 text-right font-medium">
                  Market Cap
                </th>
                <th className="py-2 pr-4 text-right font-medium">
                  Liquidity
                </th>
                <th className="py-2 text-right font-medium">Volume</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opportunity) => (
                <tr
                  key={opportunity.id}
                  className="border-b border-zinc-900 text-zinc-300 last:border-b-0"
                >
                  <td className="py-2 pr-4 text-zinc-100">
                    {opportunity.name ?? "-"}
                  </td>
                  <td className="py-2 pr-4">{opportunity.symbol ?? "-"}</td>
                  <td className="py-2 pr-4 text-right">
                    {formatNumber(opportunity.marketCap)}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {formatNumber(opportunity.liquidity)}
                  </td>
                  <td className="py-2 text-right">
                    {formatNumber(opportunity.volume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
