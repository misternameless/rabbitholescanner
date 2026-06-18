type IntelligenceSectionProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export function IntelligenceSection({
  title,
  eyebrow,
  children,
}: IntelligenceSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-zinc-800/90 bg-zinc-950/70 p-5 shadow-xl shadow-black/30">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      {eyebrow ? (
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="relative overflow-hidden border border-dashed border-zinc-700/80 bg-black/40 p-5">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400/60 via-zinc-700 to-fuchsia-400/40" />
      <p className="pl-3 font-mono text-sm leading-6 text-zinc-400">
        {message}
      </p>
    </div>
  );
}
