"use client";

import { useRouter, usePathname } from "next/navigation";
import Tabs from "../ui/Tabs";

export default function Hero() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (pathname === "/anime") return 2;
    if (pathname === "/drama") return 1;
    if (pathname === "/movie") return 3;
    return 0; // home
  };

  const handleTabChange = (index) => {
    const routes = ["/", "/drama", "/anime", "/movie"];
    router.push(routes[index]);
  };

  return (
    <section className="mt-4">
      <div className="ios-surface ios-ring overflow-hidden">
        <div className="p-5">
          <h1 className="text-2xl font-semibold tracking-tight">Tonton drama dan anime favoritmu</h1>
          <p className="mt-2 text-muted">Streaming tanpa batas dengan subtitle Indonesia. Kualitas HD, update cepat, gratis selamanya.</p>

          <div className="mt-4">
            <Tabs
              tabs={[
                { label: "Semua", value: "all" },
                { label: "Drama", value: "drama" },
                { label: "Anime", value: "anime" },
                { label: "Movie", value: "movie" },
              ]}
              initial={getActiveTab()}
              onChange={handleTabChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
