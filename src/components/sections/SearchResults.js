import Card from "../../components/ui/Card";

async function searchAnime(query) {
  if (!query) return [];
  try {
    const res = await fetch(
      `https://dramabos.asia/api/tensei/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          accept: "application/json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : [];

    // Deduplicate by slug
    const seen = new Set();
    const unique = data.filter((item) => {
      const key = item.slug || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique;
  } catch (e) {
    return [];
  }
}

export default async function SearchResults({ query }) {
  const results = await searchAnime(query);

  if (!query) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-center">
        <div>
          <p className="text-muted">
            Gunakan kolom pencarian di atas untuk mencari anime atau drama
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-center">
        <div>
          <p className="text-muted">
            Tidak ada hasil untuk &quot;{query}&quot;
          </p>
          <p className="mt-2 text-sm text-muted">Coba kata kunci lain</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {results.map((item, idx) => (
        <Card
          key={`${item.slug}-${idx}`}
          title={item.title}
          cover={item.img ?? null}
          slug={item.slug}
        />
      ))}
    </div>
  );
}
