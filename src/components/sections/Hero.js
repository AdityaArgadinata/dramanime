import Button from "../ui/Button";
import Tabs from "../ui/Tabs";

export default function Hero() {
  return (
    <section className="mt-4">
      <div className="ios-surface ios-ring overflow-hidden">
        <div className="p-5">
          <h1 className="text-2xl font-semibold tracking-tight">Tonton drama & anime favoritmu</h1>
          <p className="mt-2 text-muted">Streaming tanpa batas dengan subtitle Indonesia. Kualitas HD, update cepat, gratis selamanya.</p>

          <div className="mt-4">
            <Tabs
              tabs={[
                { label: "Semua", value: "all" },
                { label: "Drama", value: "drama" },
                { label: "Anime", value: "anime" },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
