import { Suspense } from "react";
import Hero from "../../components/sections/Hero";
import FeaturedGrid from "../../components/sections/FeaturedGrid";
import TrendingRail from "../../components/sections/TrendingRail";
import Categories from "../../components/sections/Categories";
import { FeaturedSkeleton, TrendingSkeleton } from "../../components/sections/HomeSkeleton";

async function getDramaData() {
  try {
    const res = await fetch("https://dramabos.asia/api/meloshort/api/home?page=1&page_size=20", {
      headers: {
        accept: "application/json",
      },
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : [];
    
    // Normalize drama data to match anime structure and deduplicate
    const seen = new Set();
    const normalized = [];
    
    for (const item of data) {
      const id = item?.drama_id || item?.id;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      
      normalized.push({
        slug: id,
        title: item?.drama_title || item?.name || "Drama",
        img: item?.drama_cover || item?.cover,
        type: "Drama",
        status: item?.chapters ? `${item.chapters} Episode` : "Series",
      });
    }
    
    return normalized;
  } catch (e) {
    return [];
  }
}

async function DramaContent() {
  const items = await getDramaData();
  const featured = items.slice(0, 6);
  const trending = items.slice(6, 18);

  return (
    <>
      <FeaturedGrid items={featured} contextPath="/drama" />
      <TrendingRail items={trending} contextPath="/drama" />
    </>
  );
}

export const metadata = {
  title: "Drama - Dramanime",
  description: "Jelajahi koleksi lengkap drama dengan subtitle Indonesia",
};

export default function DramaPage() {
  return (
    <div className="py-4">
      <Hero />
      <Suspense fallback={
        <>
          <FeaturedSkeleton />
          <TrendingSkeleton />
        </>
      }>
        <DramaContent />
      </Suspense>
      <Categories />
    </div>
  );
}
