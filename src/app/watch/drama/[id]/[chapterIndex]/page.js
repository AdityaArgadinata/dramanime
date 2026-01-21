import Container from "../../../../../components/layout/Container";
import Badge from "../../../../../components/ui/Badge";
import Link from "next/link";
import EpisodeList from "../../../../../components/sections/EpisodeList";

async function getDramaPlayData(dramaId, chapterId) {
  try {
    const res = await fetch(
      `https://dramabos.asia/api/meloshort/api/play/${dramaId}/${chapterId}`,
      {
        headers: { accept: "application/json" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (e) {
    console.error("Failed to fetch play data:", e);
    return null;
  }
}

async function getDramaEpisodes(dramaId) {
  try {
    const res = await fetch(
      `https://dramabos.asia/api/meloshort/api/drama/${dramaId}`,
      {
        headers: { accept: "application/json" },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (e) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id, chapterIndex } = await params;
  const data = await getDramaPlayData(id, chapterIndex);
  if (!data) return { title: "Episode tidak ditemukan" };
  return {
    title: `${data.drama_title} - ${data.chapter_name}`,
    description: data.drama_description?.slice(0, 160) || `${data.drama_title} ${data.chapter_name}`,
  };
}

export default async function WatchPage({ params }) {
  const { id, chapterIndex } = await params;

  // Fetch episodes first to convert chapter_id to chapter_index
  const episodes = await getDramaEpisodes(id);

  if (!episodes || episodes.length === 0) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-semibold">Episode tidak ditemukan</h1>
            <p className="mt-2 text-muted">
              Episode yang Anda cari tidak tersedia
            </p>
            <div className="mt-6">
              <Link href={`/drama/${id}`} className="text-primary hover:underline">
                Kembali ke Drama
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Find episode by chapter_id (chapterIndex param is actually chapter_id from URL)
  const currentEpisode = episodes.find((ep) => ep.chapter_id === chapterIndex);

  if (!currentEpisode) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-semibold">Episode tidak ditemukan</h1>
            <p className="mt-2 text-muted">
              Episode yang Anda cari tidak tersedia
            </p>
            <div className="mt-6">
              <Link href={`/drama/${id}`} className="text-primary hover:underline">
                Kembali ke Drama
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Now fetch play data using the numeric chapter_index
  const playData = await getDramaPlayData(id, currentEpisode.chapter_index);

  if (!playData) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-semibold">Episode tidak ditemukan</h1>
            <p className="mt-2 text-muted">
              Episode yang Anda cari tidak tersedia
            </p>
            <div className="mt-6">
              <Link href={`/drama/${id}`} className="text-primary hover:underline">
                Kembali ke Drama
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Find next and prev episode based on current position
  const currentEpisodeIndex = episodes.findIndex(
    (ep) => ep.chapter_id === chapterIndex
  );
  const prevEpisode =
    currentEpisodeIndex > 0 ? episodes[currentEpisodeIndex - 1] : null;
  const nextEpisode =
    currentEpisodeIndex < episodes.length - 1
      ? episodes[currentEpisodeIndex + 1]
      : null;

  const playUrl = playData.full_play_url || playData.play_url;

  return (
    <Container>
      <div className="py-6">
        {/* Video Player */}
        <div className="ios-surface ios-ring overflow-hidden">
          <div className="w-full bg-black">
            <video
              controls
              autoPlay
              className="w-full aspect-video"
              poster={playData.drama_cover}
              src={playUrl}
            >
              {playData.sublist && playData.sublist.length > 0 && (
                playData.sublist.map((sub) => (
                  <track
                    key={sub.subtitleId}
                    kind="subtitles"
                    src={sub.url}
                    srcLang={sub.language}
                    label={`${sub.language} (${sub.format})`}
                  />
                ))
              )}
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="p-5">
            {/* Prev/Next Episode Buttons */}
            <div className="mb-4 flex gap-3">
              {prevEpisode ? (
                <Link
                  href={`/watch/drama/${id}/${prevEpisode.chapter_id}`}
                  className="flex-1 ios-surface ios-ring px-4 py-2 text-center font-medium text-[var(--primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-full"
                >
                  ← {prevEpisode.chapter_name}
                </Link>
              ) : (
                <div className="flex-1 ios-surface px-4 py-2 text-center font-medium text-muted rounded-full opacity-50 cursor-not-allowed">
                  ← Episode Sebelumnya
                </div>
              )}

              {nextEpisode ? (
                <Link
                  href={`/watch/drama/${id}/${nextEpisode.chapter_id}`}
                  className="flex-1 ios-surface ios-ring px-4 py-2 text-center font-medium text-[var(--primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-full"
                >
                  {nextEpisode.chapter_name} →
                </Link>
              ) : (
                <div className="flex-1 ios-surface px-4 py-2 text-center font-medium text-muted rounded-full opacity-50 cursor-not-allowed">
                  Episode Selanjutnya →
                </div>
              )}
            </div>

            <h1 className="text-2xl font-semibold">{playData.drama_title}</h1>
            <h2 className="mt-2 text-lg text-muted">{playData.chapter_name}</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>
                {playData.chapter_index}/{playData.chapters} Episode
              </Badge>
              {playData.chapter_duration && (
                <Badge>{Math.round(playData.chapter_duration / 60)} menit</Badge>
              )}
              {playData.price === 0 && <Badge>Gratis</Badge>}
              {playData.stats_info && playData.stats_info.length > 0 && (
                <>
                  {playData.stats_info.map((stat) =>
                    stat.type === "play_total" ? (
                      <Badge key={stat.type}>
                        👁️ {(parseInt(stat.value) / 1000).toFixed(1)}K views
                      </Badge>
                    ) : stat.type === "fav_total" ? (
                      <Badge key={stat.type}>
                        ❤️ {(parseInt(stat.value) / 1000).toFixed(1)}K favorit
                      </Badge>
                    ) : null
                  )}
                </>
              )}
            </div>

            {playData.drama_description && (
              <div className="mt-4">
                <h3 className="font-semibold">Sinopsis</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {playData.drama_description}
                </p>
              </div>
            )}

            {playData.drama_tags && playData.drama_tags.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {playData.drama_tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Episodes List with Infinite Scroll */}
        {episodes && episodes.length > 0 && (
          <EpisodeList
            dramaId={id}
            currentChapterId={chapterIndex}
            allEpisodes={episodes}
          />
        )}
      </div>
    </Container>
  );
}
