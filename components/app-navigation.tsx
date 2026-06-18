import Link from "next/link";

const NAVIGATION_ITEMS = [
  { href: "/brief", label: "Brief" },
  { href: "/rabbit-holes", label: "Rabbit Holes" },
  { href: "/tribes", label: "Tribes" },
  { href: "/narratives", label: "Narratives" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/settings", label: "Settings" },
];

export function AppNavigation() {
  return (
    <aside className="border-b border-zinc-900 bg-black/70 px-4 py-4 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <Link href="/" className="block">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300/80">
          Nameless OS
        </p>
        <p className="mt-2 font-mono text-xl font-semibold text-zinc-100">
          Intelligence
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          Signal Before Noise
        </p>
      </Link>

      <nav className="mt-6 flex gap-2 overflow-x-auto lg:block lg:space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group whitespace-nowrap border border-zinc-800 bg-zinc-950/50 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400 transition hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-zinc-100 lg:block"
          >
            <span
              aria-hidden="true"
              className="mr-2 text-zinc-700 group-hover:text-cyan-300"
            >
              //
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 hidden border-t border-zinc-900 pt-5 lg:block">
        <p className="font-mono text-xs leading-5 text-zinc-600">
          Research desk for emerging digital tribes, narratives, rabbit holes,
          and opportunity clusters before they become mainstream.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["Tribes", "Narratives", "Builders"].map((label) => (
            <div
              key={label}
              className="border border-zinc-900 bg-zinc-950 p-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-600"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
