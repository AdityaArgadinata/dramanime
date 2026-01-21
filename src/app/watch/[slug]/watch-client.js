"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import Tabs from "../../../components/ui/Tabs";
import Skeleton from "../../../components/ui/Skeleton";

export default function WatchClient({ data, slug }) {
  const [activeServer, setActiveServer] = useState(0);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState(true);

  useEffect(() => {
    async function fetchDownloads() {
      try {
        const res = await fetch(`https://dramabos.asia/api/tensei/stream/${slug}`);
        if (res.ok) {
          const json = await res.json();
          setDownloadLinks(json?.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch downloads:", e);
      } finally {
        setLoadingDownloads(false);
      }
    }

    fetchDownloads();
  }, [slug]);

  const servers = data.servers || [];
  const currentEmbed = servers[activeServer]?.embed;

  return (
    <Container>
      <div className="py-6">
        {/* Title and breadcrumb */}
        <div className="mb-4">
          {data.animeSlug && (
            <Link
              href={`/${data.animeSlug}`}
              className="text-sm text-primary hover:underline"
            >
              ← Kembali ke Detail Anime
            </Link>
          )}
          <h1 className="mt-2 text-xl font-semibold">{data.title}</h1>
        </div>

        {/* Player */}
        <div className="ios-surface ios-ring overflow-hidden">
          {currentEmbed ? (
            <iframe
              src={currentEmbed}
              className="aspect-video w-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="aspect-video w-full bg-zinc-900 flex items-center justify-center">
              <p className="text-white">Player tidak tersedia</p>
            </div>
          )}
        </div>

        {/* Episode navigation below player */}
        {(data.prev || data.next) && (
          <div className="mt-3 mb-10 flex flex-wrap justify-between items-center gap-2">
            {data.prev && (
              <Link href={`/watch/${data.prev}`}>
                <Button variant="outline" className="border border-gray-600">← Episode Sebelumnya</Button>
              </Link>
            )}
            {data.next && (
              <Link href={`/watch/${data.next}`} className="sm:ml-auto">
                <Button>Episode Selanjutnya →</Button>
              </Link>
            )}
          </div>
        )}

        {/* Server selector */}
        {servers.length > 0 && (
          <div className="mt-4">
            <h2 className="mb-2 text-sm font-semibold">Pilih Server</h2>
            <Tabs
              tabs={servers.map((s, idx) => ({ label: s.name, value: idx }))}
              initial={activeServer}
              onChange={setActiveServer}
            />
          </div>
        )}

        {/* Download links */}
        <div className="mt-6 ios-surface ios-ring p-4">
          <h2 className="mb-3 text-sm font-semibold">Download Episode</h2>
          {loadingDownloads ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : downloadLinks.length > 0 ? (
            <div className="space-y-2">
              {downloadLinks.map((dl, idx) => (
                <a
                  key={idx}
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center justify-between rounded-md bg-surface-muted px-4 py-3 text-sm transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <span className="font-medium">{dl.quality}</span>
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Belum ada link download tersedia</p>
          )}
        </div>

      </div>
    </Container>
  );
}
