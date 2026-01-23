import Link from "next/link";

export default function Card({ title, subtitle, cover, slug, type, episode, children, className = "" }) {
  const content = (
    <>
      <div className="relative aspect-3/4 w-full overflow-hidden">
        {cover ? (
          <img 
            src={cover} 
            alt={title} 
            className="h-full w-full object-cover" 
            loading="lazy"
            decoding="async"
          />
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
    const isEpisode = slug.includes("-episode-") || slug.match(/-ep-?\d+/i);
    const isDramaSlug = slug.startsWith("drama/");
    const isDramaId = /^[0-9a-f]{24}$/i.test(slug);
    const isDrama = type === "Drama" || isDramaSlug || isDramaId;

    const normalizedSlug = !isEpisode
      ? slug.replace(/^anime-?/, "")
      : slug;

    const href = isEpisode
      ? `/watch/${slug}`
      : isDrama
        ? `/${isDramaSlug ? normalizedSlug : `drama/${normalizedSlug}`}`
        : `/${normalizedSlug}`;

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
