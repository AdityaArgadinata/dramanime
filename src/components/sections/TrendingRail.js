import Link from "next/link";
import Card from "../ui/Card";

export default function TrendingRail({ items = [], contextPath = "/anime" }) {
  const listPath = contextPath === "/" ? "/anime/list" : `${contextPath}/list`;
  
  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Sedang Tren</h2>
        <Link href={listPath} className="text-sm text-primary hover:underline">
          Lihat Semua
        </Link>
      </div>
      <div className="mt-3 -mx-4 overflow-x-auto px-4">
        <div className="flex gap-3">
          {items.map((item, idx) => (
            <div key={`${item.slug ?? item.title}-${idx}`} className="w-40 shrink-0">
              <Card
                title={item.title}
                subtitle={[item.episode, item.status].filter(Boolean).join(" ") || undefined}
                cover={item.img ?? null}
                slug={item.slug}
                type={item.type}
                episode={item.episode}
                contextPath={contextPath}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
