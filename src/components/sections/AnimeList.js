"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";

export default function AnimeList() {
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  // Deduplicate function
  const deduplicateAnime = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
  };

  const fetchAnime = useCallback(async (pageNum) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `https://dramabos.asia/api/tensei/anime?page=${pageNum}&order=update`,
        {
          headers: { accept: "application/json" },
        }
      );

      if (!res.ok) {
        setHasMore(false);
        return;
      }

      const json = await res.json();
      const newData = json?.data || [];

      if (newData.length === 0) {
        setHasMore(false);
        return;
      }

      setAnimeList((prev) => {
        const combined = [...prev, ...newData];
        return deduplicateAnime(combined);
      });
    } catch (error) {
      console.error("Failed to fetch anime:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Initial load
  useEffect(() => {
    fetchAnime(1);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchAnime(nextPage);
            return nextPage;
          });
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
  }, [hasMore, loading, fetchAnime]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {animeList.map((anime) => (
          <Card
            key={anime.slug}
            title={anime.title}
            subtitle={`${anime.type} • ${anime.status}`}
            cover={anime.img}
            slug={anime.slug}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
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
      {!hasMore && !loading && animeList.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted">Semua anime telah ditampilkan</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && animeList.length === 0 && (
        <div className="flex min-h-[40vh] items-center justify-center text-center">
          <div>
            <p className="text-muted">Tidak ada anime tersedia</p>
          </div>
        </div>
      )}
    </>
  );
}
