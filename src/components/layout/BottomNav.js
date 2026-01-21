import Button from "../ui/Button";

export default function BottomNav() {
  const items = [
    { key: "home", label: "Home" },
    { key: "explore", label: "Explore" },
    { key: "library", label: "Library" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 safe-bottom">
      <div className="mx-auto max-w-3xl px-4 pb-2">
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
