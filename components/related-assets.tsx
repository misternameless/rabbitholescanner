import type { RelatedAsset } from "@/types/intelligence-product";

type RelatedAssetsProps = {
  assets: RelatedAsset[];
};

export function RelatedAssets({ assets }: RelatedAssetsProps) {
  return (
    <details className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
      <summary className="cursor-pointer font-mono text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
        Related Assets
      </summary>

      <div className="mt-5">
        {assets.length === 0 ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-950/60 p-5">
            <p className="font-mono text-sm leading-6 text-zinc-500">
              No related assets attached to detected intelligence yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {assets.map((asset) => (
              <article
                key={asset.id}
                className="border border-zinc-800 bg-zinc-950/60 p-4"
              >
                <h3 className="font-mono text-base text-zinc-100">
                  {asset.name}
                </h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {asset.symbol ?? "No symbol"} / {asset.chain}
                </p>
                <p className="mt-3 text-sm text-zinc-400">
                  Attached to: {asset.attached_to}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
