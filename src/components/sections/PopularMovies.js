"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function MovieSection({ movies }) {
  const [visibleMovies, setVisibleMovies] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initially show first 5 movies for faster render
    setVisibleMovies(movies.slice(0, 5));

    // Lazy load remaining movies
    const timer = setTimeout(() => {
      setVisibleMovies(movies);
    }, 100);

    return () => clearTimeout(timer);
  }, [movies]);

  return (
    <div ref={containerRef}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Film Populer</h2>
        <Link href="/movie" className="text-sm text-primary hover:underline">
          Lihat Semua
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visibleMovies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.detailPath}?id=${movie.subjectId}`}
            className="ios-surface ios-ring group overflow-hidden rounded-lg transition-opacity hover:opacity-80"
          >
            <div className="relative w-full bg-linear-to-br from-zinc-800 to-zinc-900">
              {movie.cover && (
                <img
                  src={movie.cover}
                  alt={movie.title}
                  className="h-auto w-full object-cover aspect-2/3"
                  loading="lazy"
                  decoding="async"
                  width="300"
                  height="450"
                  style={{ backgroundColor: '#27272a' }}
                  fetchPriority="low"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="text-white text-sm font-semibold line-clamp-2">
                  {movie.title}
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-yellow-400 font-semibold">
                ⭐ {movie.rating}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
