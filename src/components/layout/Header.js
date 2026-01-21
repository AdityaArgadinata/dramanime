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
    <header className="sticky top-0 z-30 safe-top">
      <div className="ios-surface mx-auto max-w-3xl px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-6 w-6 rounded-lg bg-black/90 dark:bg-white" />
            <span className="text-base font-semibold">Stream</span>
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
