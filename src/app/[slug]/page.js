import { redirect } from "next/navigation";
import Container from "../../components/layout/Container";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Link from "next/link";

// Helper to extract possible series slugs from episode slug
function generateSeriesSlugs(episodeSlug) {
  const variations = [];
  
  // Remove episode patterns
  let base = episodeSlug
    .replace(/-episode-\d+.*$/i, '')
    .replace(/-ep-?\d+.*$/i, '');
  
  // Try original base with -sub-indo
  if (!base.endsWith('-sub-indo') && !base.endsWith('-sub')) {
    variations.push(`${base}-sub-indo`);
  }
  
  // Try original base with -sub
  variations.push(`${base}-sub`);
  
  // Try without last segment and add -sub-indo
  const parts = base.split('-');
  if (parts.length > 2) {
    const withoutLast = parts.slice(0, -1).join('-');
    variations.push(`${withoutLast}-sub-indo`);
  }
  
  // Try original base as-is
  variations.push(base);
  
  return [...new Set(variations)]; // Remove duplicates
}

async function getAnimeDetail(slug) {
  try {
    const res = await fetch(
      `https://dramabos.asia/api/tensei/detail/${slug}`,
      {
        headers: {
          accept: "application/json",
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getAnimeDetail(slug);
  if (!data) return { title: "Anime tidak ditemukan" };
  return {
    title: data.title,
    description: data.synopsis?.slice(0, 160) || data.altTitle,
  };
}

export default async function DetailPage({ params }) {
  const { slug } = await params;

  // If slug is numeric, it's a movie/series ID—redirect to /movie/[id]
  if (/^\d+$/.test(slug)) {
    redirect(`/movie/${slug}`);
  }
  
  // Try original slug first
  let data = await getAnimeDetail(slug);
  let actualSlug = slug;
  
  // If failed and looks like episode slug, try series variations
  if (!data && (slug.includes('-episode-') || slug.match(/-ep-?\d+/i))) {
    const variations = generateSeriesSlugs(slug);
    
    for (const variant of variations) {
      data = await getAnimeDetail(variant);
      if (data) {
        actualSlug = variant;
        redirect(`/${variant}`);
        break;
      }
    }
  }

  if (!data) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-semibold">Anime tidak ditemukan</h1>
            <p className="mt-2 text-muted">
              Halaman yang Anda cari tidak tersedia
            </p>
            <div className="mt-6">
              <Link href="/">
                <Button>Kembali ke Halaman Utama</Button>
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
              {data.img ? (
                <img
                  src={data.img}
                  alt={data.title}
                  className="h-auto w-full rounded-md object-cover"
                />
              ) : (
                <div className="aspect-3/4 w-full rounded-md bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{data.title}</h1>
              {data.altTitle && (
                <p className="mt-1 text-sm text-muted">
                  {data.altTitle}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {data.rating && <Badge>{data.rating}</Badge>}
                {data.status && <Badge>{data.status}</Badge>}
                {data.type && <Badge>{data.type}</Badge>}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {data.studio && (
                  <div className="flex gap-2">
                    <span className="text-muted">Studio:</span>
                    <span>{data.studio}</span>
                  </div>
                )}
                {data.released && (
                  <div className="flex gap-2">
                    <span className="text-muted">Rilis:</span>
                    <span>{data.released}</span>
                  </div>
                )}
                {data.season && (
                  <div className="flex gap-2">
                    <span className="text-muted">Season:</span>
                    <span>{data.season}</span>
                  </div>
                )}
                {data.duration && (
                  <div className="flex gap-2">
                    <span className="text-muted">Durasi:</span>
                    <span>{data.duration}</span>
                  </div>
                )}
              </div>

              {data.genres && data.genres.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {data.genres.map((genre) => (
                      <Badge key={genre}>{genre}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {data.synopsis && (
            <div className="border-t border-black/5 p-5 dark:border-white/5">
              <h2 className="text-lg font-semibold">Sinopsis</h2>
              <p className="mt-2 leading-relaxed text-muted">
                {data.synopsis}
              </p>
            </div>
          )}
        </div>

        {/* Episodes list */}
        {data.episodes && data.episodes.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Episode</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {data.episodes.map((ep) => (
                <Link
                  key={ep.slug}
                  href={`/watch/${ep.slug}`}
                  className="aspect-square flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-base font-semibold text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {ep.ep}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Metadata footer */}
        {(data.producers || data.posted_by || data.updated_on) && (
          <div className="mt-6 rounded-md bg-surface-muted p-4 text-xs text-muted">
            {data.producers && (
              <div className="mb-2">
                <span className="font-medium">Producers:</span> {data.producers}
              </div>
            )}
            {data.posted_by && (
              <div>Posted by {data.posted_by}</div>
            )}
            {data.updated_on && (
              <div>Last updated: {data.updated_on}</div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
