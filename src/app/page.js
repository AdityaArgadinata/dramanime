import { Suspense } from "react";
import Hero from "../components/sections/Hero";
import HomeContent from "../components/sections/HomeContent";
import Categories from "../components/sections/Categories";
import { FeaturedSkeleton, TrendingSkeleton } from "../components/sections/HomeSkeleton";

export default function Home() {
  return (
    <div className="py-4">
      <Hero />
      <Suspense fallback={
        <>
          <FeaturedSkeleton />
          <TrendingSkeleton />
        </>
      }>
        <HomeContent />
      </Suspense>
      <Categories />
    </div>
  );
}
