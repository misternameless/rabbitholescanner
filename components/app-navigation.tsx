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
    <aside className="border-b border-zinc-900 bg-black/50 px-4 py-4 lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <Link href="/" className="block">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
          Nameless
        </p>
        <p className="mt-2 font-mono text-lg font-semibold text-zinc-100">
          Intelligence
        </p>
      </Link>

      <nav className="mt-6 flex gap-2 overflow-x-auto lg:block lg:space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap border border-zinc-800 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-100 lg:block"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <p className="mt-6 hidden border-t border-zinc-900 pt-5 font-mono text-xs leading-5 text-zinc-600 lg:block">
        Research desk for emerging digital tribes, narratives, rabbit holes,
        and opportunity clusters before they become mainstream.
      </p>
    </aside>
  );
}
