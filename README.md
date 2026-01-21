# Streaming Project UI Scaffold

A clean iOS-style Next.js layout and component scaffold (inspired by shadcn/ui patterns) for drama & anime streaming. API integration can be added later.

## Structure

- `src/components/ui`
	- `Button.js`: Primary/outline/ghost button variants
	- `Input.js`: Search and form input
	- `Card.js`: Media card with cover/title/meta
	- `Tabs.js`: Segmented control style tabs
	- `Badge.js`: Pill labels
	- `Skeleton.js`: Loading placeholder
- `src/components/layout`
	- `Header.js`: Sticky top bar with search
	- `BottomNav.js`: Fixed tab bar (mobile-first)
	- `Container.js`: Centered max-width wrapper
- `src/components/sections`
	- `Hero.js`: Intro block with CTA and tabs
	- `FeaturedGrid.js`: Grid of featured items
	- `TrendingRail.js`: Horizontal scroll list
	- `Categories.js`: Category badges
- `src/lib/placeholder.js`: Sample data until API arrives

## Styling

- Tailwind v4 via `@tailwindcss/postcss`.
- iOS tokens and helpers in `src/app/globals.css` (`--primary`, radii, shadows).
- System font stack using `-apple-system` for Apple-like typographic feel.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the scaffold.

## Next Steps

- Replace `src/lib/placeholder.js` with your API responses.
- Add pages for detail and player; wire routing.
- Introduce server actions or client fetching based on your API.
