"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";

export default function Header() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 safe-top">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div className="backdrop-blur-xl bg-surface/80 border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-base font-semibold">dramanime</span>
          </button>
          <form onSubmit={handleSearch} className="ml-auto w-full max-w-xs">
            <Input
              type="search"
              placeholder="Cari drama & anime"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isPending}
              className={isPending ? "opacity-50" : ""}
            />
          </form>
        </div>
      </div>
    </header>
  );
}
