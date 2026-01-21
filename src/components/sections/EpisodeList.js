"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const EPISODES_PER_PAGE = 12;

export default function EpisodeList({
  dramaId,
  currentChapterId,
  allEpisodes,
}) {
  const [visibleEpisodes, setVisibleEpisodes] = useState(allEpisodes.slice(0, EPISODES_PER_PAGE));
  const [displayedCount, setDisplayedCount] = useState(EPISODES_PER_PAGE);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => {
            const newCount = Math.min(prev + EPISODES_PER_PAGE, allEpisodes.length);
            setVisibleEpisodes(allEpisodes.slice(0, newCount));
            return newCount;
          });
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [allEpisodes]);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">Semua Episode</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {visibleEpisodes.map((ep) => (
          <Link
            key={ep.chapter_id}
            href={`/watch/drama/${dramaId}/${ep.chapter_id}`}
            className={`ios-surface ios-ring overflow-hidden rounded-lg transition-opacity hover:opacity-80 ${
              ep.chapter_id === currentChapterId
                ? "ring-2 ring-[var(--primary)]"
                : ""
            }`}
          >
            <div className="relative w-full bg-black">
              {ep.first_frame && (
                <img
                  src={ep.first_frame}
                  alt={ep.chapter_name}
                  className="h-auto w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white font-semibold">
                    {ep.chapter_name}
                  </div>
                  {!ep.is_free && (
                    <div className="text-xs text-orange-400 mt-1">
                      {ep.chapter_price} Koin
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {displayedCount < allEpisodes.length && (
        <div
          ref={observerTarget}
          className="mt-6 flex justify-center text-sm text-muted"
        >
          Gulir ke bawah untuk memuat lebih banyak episode...
        </div>
      )}

      {displayedCount >= allEpisodes.length && (
        <div className="mt-6 text-center text-sm text-muted">
          Semua {allEpisodes.length} episode sudah ditampilkan
        </div>
      )}
    </div>
  );
}
