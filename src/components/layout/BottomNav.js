"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { key: "home", label: "Home", href: "/" },
  { key: "library", label: "Library", href: "/library" },
];

const baseButton =
  "inline-flex h-10 flex-1 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors";
const inactiveButton =
  "bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/5";
const activeButton = "bg-primary/10 text-primary ios-ring";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 safe-bottom bg-background border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-4 pb-2 pt-2">
        <div className="flex items-center justify-between px-2 py-2">
          {items.map((it) => {
            const active = isActive(it.href);
            return (
              <Link
                key={it.key}
                href={it.href}
                className={`${baseButton} ${active ? activeButton : inactiveButton}`}
                aria-current={active ? "page" : undefined}
              >
                {it.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
