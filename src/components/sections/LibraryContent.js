"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LibraryContent() {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState("favorites");

  useEffect(() => {
    // Load from localStorage
    const savedFavorites = localStorage.getItem("favorites");
    const savedWatchlist = localStorage.getItem("watchlist");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const removeWatchlist = (id) => {
    const updated = watchlist.filter((item) => item.id !== id);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const getLink = (item) => {
    if (item.type === "anime") return `/anime/${item.id}`;
    if (item.type === "drama") return `/drama/${item.id}`;
    return "/";
  };

  const items = activeTab === "favorites" ? favorites : watchlist;

  return (
    <>
      {/* Tabs */}
      <div className="mb-8 flex gap-4 border-b border-black/5 dark:border-white/10">
        {[
          { id: "favorites", label: `Favorit (${favorites.length})` },
          { id: "watchlist", label: `Watchlist (${watchlist.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {items.length === 0 ? (
        <div className="flex min-h-100 items-center justify-center text-center">
          <div>
            <div className="mb-4 text-5xl">📚</div>
            <h2 className="text-xl font-semibold mb-2">
              {activeTab === "favorites" ? "Tidak ada favorit" : "Tidak ada watchlist"}
            </h2>
            <p className="text-muted mb-6">
              {activeTab === "favorites"
                ? "Tambahkan anime dan drama favorit kamu"
                : "Tambahkan ke watchlist untuk ditonton nanti"}
            </p>
            <Link href="/list" className="text-primary hover:underline text-sm font-medium">
              Jelajahi Konten
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <div key={`${item.type}-${item.id}`} className="group">
              <Link href={getLink(item)} className="block mb-3">
                <div className="relative w-full bg-black overflow-hidden rounded-lg">
                  {item.cover && (
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="h-auto w-full object-cover aspect-2/3 transition-transform group-hover:scale-105"
                    />
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end justify-end p-4">
                    <div className="text-white text-sm font-semibold line-clamp-2">
                      {item.title}
                    </div>
                  </div>
                </div>
              </Link>

              <button
                onClick={() => {
                  if (activeTab === "favorites") {
                    removeFavorite(item.id);
                  } else {
                    removeWatchlist(item.id);
                  }
                }}
                className="w-full text-xs py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors font-medium"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
