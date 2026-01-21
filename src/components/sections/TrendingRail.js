import Card from "../ui/Card";

export default function TrendingRail({ items = [] }) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">Sedang Tren</h2>
      <div className="mt-3 -mx-4 overflow-x-auto px-4">
        <div className="flex gap-3">
          {items.map((item, idx) => (
            <div key={`${item.slug ?? item.title}-${idx}`} className="w-40 shrink-0">
              <Card
                title={item.title}
                subtitle={[item.episode, item.status].filter(Boolean).join(" ") || undefined}
                cover={item.img ?? null}
                slug={item.slug}
                episode={item.episode}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
