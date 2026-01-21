"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Skeleton from "../ui/Skeleton";

const PAGE_SIZE = 20;

export default function DramaList() {
  const [dramaList, setDramaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  const normalizeAndMerge = useCallback((incoming, replace = false) => {
    setDramaList((prev) => {
      const base = replace ? [] : prev;
      const seen = new Set(base.map((item) => item.id));
      const merged = [...base];

      for (const item of incoming) {
        const id = item?.drama_id || item?.id;
        if (!id || seen.has(id)) continue;
        seen.add(id);

        merged.push({
          id,
          title: item?.drama_title || item?.name || "Drama",
          cover: item?.drama_cover || item?.cover,
          episodes:
            item?.chapters ??
            item?.charge_chapters ??
            item?.total_eps ??
            item?.episodes,
        });
      }

      return merged;
    });
  }, []);

  const fetchPage = useCallback(
    async (pageNum, { replace = false, initial = false } = {}) => {
      if (initial) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetch(
          `https://dramabos.asia/api/meloshort/api/home?page=${pageNum}&page_size=${PAGE_SIZE}`,
          { headers: { accept: "application/json" } }
        );
        if (!res.ok) throw new Error("Failed to fetch drama");
        const json = await res.json();
        const newData = json?.data || [];

        normalizeAndMerge(newData, replace);
        setHasMore(newData.length === PAGE_SIZE);
        setPage(pageNum);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data drama");
        setHasMore(false);
      } finally {
        if (initial) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [normalizeAndMerge]
  );

  useEffect(() => {
    fetchPage(1, { replace: true, initial: true });
  }, [fetchPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchPage(page + 1, { replace: false });
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore, page, fetchPage]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="overflow-hidden rounded-lg">
            <Skeleton className="aspect-3/4 w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-center">
        <div>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (dramaList.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-center">
        <div>
          <p className="text-muted">Tidak ada drama tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {dramaList.map((drama) => (
          <Link
            key={drama.id}
            href={`/drama/${drama.id}`}
            className="group overflow-hidden rounded-lg bg-surface shadow-sm ios-ring"
          >
            <div className="relative aspect-3/4 w-full overflow-hidden">
              {drama.cover ? (
                <img
                  src={drama.cover}
                  alt={drama.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700" />
              )}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10" />
            </div>
            <div className="p-3">
              <div className="text-foreground text-sm font-semibold truncate">{drama.title}</div>
              <div className="text-muted text-xs mt-1 truncate">
                {drama.episodes ? `${drama.episodes} Episode` : "Episode tersedia"}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Loading indicator */}
      {loadingMore && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg">
              <Skeleton className="aspect-3/4 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && <div ref={observerTarget} className="h-10" />}

      {/* End of list message */}
      {!hasMore && !loading && dramaList.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted">Semua drama telah ditampilkan</p>
        </div>
      )}
    </>
  );
}
