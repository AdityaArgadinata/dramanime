import Link from "next/link";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function FeaturedGrid({ items = [], contextPath = "/anime" }) {
  const listPath = contextPath === "/" ? "/anime/list" : `${contextPath}/list`;
  
  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Pilihan Unggulan</h2>
        <Link href={listPath} className="text-sm text-primary hover:underline">
          Lihat Semua
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, idx) => (
          <Card
            key={`${item.slug ?? item.title}-${idx}`}
            title={item.title}
            subtitle={[item.episode, item.status].filter(Boolean).join(" ") || undefined}
            cover={item.img ?? null}
            slug={item.slug}
            type={item.type}
            episode={item.episode}
          />
        ))}
      </div>
    </section>
  );
}
