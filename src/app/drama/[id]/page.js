import Container from "../../../components/layout/Container";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Link from "next/link";

async function getDramaInfo(id) {
  try {
    // Fetch from home API with pagination to find drama metadata
    let allDramas = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(
        `https://dramabos.asia/api/meloshort/api/home?page=${page}&page_size=100`,
        {
          headers: { accept: "application/json" },
          next: { revalidate: 300 },
        }
      );
      if (!res.ok) break;
      const json = await res.json();
      const dramas = json?.data || [];
      
      if (dramas.length === 0) {
        hasMore = false;
      } else {
        allDramas = allDramas.concat(dramas);
        page++;
      }
    }

    // Find drama by ID
    const drama = allDramas.find((d) => d.drama_id === id);

    if (!drama) return null;

    return {
      id: drama.drama_id,
      title: drama.drama_title,
      cover: drama.drama_cover,
      description: drama.description || "",
      chapters: drama.chapters || 0,
      tags: drama.tags || [],
      fav_count: drama.fav_count || 0,
      is_completed: drama.is_completed,
    };
  } catch (e) {
    console.error("Failed to fetch drama info:", e);
    return null;
  }
}

async function getDramaEpisodes(id) {
  try {
    const res = await fetch(
      `https://dramabos.asia/api/meloshort/api/drama/${id}`,
      {
        headers: { accept: "application/json" },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (e) {
    console.error("Failed to fetch drama episodes:", e);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const info = await getDramaInfo(id);
  if (!info) return { title: "Drama tidak ditemukan" };
  return {
    title: info.title,
    description: info.description?.slice(0, 160) || `Drama ${info.title}`,
  };
}

export default async function DramaDetailPage({ params }) {
  const { id } = await params;

  const [info, episodes] = await Promise.all([
    getDramaInfo(id),
    getDramaEpisodes(id),
  ]);

  if (!info) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-semibold">Drama tidak ditemukan</h1>
            <p className="mt-2 text-muted">
              Halaman yang Anda cari tidak tersedia
            </p>
            <div className="mt-6">
              <Link href="/drama/list">
                <Button>Kembali ke Drama</Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        {/* Header with cover and info */}
        <div className="ios-surface ios-ring overflow-hidden">
          <div className="flex flex-col gap-4 p-5 sm:flex-row">
            <div className="w-full shrink-0 sm:w-48">
              {info.cover ? (
                <img
                  src={info.cover}
                  alt={info.title}
                  className="h-auto w-full rounded-md object-cover"
                />
              ) : (
                <div className="aspect-3/4 w-full rounded-md bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{info.title}</h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>Drama</Badge>
                {info.chapters > 0 && <Badge>{info.chapters} Episode</Badge>}
                {info.is_completed && <Badge>Tamat</Badge>}
                {info.fav_count > 0 && (
                  <Badge>❤️ {(info.fav_count / 1000).toFixed(1)}K</Badge>
                )}
              </div>

              {info.tags && info.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {info.tags.slice(0, 8).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {info.description && (
            <div className="border-t border-black/5 p-5 dark:border-white/5">
              <h2 className="text-lg font-semibold">Sinopsis</h2>
              <p className="mt-2 leading-relaxed text-muted">
                {info.description}
              </p>
            </div>
          )}
        </div>

        {/* Episodes list */}
        {episodes && episodes.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Episode ({episodes.length})</h2>
            <div className="space-y-2">
              {episodes.map((ep) => (
                <Link
                  key={ep.chapter_id}
                  href={`/watch/drama/${id}/${ep.chapter_id}`}
                  className="ios-surface ios-ring flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{ep.chapter_name}</div>
                    <div className="mt-1 text-sm text-muted">
                      {ep.is_free ? "Gratis" : `${ep.chapter_price} Koin`}
                    </div>
                  </div>
                  {ep.first_frame && (
                    <div className="ml-4 w-24 shrink-0 overflow-hidden rounded">
                      <img
                        src={ep.first_frame}
                        alt={ep.chapter_name}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {episodes.length === 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted">Episode belum tersedia</p>
          </div>
        )}
      </div>
    </Container>
  );
}
