# Curious Apes — Marketing Website + Admin

Official website for **Curious Apes**, a D2C growth marketing agency based in Jaipur, India.
Cinematic dark-theme design with GSAP scroll animations, Three.js interactive 3D element, and a built-in admin panel for managing enquiries and blog posts.

**Live:** https://curiousapes.in/ | **Admin:** `/admin`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| Animations | GSAP 3.14 + ScrollTrigger |
| Smooth Scroll | `@studio-freight/lenis` (synced with GSAP ticker) |
| 3D | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Fonts | Outfit (display) + Plus Jakarta Sans (body) via Google Fonts |
| Styling | Per-component `.css` files + global CSS variables in `index.css` |
| Data | `src/lib/enquiries.ts` + `src/lib/blogs.ts` — localStorage now, Supabase-ready |

---

## Running Locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

Admin panel: `http://localhost:5173/admin`
Credentials: `admin` / `curiousapes2024`

---

## Project Structure

```
d:\Cogent\Curious_Apes\
├── index.html                        # Entry HTML — Google Fonts link here
├── src/
│   ├── index.css                     # Global CSS variables, reset, button styles
│   ├── App.tsx                       # Root: Lenis + GSAP setup, global #contact intercept, PopupForm
│   ├── main.tsx                      # React 19 createRoot, BrowserRouter, / vs /admin routes
│   ├── vite-env.d.ts                 # Declares *.mp4, *.png module types
│   │
│   ├── lib/
│   │   ├── enquiries.ts              # DATA LAYER — enquiry CRUD (localStorage → Supabase-ready)
│   │   └── blogs.ts                  # DATA LAYER — blog post CRUD + SEO fields (localStorage → Supabase-ready)
│   │
│   ├── assets/
│   │   ├── original_logo.webp        # Primary logo (Navbar, Footer, Admin)
│   │   ├── apes.png                  # Team/brand image — used in About "Who We Are" visual card
│   │   ├── client_logo/              # 33 client logos (PNG) — used in Work.tsx client grid
│   │   ├── number_dont_lie/          # 8 result screenshots — used in Hero "Numbers Don't Lie" strip
│   │   └── work/                     # 21 reels (1.mp4 … 21.mp4) — used in Work.tsx reel slider
│   │
│   ├── components/
│   │   ├── Navbar.tsx / .css         # Fixed top nav, scroll-glass, mobile hamburger
│   │   ├── Hero.tsx / .css           # Full-viewport hero — see Hero section below
│   │   ├── About.tsx / .css          # Two-col layout, 4 pillars
│   │   ├── Services.tsx / .css       # 2×2 service card grid with 3D tilt
│   │   ├── Work.tsx / .css           # Client logos grid + cinematic reel slider + testimonials
│   │   ├── Blog.tsx / .css           # Blog section — reads live from blogs.ts data layer
│   │   ├── BlogPostPage.tsx / .css   # Individual blog post page — route /blog/:slug
│   │   ├── Contact.tsx / .css        # Split form + info panel, saves to enquiries data layer
│   │   ├── Footer.tsx / .css         # 4-col footer, ghost text, CTA block
│   │   ├── PopupForm.tsx / .css      # Global popup form (opened by any href="#contact" click)
│   │   ├── FloatingCTA.tsx / .css    # Fixed bottom-right speed-dial: Call, WhatsApp, Enquiry
│   │   ├── OrbitalSphere.tsx         # Three.js interactive 3D element (hero right side)
│   │   └── Cursor.tsx / .css         # Custom cursor — event-delegated, interacts with all hero elements
│   │
│   └── admin/
│       ├── AdminApp.tsx              # Shell: sidebar nav, view switching (Enquiries / Blog Posts)
│       ├── AdminLogin.tsx            # Login form (session-based)
│       ├── AdminDashboard.tsx        # Enquiry management — exports EnquiryFilters for sidebar
│       ├── BlogManager.tsx           # Blog post list + full editor with SEO panel
│       └── Admin.css                 # All admin styles (dashboard + blog manager)
```

---

## Color System

All colors are CSS custom properties in `src/index.css`. **Never hardcode hex values in components.**

```css
:root {
  /* Backgrounds */
  --bg-primary:    #0a0a0a;
  --bg-secondary:  #111111;
  --bg-tertiary:   #161616;
  --bg-card:       #141414;

  /* Accent — dark teal brand color */
  --accent-sand:       #00393e;
  --accent-sand-dark:  #002a2e;

  /* Gradients */
  --accent-gradient:      linear-gradient(135deg, #00393e 0%, #005a62 40%, #007a85 60%, #00393e 100%);
  --accent-gradient-text: linear-gradient(90deg, #00c4d4 0%, #00f0ff 50%, #00c4d4 100%);
  --accent-gradient-glow: linear-gradient(135deg, rgba(0,57,62,0.22) 0%, rgba(0,196,212,0.08) 100%);

  /* Text */
  --text-primary:   #f0fafa;
  --text-secondary: rgba(220, 245, 245, 0.6);
  --text-muted:     rgba(220, 245, 245, 0.35);

  /* Borders */
  --border-color: rgba(0, 196, 212, 0.1);
  --border-hover: rgba(0, 196, 212, 0.35);

  /* Fonts */
  --font-display: 'Outfit', sans-serif;
  --font-body:    'Plus Jakarta Sans', sans-serif;

  /* Layout */
  --nav-height: 72px;
}
```

### Gradient text pattern (used everywhere on headings)
```css
.element {
  background: var(--accent-gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Component Reference

### Navbar
- Fixed, `z-index: 1000`, height `var(--nav-height)` (72px)
- Logo: `original_logo.webp`, height 52px
- Adds `.navbar--scrolled` on scroll → dark glass backdrop
- Mobile hamburger at `< 900px`, fullscreen overlay menu
- "Get Started" CTA links to `#contact` → triggers popup

### Hero
- Full-viewport, two-column grid (copy | visual)
- **Right side:** `OrbitalSphere` — Three.js torus-knot wireframe + orbit rings (`#00E1F0`) + dot particles
  - `frameloop="demand"` + scroll-pause = zero GPU cost during scroll
  - `pointerEvents: none` on canvas so scroll is never blocked
- Badge → headline → sub → CTAs → stats inline bar
- **"Numbers Don't Lie" strip** — 8 result screenshots from `assets/number_dont_lie/`, auto-scrolling marquee
- Marquee ticker at bottom
- Visual hidden on mobile `< 768px`

### About
- Section ID: `#about`
- Two-col: headline + copy (left), image card with "Est. 2025" (right)
- Right visual card uses `src/assets/apes.png` (imported via Vite asset pipeline)
- Four pillars: Paid Media | Creative & Visuals | Growth Marketing | Tech & CRO

### Services
- Section ID: `#services`
- 2×2 card grid, 3D tilt on `onMouseMove`
- Services: Paid Media, Growth Marketing, Visuals & Creative, Tech & CRO
- CTA links to `#contact` → triggers popup

### Work
- Section ID: `#work`
- **Client grid:** 33 actual client logos from `assets/client_logo/` — grayscale → full color on hover
- **Reel slider:** 21 MP4 reels from `assets/work/`, cinematic 5-slot layout (2 left | center | 2 right)
  - Autoplay — advances on video `ended` event, progress bar tied to `vid.duration`
- **Testimonials:** 3 cards, auto-rotate every 5s

### Blog
- Section ID: `#blog`
- **Reads live from `src/lib/blogs.ts`** — changes made in admin reflect immediately (no page refresh needed)
- Re-fetches on `ca_blogs_updated` custom event (same-tab admin changes) and native `storage` event (cross-tab)
- Featured post renders full-width; up to 4 secondary posts in a 2×2 grid
- Only `published` posts are shown; `draft` posts are hidden from the public site
- If no published posts exist, the section renders `null` (hidden completely)
- **"Read more"** links navigate to `/blog/:slug` (React Router `<Link>`) — does **not** open the popup
- Color-coded tag pills: Meta Ads (teal), Creative Strategy (purple), CRO & Shopify (green), Google Ads (amber), Retention (red), etc.

### BlogPostPage
- **Route:** `/blog/:slug` — registered in `main.tsx` before the `/*` catch-all
- **Live-wired to admin:** `post` is in `useState`, re-fetched on `ca_blogs_updated` (same-tab) and `storage` (cross-tab) events — publishing or editing a post in admin reflects on the open post page instantly
- Shows 404 state if slug doesn't exist or post is not `published`
- Renders a sticky back-nav bar → `/#blog`
- **Content rendering:** lightweight markdown parser (headings, bold/italic, code, lists, blockquotes) — no external dependency
- If `content` is empty, shows a "Full article coming soon" placeholder with a CTA
- **Mounts its own `PopupForm`** and `#contact` click interceptor — "Let's Talk" buttons open the enquiry popup correctly (the `App.tsx` interceptor does not exist on this route)
- Entry animations via GSAP (`fromTo` on hero + content, guarded by ref checks)

### Contact
- Section ID: `#contact`
- Left panel: contact info (email, phones, address, hours, socials) with gradient accent top bar
- Right panel: form (Name, Phone, Website, Message)
- On submit → calls `saveEnquiry({ ...data, source: 'contact_section' })` from `src/lib/enquiries.ts`

### PopupForm
- Mounted in `App.tsx`, hidden by default
- Opens via global click interceptor on **any** `a[href="#contact"]` across the site
- On submit → calls `saveEnquiry({ ...data, source: 'popup' })`
- Escape key + overlay click = close
- Body scroll locked while open

### FloatingCTA
- Fixed bottom-right speed-dial — hidden until user scrolls past 300px, slides in with a `back.out` bounce
- **Toggle button** (56px teal gradient circle) — phone icon at rest, × when open; icons cross-fade + rotate on state change
- **Pulse ring** — repeating `scale + fade` GSAP animation on the toggle button draws attention
- **Three actions** (fan out with staggered `back.out` spring on open):
  1. **Call Us** — teal gradient, `tel:+919982898842`
  2. **WhatsApp** — green gradient, opens `wa.me/919982898842` in new tab
  3. **Enquiry** — gold/sand gradient, calls `onEnquiry` prop → opens `PopupForm` in `App.tsx`
- **Label chips** appear left of each button on desktop; hidden on mobile (≤ 600px)
- **Outside click** auto-closes the menu
- **Wired in `App.tsx`** — receives `onEnquiry={openPopup}` so it shares the same popup state

### Footer
- 4-col grid: Brand | Pages | Services | CTA block
- Ghost decorative text: "CURIOUS APES" (outline, opacity 0.04)
- CTA block links to `#contact` → triggers popup

### Cursor
- Dot (8px solid) + ring (32px outlined) — both `position: fixed`, `pointer-events: none`
- **Event delegation** via `mouseover`/`mouseout` on `document` using `closest()` — correctly detects `a`, `button`, and `[data-cursor]` elements regardless of when they mount (fixes missed interactions on async-rendered components like Hero)
- Interaction states:
  - `--hover` — dot grows, ring expands to 48px + stronger border
  - `--magnetic` — dot switches to white + `mix-blend-mode: difference`, ring gets teal tint background
  - `--click` — both shrink on `mousedown`, restore on `mouseup`
- Hero metric cards carry `data-cursor="hover"` to trigger the hover state
- Hidden via CSS on `≤ 1024px` (touch devices)

### OrbitalSphere
- Three.js scene: torus-knot wireframe (red `#c0380a`) + outer sphere + 2 orbit rings (`#00E1F0`) + dot particles
- **Performance rules:**
  - `frameloop="demand"` — only renders when `invalidate()` is called
  - Scroll listener pauses all `useFrame` animations for 150ms on scroll
  - `antialias: false`, `dpr` capped at 1.5, `pointerEvents: none`

---

## Data Layer — Enquiries

**File:** `src/lib/enquiries.ts`

```ts
saveEnquiry(data)           // Called by Contact.tsx and PopupForm.tsx on submit
getEnquiries()              // Called by AdminDashboard to list all
updateEnquiryStatus(id, s)  // Called by admin drawer status buttons
deleteEnquiry(id)           // Called by admin drawer delete button
```

**Enquiry shape:**
```ts
{
  id: string              // crypto.randomUUID()
  name: string
  phone: string
  website: string
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'closed'
  source: 'contact_section' | 'popup'
  createdAt: string       // ISO 8601
}
```

---

## Data Layer — Blog Posts

**File:** `src/lib/blogs.ts`

```ts
getBlogs()                  // All posts sorted by date desc — used by BlogManager
getPublishedBlogs()         // Published only — used by Blog.tsx (public site)
getBlogBySlug(slug)         // Single post lookup
saveBlog(data)              // Create new post — called by BlogManager
updateBlog(id, data)        // Update existing — called by BlogManager
deleteBlog(id)              // Delete — called by BlogManager
slugify(text)               // "My Title" → "my-title" — used in editor
```

**Blog post shape:**
```ts
{
  id: string              // crypto.randomUUID()
  title: string
  slug: string            // URL-safe, auto-generated from title
  tag: string             // e.g. 'Meta Ads', 'CRO & Shopify'
  excerpt: string         // Shown on Blog section cards
  content: string         // Full article body (markdown)
  seoTitle: string        // <title> tag override
  seoDescription: string  // meta description (120–160 chars)
  seoKeywords: string     // comma-separated focus keywords
  ogImage: string         // Open Graph image URL (1200×630px)
  canonicalUrl: string    // optional canonical href override
  status: 'draft' | 'published'
  featured: boolean       // true = renders as wide top card
  readTime: string        // e.g. '5 min'
  date: string            // ISO date (display date)
  createdAt: string       // ISO 8601 — set on create
  updatedAt: string       // ISO 8601 — set on every save
}
```

**Live sync mechanism:**
- After every write, `blogs.ts` dispatches `window.dispatchEvent(new CustomEvent('ca_blogs_updated'))`
- Both `Blog.tsx` (card grid) and `BlogPostPage.tsx` (post detail) listen to `ca_blogs_updated` (same-tab) and native `storage` (cross-tab) events
- Result: publishing/unpublishing/editing/deleting a post in admin reflects on **both** the blog section and any open post page **instantly** with no page refresh

**Seed data:** 5 default posts are seeded into localStorage on first load (if `ca_blogs` key is absent).

**To connect Supabase later:** replace the functions in `blogs.ts` with Supabase calls. No other file needs to change.

---

## Admin Panel

**URL:** `/admin`
**Credentials:** `admin` / `curiousapes2024` *(change before production)*
**Auth:** `sessionStorage` key `ca_admin` — clears on tab close

### Architecture

`AdminApp.tsx` owns the full layout (sidebar + main). It manages:
- View state: `'enquiries'` | `'blog'`
- Enquiry filter state (passed to both `EnquiryFilters` in sidebar and `AdminDashboard` in main)
- Enquiries in React state (not read directly from localStorage) so sidebar counts stay live

### Enquiries view
- Sidebar filter: All / New / Contacted / Qualified / Closed (with live counts)
- Stats row: Total, New, Contacted, Qualified
- Search by name, phone, or website
- Table: new enquiries pulse with teal dot, click row to open detail drawer
- Detail drawer: full contact info, one-click Call + WhatsApp, status updater, delete with confirm

### Blog Posts view
- Stats: Total, Published (live on site), Drafts, Featured
- Filter tabs: All / Published / Draft
- Search by title, tag, or slug
- Table rows: title + slug, tag pill, status toggle button, edit + delete icons
- **Editor panel** (right-side overlay):
  - **Content tab:** Status, Tag, Title, Slug (auto-generated + manual override + regenerate button), Excerpt, Full content, Date, Read Time, Featured toggle
  - **SEO & Meta tab:**
    - Live SEO score (0–100) shown as pill in header and progress bar in tab
    - Issues list — flags missing/too-short/too-long fields
    - SEO Title with character bar (green 30–60, amber <30, red >60)
    - Meta Description with character bar (green 120–160)
    - Focus Keywords
    - OG Image URL
    - Canonical URL
    - **Google SERP preview** — live preview of how the post appears in search results
  - Save as Draft / Publish Post buttons

### Changing Admin Password
Edit `src/admin/AdminLogin.tsx`:
```ts
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'curiousapes2024'   // ← change this
```

---

## Routing

```
/blog/:slug   → Individual blog post page (BlogPostPage.tsx)
/admin/*      → Admin panel (AdminApp.tsx)
/*            → Main website (App.tsx) — catch-all, must be last
```

React Router v7 BrowserRouter in `main.tsx`. `/blog/:slug` and `/admin/*` are declared before `/*` so they take priority. The `/*` catch-all ensures GSAP anchor links (`#contact`, `#work`, etc.) still work on the main site.

---

## Key Patterns

### GSAP ScrollTrigger (per section)
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.fromTo(ref.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' } }
    )
  }, sectionRef)
  return () => ctx.revert()
}, [])
```

> **If a section's content loads asynchronously** (e.g. Blog reads from localStorage), guard refs before animating and use the data as the dependency — otherwise the effect runs before the DOM renders and crashes on null refs:
> ```tsx
> useEffect(() => {
>   if (posts.length === 0 || !sectionRef.current || !headRef.current) return
>   const ctx = gsap.context(() => { /* animations */ }, sectionRef)
>   return () => ctx.revert()
> }, [posts])   // ← re-run after data loads, NOT []
> ```

### Lenis + GSAP sync (App.tsx)
```tsx
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

### Global CTA interceptor (App.tsx)
```tsx
// Any <a href="#contact"> anywhere on the page opens the popup
document.addEventListener('click', (e) => {
  if ((e.target as Element).closest('a[href="#contact"]')) {
    e.preventDefault()
    openPopup()
  }
})
```

### Admin ↔ Website live sync (blogs.ts)
```ts
// After every localStorage write:
window.dispatchEvent(new CustomEvent('ca_blogs_updated'))

// In Blog.tsx AND BlogPostPage.tsx — same pattern:
window.addEventListener('ca_blogs_updated', refresh)  // same-tab changes
window.addEventListener('storage', refresh)            // cross-tab changes
```

Both the blog card grid and the individual post page subscribe independently, so publishing from admin updates both surfaces simultaneously.

### CSS custom prop via inline style
```tsx
style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
```

---

## Important Notes

- `Team.tsx` / `Team.css` exist on disk but are **not imported** anywhere — kept for reference
- Do **not** add `smoothTouch` to Lenis — invalid option in v1, causes TS errors
- Do **not** remove `pointerEvents: none` from OrbitalSphere canvas — it blocks scroll
- Do **not** re-add the headline parallax scrub to Hero — it caused scroll jank
- Always use CSS variables for colors, not hardcoded hex
- Some CSS files still have hardcoded `rgba(0,196,212,...)` teal — grep if doing a full rebrand
- `@supabase/supabase-js` is installed but not yet used — wired when backend is ready
- `vite-env.d.ts` declares `*.mp4` and image module types — required for asset imports in TSX
- Blog section renders `null` if there are zero published posts (section disappears entirely)
- The 5 default blog posts are seeded into `localStorage` only once (on first visit when `ca_blogs` key is absent); editing them in admin persists immediately
- `blogs.ts` `load()` backfills any missing fields when parsing stored data — safe against schema changes between versions
- `Blog.tsx` GSAP effect guards `posts.length === 0` and all refs before animating — prevents crash on initial mount before data loads (dependency: `[posts]`, not `[]`)
- `BlogPostPage` mounts its own `PopupForm` and `#contact` interceptor — it renders outside `App.tsx` so it cannot share the one in `App`
- `/blog/:slug` route must be declared **before** `/*` in `main.tsx` — otherwise React Router matches the catch-all first and renders the main site instead of the post page
- `AdminLogin.tsx` Sign In button uses `.adm-btn adm-btn--primary` — matching the class names defined in `Admin.css` (not `.admin-btn`, which has no styles)
- `FloatingCTA` is rendered in `App.tsx` only — it does **not** appear on `/blog/:slug` or `/admin` routes (those render outside `App`)

---

## Contact Info (hardcoded in components)

| Field | Value |
|---|---|
| Email | info@curiousapes.in |
| Phone 1 | +91 99828 98842 |
| Phone 2 | +91 77372 29230 |
| Address | A-46-A, Vande Mataram Marg, Mansarovar, Jaipur 302020 |
| Hours | Mon – Sat: 9:00 AM – 7:00 PM |
| Instagram | instagram.com/curiousapes.in |
| LinkedIn | linkedin.com/company/curiousapes |
