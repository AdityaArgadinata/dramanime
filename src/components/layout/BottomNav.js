import Button from "../ui/Button";

export default function BottomNav() {
  const items = [
    { key: "home", label: "Home" },
    { key: "explore", label: "Explore" },
    { key: "library", label: "Library" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 safe-bottom bg-background/95 backdrop-blur-md border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-3xl px-4 pb-2 pt-2">
        <div className="ios-surface ios-ring flex items-center justify-between px-2 py-2">
          {items.map((it) => (
            <Button key={it.key} variant="ghost" size="md" className="flex-1">
              {it.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
