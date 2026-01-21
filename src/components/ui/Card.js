import Link from "next/link";

export default function Card({ title, subtitle, cover, slug, episode, children, className = "" }) {
  const content = (
    <>
      <div className="relative aspect-3/4 w-full overflow-hidden">
        {cover ? (
          <img src={cover} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700" />
        )}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10" />
      </div>
      <div className="p-3">
        <div className="text-foreground text-sm font-semibold truncate">{title}</div>
        {subtitle && (
          <div className="text-muted text-xs mt-1 truncate">{subtitle}</div>
        )}
        {children}
      </div>
    </>
  );

  const cardClasses = `group overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface)] shadow-sm ios-ring ${className}`;

  if (slug) {
    // Route to watch page only when slug clearly indicates an episode
    const isEpisode = slug.includes('-episode-') || slug.match(/-ep-?\d+/i);

    // For non-episode slugs, strip leading "anime" prefix (e.g., animeseireig -> seireig)
    const normalizedSlug = !isEpisode
      ? slug.replace(/^anime-?/, "")
      : slug;

    const href = isEpisode ? `/watch/${slug}` : `/${normalizedSlug}`;
    
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      {content}
    </div>
  );
}
