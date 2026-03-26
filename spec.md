# First Step Investments

## Current State
A single-page React app for beginner investors with navy/mint color scheme, hero section, trending categories, beginner's hub (markets, portfolio, quick stats), actionable tips, and a footer. The site uses motion/react animations but sparsely. Layout has some mobile responsiveness issues. Investment plan content is minimal. Colors don't follow a structured ratio.

## Requested Changes (Diff)

### Add
- Detailed Investment Plan section with multiple sub-sections: SIP calculator, step-by-step beginner roadmap (5+ steps), investment timeline visualization, common beginner mistakes, India-focused investment vehicles (Mutual Funds, PPF, NPS, ELSS, FD)
- Richer animation: staggered entrance animations, scroll-triggered counters, hover micro-interactions, floating/parallax elements in hero, animated number counters for stats
- "Powered by Claude AI" badge/mention in the footer or a dedicated AI insights section

### Modify
- Color system: Apply 60-30-10 rule — 60% dominant (deep navy oklch(0.17 0.06 232)), 30% secondary (white/light surface oklch(0.97 0.01 175)), 10% accent (mint oklch(0.75 0.13 172)). Reduce mint overuse; it should only appear as accent highlights, CTAs, and key data points.
- Mobile responsiveness: Fix all layout breakpoints — nav, hub tabs (horizontal scroll on mobile), stats grid (2-col on mobile instead of 3), footer columns, hero layout. Ensure touch-friendly tap targets.
- Replace generic white sections with proper navy-to-white contrast blocks following the 60-30-10 palette

### Remove
- Nothing to remove

## Implementation Plan
1. Restructure index.css tokens to enforce 60-30-10 colors
2. Fix all mobile breakpoints: nav, hub tabs, stats grid, footer, hero
3. Build Investment Plan section with roadmap, SIP calculator, India-specific vehicles, common mistakes
4. Add heavy animation: useInView counters, staggered list animations, floating hero elements, hover lift effects
5. Add Claude AI attribution in footer and an "AI-Powered Insights" badge on relevant sections
6. Validate and build
