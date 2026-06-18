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
    <section className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
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
    <div className="border border-dashed border-zinc-800 bg-zinc-950/60 p-5">
      <p className="font-mono text-sm leading-6 text-zinc-500">{message}</p>
    </div>
  );
}
