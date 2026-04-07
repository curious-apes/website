# Curious Apes — Marketing Website + Admin

Official website for **Curious Apes**, a D2C growth marketing agency based in Jaipur, India.
Cinematic dark/light theme design with GSAP scroll animations, Three.js interactive 3D element, and a built-in admin panel for managing enquiries and blog posts.

**Live:** https://www.curiousapes.in | **Admin:** `/admin`

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
src/
├── index.css                     # Global CSS variables, reset, button styles
├── App.tsx                       # Root: Lenis + GSAP setup, global #contact intercept, PopupForm
├── main.tsx                      # React 19 createRoot, BrowserRouter, / vs /admin routes
├── vite-env.d.ts                 # Declares *.mp4, *.png module types
│
├── lib/
│   ├── enquiries.ts              # DATA LAYER — enquiry CRUD (localStorage → Supabase-ready)
│   └── blogs.ts                  # DATA LAYER — blog post CRUD + SEO fields (localStorage → Supabase-ready)
│
├── assets/
│   ├── logo.png                  # Navbar logo — imported via Vite asset pipeline
│   ├── original_logo.webp        # Legacy logo (Footer, Admin)
│   ├── apes.png                  # Brand image — used in About "Who We Are" visual card
│   ├── client_logo/              # 35 client logos (PNG) — used in Clients.tsx
│   ├── number_dont_lie/          # 8 result screenshots — used in Hero "Numbers Don't Lie" strip
│   ├── performace-1.jpeg         # Paid Media page section image 1 (campaign optimisation)
│   ├── performace-2.jpeg         # Paid Media page section image 2 (ad structure)
│   ├── performace-3.jpeg         # Paid Media page section image 3 (high-converting products)
│   └── work/                     # 21 reels (1.mp4 … 21.mp4) — used in Work.tsx reel slider
│
├── components/
│   ├── Navbar.tsx / .css         # Fixed top nav, scroll-glass, mobile hamburger, Services dropdown
│   ├── Hero.tsx / .css           # Full-viewport hero — see Hero section below
│   ├── About.tsx / .css          # Two-col layout, 4 pillars — hidden from homepage (reserved for /about page)
│   ├── Clients.tsx / .css        # Client logo grid (35 brands) — standalone section
│   ├── Services.tsx / .css       # 2×2 service card grid with 3D tilt; Paid Media card links to /services/paid-media
│   ├── Work.tsx / .css           # Cinematic reel slider only (21 reels)
│   ├── Testimonials.tsx / .css   # 3 testimonial cards, auto-rotate every 5s
│   ├── Blog.tsx / .css           # Blog section — reads live from blogs.ts data layer
│   ├── BlogPostPage.tsx / .css   # Individual blog post page — route /blog/:slug
│   ├── Contact.tsx / .css        # Split form + info panel, saves to enquiries data layer
│   ├── Footer.tsx / .css         # 4-col footer (Brand | Nav | Services | CTA), ghost text
│   ├── PopupForm.tsx / .css      # Global popup form (opened by any href="#contact" click)
│   ├── FloatingCTA.tsx / .css    # Fixed bottom-right speed-dial: Call, WhatsApp, Enquiry
│   ├── ScrollToTop.tsx / .css    # Fixed bottom-left circle — scroll-to-top on click, all pages
│   ├── ThemeToggle.tsx / .css    # Fixed bottom-left glowing pill (above ScrollToTop) — dark/light switcher
│   ├── PaidMediaPage.tsx / .css  # Dedicated Paid Media service page — route /services/paid-media
│   ├── AboutPage.tsx / .css      # Dedicated About page — route /about
│   ├── BlogPage.tsx / .css       # Dedicated Blog listing page — route /blog
│   ├── ContactPage.tsx / .css    # Dedicated Contact page — route /contact
│   ├── OrbitalSphere.tsx         # Three.js interactive 3D element (hero right side)
│   └── Cursor.tsx / .css         # Custom cursor — event-delegated, interacts with all hero elements
│
└── admin/
    ├── AdminApp.tsx              # Shell: sidebar nav, view switching (Enquiries / Blog Posts)
    ├── AdminLogin.tsx            # Login form (session-based)
    ├── AdminDashboard.tsx        # Enquiry management — exports EnquiryFilters for sidebar
    ├── BlogManager.tsx           # Blog post list + full editor with SEO panel
    └── Admin.css                 # All admin styles (dashboard + blog manager)
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

  /* Accent — bright teal brand color */
  --accent-sand:       #00c4d4;
  --accent-sand-dark:  #008f9e;

  /* Gradients */
  --accent-gradient:      linear-gradient(135deg, #00393e 0%, #005a62 40%, #007a85 60%, #00393e 100%);
  --accent-gradient-text: linear-gradient(90deg, #00c4d4 0%, #00f0ff 50%, #00c4d4 100%);
  --accent-gradient-glow: linear-gradient(135deg, rgba(0,57,62,0.22) 0%, rgba(0,196,212,0.08) 100%);

  /* Text */
  --text-primary:   #f0fafa;
  --text-secondary: rgba(220, 245, 245, 0.82);
  --text-muted:     rgba(220, 245, 245, 0.6);

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

> **Note:** `--accent-sand` is used as a **text color** across many components (badges, tags, hover states). Keep it a bright, visible teal — do not set it to a dark value or text will become invisible on dark backgrounds.

### Light theme

Applied via `[data-theme="light"]` on `<html>`. Overrides all background, text, border, and shadow variables. Set/removed by the theme toggle in `Navbar.tsx`, persisted in `localStorage`.

```css
[data-theme="light"] {
  --bg-primary:    #ffffff;
  --bg-secondary:  #f5f5f5;
  --bg-tertiary:   #eeeeee;
  --bg-card:       #f0f0f0;
  --text-primary:  #0a0a0a;
  --text-secondary: rgba(20, 20, 20, 0.75);
  --text-muted:    rgba(20, 20, 20, 0.55);
}
```

Logo gets `filter: invert(1)` in light mode so the white PNG renders correctly on a white background.

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
- Logo: `logo.png` — imported via `import logoImg from '../assets/logo.png'` (Vite asset pipeline, not a raw `/src/` path)
- Adds `.navbar--scrolled` on scroll → glass backdrop
- Mobile hamburger at `< 900px`, fullscreen overlay menu
- "Let's Talk" CTA links to `#contact` → triggers popup

### ThemeToggle
- **Fixed bottom-left pill** (`z-index: 9000`), always visible on every page
- Sun icon + "Light" label in dark mode; moon icon + "Dark" label in light mode
- **Teal glow** (`box-shadow`) that intensifies on hover; **pulse ring** radiates outward via GSAP every ~4s
- **Bounce animation** on click via GSAP `back.out`
- In light mode pill flips to dark background + teal icon so it stays prominent
- On mobile (`≤ 480px`) the text label hides, leaving just the icon
- Theme preference persisted in `localStorage` as `ca_theme`; applied via `data-theme` attribute on `<html>`
- Mounted in `App.tsx` — appears on the main site only (not on `/admin`)

### Hero
- Full-viewport, two-column grid (copy | visual)
- **Right side:** `OrbitalSphere` — Three.js torus-knot wireframe + orbit rings (`#00E1F0`) + dot particles
  - `frameloop="demand"` + scroll-pause = zero GPU cost during scroll
  - `pointerEvents: none` on canvas so scroll is never blocked
- Badge → headline → sub → stats inline bar → CTAs
- On mobile (`≤ 480px`) stats box appears **above** CTAs (CSS `order` on flex children)
- **"Numbers Don't Lie" strip** — 8 result screenshots from `assets/number_dont_lie/`, auto-scrolling track
- Visual hidden on mobile `< 768px`
- Marquee ticker removed

### About *(hidden from homepage)*
- Section ID: `#about`
- Currently commented out in `App.tsx` — reserved for a dedicated `/about` page
- Two-col: headline + copy (left), image card with "Est. 2025" (right)
- Right visual card uses `src/assets/apes.png` (imported via Vite asset pipeline)
- Four pillars: Paid Media | Creative & Visuals | Growth Marketing | Tech & CRO

### Clients
- Section ID: `#clients`
- **35 client logos** from `assets/client_logo/` — grayscale → full color on hover
- 5-col grid (4-col at 1100px, 3-col at 768px, 3-col at 480px)
- Latest additions: Alvino, Clazeup
- Staggered scroll-entrance animation via GSAP ScrollTrigger

### Services
- Section ID: `#services`
- 2×2 card grid, 3D tilt on `onMouseMove`
- Services: Paid Media, Growth Marketing, Visuals & Creative, Tech & CRO
- **Paid Media card** links to `/services/paid-media` dedicated page
- CTA links to `#contact` → triggers popup

### Work
- Section ID: `#work`
- **Reel slider only** — 21 MP4 reels from `assets/work/`, cinematic 5-slot layout (2 left | center | 2 right)
  - Autoplay — advances on video `ended` event, progress bar tied to `vid.duration`
- Client logos and testimonials extracted to their own sections (`Clients`, `Testimonials`)
- Marquee ticker removed

### Testimonials
- Section ID: `#testimonials`
- 3 testimonial cards — auto-rotate every 5s, active card lifts + glows with teal border
- Manual dot navigation below cards
- Background: `var(--bg-secondary)` for visual separation from Work section

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
- **Wired in all pages** — receives `onEnquiry={openPopup}` so it shares the same popup state

### ScrollToTop
- Fixed bottom-left circle button — hidden until user scrolls past 400px, fades + slides in
- Teal border + icon at rest; fills solid teal on hover with glow
- Smooth-scrolls to top on click via `window.scrollTo({ top: 0, behavior: 'smooth' })`
- Mounted on every page: `App.tsx`, `AboutPage`, `BlogPage`, `BlogPostPage`, `ContactPage`, `PaidMediaPage`
- In light mode: white pill with darker teal icon

### ThemeToggle
- **Fixed bottom-left pill** (`z-index: 9000`), positioned at `bottom: 90px` to sit above `ScrollToTop`
- Sun icon + "Light" label in dark mode; moon icon + "Dark" label in light mode
- **Teal glow** (`box-shadow`) that intensifies on hover; **pulse ring** radiates outward via GSAP every ~4s
- **Bounce animation** on click via GSAP `back.out`
- In light mode pill flips to dark background + teal icon so it stays prominent
- On mobile (`≤ 480px`) the text label hides, leaving just the icon; positioned at `bottom: 76px`
- Theme preference persisted in `localStorage` as `ca_theme`; applied via `data-theme` attribute on `<html>`
- Mounted in `App.tsx` — appears on the main site only (not on `/admin`)

### Footer
- 4-col grid: Brand | Navigation | Services | CTA block
- **Services column** lists all 4 services; Paid Media links to `/services/paid-media`
- Ghost decorative text: "CURIOUS APES" (outline, opacity 0.04)
- CTA block links to `#contact` → triggers popup

### Cursor
- Dot (8px solid) + ring (32px outlined) — both `position: fixed`, `pointer-events: none`
- **Event delegation** via `mouseover`/`mouseout` on `document` using `closest()` — correctly detects `a`, `button`, and `[data-cursor]` elements regardless of when they mount
- Interaction states: `--hover`, `--magnetic`, `--click`
- Hidden via CSS on `≤ 1024px` (touch devices)

### OrbitalSphere
- Three.js scene: torus-knot wireframe + outer sphere + 2 orbit rings (`#00E1F0`) + dot particles
- `frameloop="demand"`, scroll listener pauses animations for 150ms, `antialias: false`, `dpr` capped at 1.5

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
  id: string
  title: string
  slug: string            // URL-safe, auto-generated from title
  tag: string
  excerpt: string
  content: string         // Full article body (markdown)
  seoTitle: string
  seoDescription: string  // 120–160 chars
  seoKeywords: string
  ogImage: string         // 1200×630px
  canonicalUrl: string
  status: 'draft' | 'published'
  featured: boolean
  readTime: string
  date: string
  createdAt: string
  updatedAt: string
}
```

---

## Admin Panel

**URL:** `/admin`
**Credentials:** `admin` / `curiousapes2024` *(change before production)*
**Auth:** `sessionStorage` key `ca_admin` — clears on tab close

### Enquiries view
- Filter: All / New / Contacted / Qualified / Closed (with live counts)
- Search by name, phone, or website
- Detail drawer: full info, Call + WhatsApp, status updater, delete with confirm

### Blog Posts view
- Filter tabs: All / Published / Draft, search by title/tag/slug
- **Editor:** Content tab (status, tag, title, slug, excerpt, body, date, read time, featured) + SEO & Meta tab (live score 0–100, SERP preview, OG image, canonical URL)

### Changing Admin Password
Edit `src/admin/AdminLogin.tsx`:
```ts
const ADMIN_PASS = 'curiousapes2024'   // ← change this
```

---

## Homepage Section Order

```
Hero          ← Data-Driven eCommerce Agency + Numbers Don't Lie strip
Clients       ← 35 brand logos grid
Services      ← Core capabilities (4 cards)
Work          ← Cinematic reel slider (21 reels)
Testimonials  ← 3 client testimonials
Blog          ← Published blog posts
Contact       ← Enquiry form
```

> `About` is commented out in `App.tsx` — will be added to a dedicated `/about` page.

---

## Routing

```
/about                  → AboutPage.tsx
/blog                   → BlogPage.tsx
/blog/:slug             → BlogPostPage.tsx
/contact                → ContactPage.tsx
/services/paid-media    → PaidMediaPage.tsx
/admin/*                → AdminApp.tsx
/*                      → App.tsx (catch-all — must be last)
```

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

> If a section's content loads asynchronously, guard all refs and use the data as the dependency:
> ```tsx
> useEffect(() => {
>   if (posts.length === 0 || !sectionRef.current) return
>   const ctx = gsap.context(() => { /* animations */ }, sectionRef)
>   return () => ctx.revert()
> }, [posts])
> ```

### Asset imports — always use Vite pipeline
```tsx
// CORRECT — works in production builds
import logoImg from '../assets/logo.png'
<img src={logoImg} />

// WRONG — breaks on Vercel / any non-dev server
<img src="/src/assets/logo.png" />
```

### Admin ↔ Website live sync
```ts
// After every localStorage write in blogs.ts:
window.dispatchEvent(new CustomEvent('ca_blogs_updated'))

// In Blog.tsx and BlogPostPage.tsx:
window.addEventListener('ca_blogs_updated', refresh)  // same-tab
window.addEventListener('storage', refresh)            // cross-tab
```

---

## Important Notes

- Always use CSS variables for colors — never hardcode hex values in components
- `--accent-sand` must stay a bright visible teal (`#00c4d4`) — it is used as **text color** in many components; a dark value makes text invisible on dark backgrounds
- `.btn-primary` background is `#00c4d4` with **white text** — do not add `color: #0a0a0a` overrides in component CSS as it breaks readability on dark backgrounds
- All image/asset imports must go through Vite (`import x from '../assets/...'`) — raw `/src/assets/` paths do not work in production
- `Team.tsx` / `Team.css` exist on disk but are **not imported** anywhere — kept for reference
- Do **not** add `smoothTouch` to Lenis — invalid option in v1
- Do **not** remove `pointerEvents: none` from OrbitalSphere canvas — it blocks scroll
- `@supabase/supabase-js` is installed but not yet used — wired when backend is ready
- Blog section renders `null` if there are zero published posts
- All service page routes (`/services/*`) must be declared **before** `/*` in `main.tsx`
- `ScrollToTop` is mounted on every page including standalone routes
- `ThemeToggle` is positioned at `bottom: 90px` to clear `ScrollToTop` at `bottom: 32px`
- "View Profile" CTA in Hero links to `https://www.curiousapes.in/profile/company-profile.pdf`
- `FloatingCTA` is rendered on all public pages except `/admin`

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
