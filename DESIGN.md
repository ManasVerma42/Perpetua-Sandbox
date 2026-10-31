# Design guide

Every screen in this app follows this guide. It builds on shadcn/ui conventions, Refactoring
UI principles and WCAG 2.2 AA. Colours, radius and fonts are tokens in `src/index.css`; change
them there, never per component.

## Foundations
- **Colour.** Neutral zinc surfaces with one accent (indigo). Use tokens, never raw palette
  classes: `bg-background` (page), `bg-card` (surfaces), `text-foreground`, `text-muted-foreground`
  (secondary text), `bg-primary text-primary-foreground` (primary actions), `bg-accent` (hover,
  selected), `text-destructive` / `text-success` / `text-warning` (status), `border` / `border-input`.
  Never rely on colour alone to carry meaning; pair it with text or an icon.
- **Type.** Inter. Page title `text-2xl font-semibold tracking-tight`; section title
  `text-base font-semibold`; body and controls `text-sm`; captions `text-xs text-muted-foreground`;
  key numbers `text-2xl font-semibold`. Weights: 400 body, 500 labels and nav, 600 headings.
  Keep line length under ~75 characters (`max-w-prose`).
- **Spacing.** 4px base: `gap-2` inside a control, `gap-3`/`gap-4` between related items,
  `gap-6`/`gap-8` between groups, `py-8` around a page. More space between groups than within.
- **Shape and depth.** Cards `rounded-xl border bg-card shadow-sm`; controls `rounded-md`;
  overlays `shadow-lg`. One level of elevation per screen region.

## Layout
- Small apps (up to ~5 pages): `AppShell` — sticky header with the app name, top navigation
  (current page highlighted) and account actions on the right; content `max-w-6xl` centred.
- Larger apps (dashboards, admin, many sections): `SidebarShell` — grouped sidebar navigation
  with icons (lucide-react), a drawer on small screens, actions in the top bar.
- Every page starts with `PageHeader` (title, one-line description, primary action on the
  right) and groups content in `Section` cards.
- Collections: card grids `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`, or `Table` for many rows
  (wrapped in `overflow-x-auto`). Dashboards open with a row of `StatCard`s.
- Forms: one column, `max-w-md`, label above each field, help text below, error text in
  `text-destructive` under the field, primary button at the end. Sign-in and sign-up pages are
  centred on the screen without the shell.
- Mobile first: everything works at 360px wide; sidebars become drawers, grids collapse to one
  column, tables scroll sideways.

## States (every data view has all four)
- Loading: `LoadingRows` or `Skeleton` shaped like the content, never a full-page spinner.
- Empty: `EmptyState` with what is missing and the next step (e.g. "Create your first habit").
- Error: `ErrorState` in plain words with "Try again", never a raw error message.
- Success: confirm actions with `toast({ title })`; disable a button while its action runs.

## Accessibility (WCAG 2.2 AA)
- Text contrast at least 4.5:1 (the tokens meet it); don't put muted text on muted backgrounds.
- Every interactive element is a real `button`/`a`/input, reachable by keyboard, with a visible
  focus ring (`focus-visible:ring-2 ring-ring`) and a click target of at least 24×24px.
- Inputs have labels; icon-only buttons have `aria-label`; images have `alt`.

## Choosing a look
- **Accent** (one per app, set for you on `<html data-accent="...">` in index.html): `indigo`
  (default; product, finance, productivity), `emerald` (energy, health, sustainability, dark
  fintech), `coral` (bold consumer and finance dashboards), `espresso` (fashion, lifestyle,
  editorial stores), `forest` (home, kitchen, food, crafts, sustainable goods; also warms
  surfaces to cream). Everything else stays neutral: the accent is for primary actions,
  active states, key numbers and small highlights, never large backgrounds.
- **Display type**: big headings use `font-display`. Keep it Inter (geometric, modern) for tech,
  energy, finance and SaaS; set `<html data-display="serif">` (Fraunces) for fashion, lifestyle
  and editorial stores. UI text is always Inter.
- **Serif accent words**: `font-serif italic` (Fraunces, always loaded) on one or two words of a
  sans heading gives the warm editorial feel: "Eco-Friendly <em class="font-serif italic">
  Kitchenware</em> for a greener home", "Bestselling ✧ *Products*", "Best *sellers*". Use it in
  stores, food, home and lifestyle apps; at most one accent phrase per heading.
- **Contrast trick from the references**: two-tone headings — the first half `text-foreground`,
  the rest `text-muted-foreground` ("Focusing on quality, *we maintain customer trust*").
- **Surfaces**: page `bg-background`, cards `bg-card`; a dark band (`bg-zinc-950 text-white`)
  once per landing page for the closing CTA and footer; dark-mode apps add `class="dark"` to
  `<html>`.

## Landing pages (marketing, company, product sites)
Order: Navbar → Hero (+ stats) → Logo cloud → Feature grid → Split section → Case study /
testimonials → CTA band + footer. Each section `py-20 md:py-28`, content `max-w-6xl mx-auto px-6`.
- **Navbar**: `h-16`, logo (mark + name, `font-semibold`) left, links centred `text-sm
  text-muted-foreground hover:text-foreground gap-8`, right: ghost "Log in" pill + primary
  "Get in touch" pill (`rounded-full px-4 h-9`). Over a photo hero the nav is transparent with
  white text.
- **Hero**: full-width image card `relative overflow-hidden rounded-3xl min-h-[560px]` with a
  dark gradient overlay (`bg-gradient-to-t from-black/60`). Inside, bottom-left: eyebrow
  (`text-sm text-white/80`), display heading `font-display text-5xl md:text-7xl font-light
  tracking-tight text-white leading-[1.05]`, then text links with an arrow
  (`border-b border-white/60 pb-1 text-sm`). Optional floating glass card top-right
  (`backdrop-blur bg-white/10 border border-white/20 rounded-2xl p-3`) with a thumbnail.
- **Stats strip**: 3 numbers in a white panel overlapping the hero's bottom edge
  (`-mt-16 ml-auto w-fit rounded-tl-3xl bg-card p-8 grid grid-cols-3 gap-10`); number
  `text-4xl font-light tracking-tight`, caption `text-xs text-muted-foreground max-w-[10rem]`.
- **Section heading**: two-tone, `text-3xl md:text-4xl font-medium tracking-tight` left, with a
  short supporting paragraph right (`grid md:grid-cols-2 gap-8 items-end`), or centred.
- **Logo cloud**: a row of equal circles (`size-32 rounded-full bg-muted grid place-items-center`)
  with greyscale logos; the first one white with a shadow as the "active" one.
- **Feature grid**: one bordered card split into 3×2 cells (`grid sm:grid-cols-2 lg:grid-cols-3
  divide-x divide-y rounded-2xl border bg-card`), each cell `p-8`: small accent icon in a round
  chip (`size-9 rounded-full bg-accent text-accent-foreground`), title `font-medium`, two lines
  of `text-sm text-muted-foreground`.
- **Split section**: heading + primary pill CTA on the left above a 2×2 grid of numbered
  service cards (`rounded-xl border p-5`: "01" in `text-xs text-muted-foreground`, title
  `font-medium`, "View details" underlined link); a tall rounded photo on the right
  (`rounded-3xl object-cover aspect-[4/5]`).
- **Case study / testimonial**: a large card `grid md:grid-cols-2 rounded-3xl bg-muted p-8
  gap-8`: company name, quote (`text-lg`), primary pill "View case study", person + role at the
  bottom; photo right. Below: tabs as a row of labels with an accent underline on the active one.
- **CTA band + footer**: `bg-zinc-950 text-white rounded-t-3xl`: two-tone heading
  (`text-white` / `text-white/50`), checklist with accent check icons, white pill button;
  footer row: logo, links, round social icon buttons (`size-9 rounded-full border-white/20`);
  bottom row copyright + legal links in `text-xs text-white/50`.

## Dashboards (finance, analytics, admin, trackers)
Shell: `SidebarShell` (sidebar or slim icon rail) or a top header row; content is a **bento
grid** of cards. Page background `bg-background`, cards `bg-card rounded-2xl p-6` with a hairline
border or a very soft shadow; generous `gap-4 lg:gap-6`.
- **Header row**: greeting `text-3xl font-semibold tracking-tight` ("Good morning, Sarah"), or a
  logo badge + two-tone title ("Financial / Dashboard"); right side: round icon buttons
  (`size-10 rounded-full border`) for add/notifications (count badge `bg-destructive text-white
  text-[10px] rounded-full`), a user chip (avatar + name + role), and a pill search
  (`rounded-full bg-muted h-10 px-4`).
- **Primary action**: one accent pill with a trailing arrow ("Show my tasks →"); a date chip
  (big day number in a circle + weekday and month).
- **KPI cards** (row of 3–4): icon chip (`size-9 rounded-full bg-muted`), label
  `text-sm text-muted-foreground`, value `text-2xl md:text-3xl font-semibold tracking-tight`,
  delta with an arrow (`text-success` up / `text-destructive` down), optional sparkline (inline
  SVG polyline, accent stroke, no axes) and a period dropdown pill ("Weekly ▾") top-right.
- **Chart card**: title + total + delta, segmented range control top-right (pills:
  1 week / 1 month / 6 months / 1 year; active `bg-accent text-accent-foreground`), then a
  smooth line or bar chart in inline SVG (accent line, muted grid lines, month labels
  `text-xs text-muted-foreground`). No chart library is installed; draw simple SVG.
- **Lists**: transactions / activities as rows `flex items-center gap-3 py-3`: icon or avatar in
  a rounded square, title + subtitle, amount right-aligned (`font-medium`, coloured by sign),
  time in `text-xs text-muted-foreground`. Long lists use `Table` with status chips.
- **Right rail** (xl screens, `w-80`): balance card (big number, outline accent button
  "Top up"), a week day-picker (days as small columns, today circled in accent), goals with
  progress bars (`Progress`, label + "1.53 / 2.00" + percent).
- **Widgets**: progress ring (SVG circle with stroke-dasharray, percent centred), dot-matrix
  of days (`grid grid-cols-10 gap-1` of `size-3 rounded-full`, filled = accent), filter chips
  with an × (`rounded-full border px-3 h-8 text-sm`), rating row of round emoji buttons.
- **Dark variant**: `class="dark"` on `<html>`, emerald accent, cards slightly lighter than the
  page, amounts in success/destructive chips.

## E-commerce (stores, catalogues, product pages)
- **Header**: logo (centred for fashion, left otherwise), category links `text-sm`, icon buttons
  right (search, account, wishlist heart, cart with a count badge). A second bar on catalogue
  pages: category dropdown pill, filter pills (New arrivals, Sale, Men, Women…), and a wide pill
  search with an icon (`rounded-full bg-muted h-11`).
- **Home hero**: full-bleed photo `rounded-3xl` or edge-to-edge, display heading `font-display
  text-5xl md:text-7xl font-bold leading-[0.95]` (serif for fashion), one light pill CTA
  ("Shop now"), carousel arrows as round buttons bottom-right.
- **Collection tiles**: photo cards `relative overflow-hidden rounded-2xl aspect-[3/4]` with a
  gradient overlay, white heading over the image and a pill button ("Find your fit"); a bento of
  one tall + two stacked tiles for "recommended".
- **Product grid**: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`; card = image on a soft
  `bg-muted rounded-2xl aspect-square object-contain p-6`, price `text-lg font-semibold` with a
  small tag chip right, name `font-medium`, one-line description `text-xs text-muted-foreground
  line-clamp-2`, two buttons side by side: secondary "Add to cart" + primary "Buy now". End with
  a centred outline pill "See more".
- **Product page**: breadcrumb (`← Home · Product details`, `text-sm text-muted-foreground`);
  gallery = one large image + a 2-column grid of smaller ones (`grid grid-cols-2 gap-3
  rounded-2xl`), a label chip on the main image; title `text-4xl font-semibold tracking-tight`
  with a round heart button; rating (accent star, "4.9 (41) reviews"); colour swatches (round,
  `size-9`, ring on the selected one, name below); size chips (`h-9 px-4 rounded-full border`,
  selected `bg-foreground text-background`); accordions for Description and Shipping (rows of
  icon-in-circle + label + value); a **price bar**: dark band `bg-zinc-950 text-white
  rounded-2xl p-5 flex justify-between`, price `text-4xl font-semibold`, white pill "Buy now →".
  Reviews: avatar, name, date, stars, quote, photo thumbnails, "See more".
- **Mobile**: header with menu + logo + search/cart, gallery as a swipeable row, sticky price
  bar at the bottom.
- **Cart and checkout**: right drawer (Dialog styled as a sheet) for the cart with line items
  (thumb, name, variant, quantity stepper, price) and a sticky total + checkout button;
  checkout is a two-column page: form left (`max-w-md` sections: contact, delivery, payment),
  order summary card right.

### Warm editorial store (home, kitchen, food, crafts, sustainable goods)
`data-accent="forest"` (or `espresso`), `data-display="serif"`, cream surfaces, photography does
the work. Section rhythm: `py-16 md:py-24`, `max-w-7xl mx-auto px-6`.
- **Announcement bar**: `bg-primary text-primary-foreground text-xs text-center py-2` ("Free
  shipping over ₹999 · Use code **EARTH10** for 10% off").
- **Header**: serif wordmark (`font-display text-2xl font-bold`) with a tiny uppercase tagline
  below (`text-[10px] tracking-widest text-muted-foreground`); centred links (a "Deals" link in
  `text-destructive`); a filled pill search (`bg-secondary rounded-full h-10 w-72`); cart icon
  with a count badge, account icon; optional small primary pill ("✦ AI"). On a photo hero the
  same header sits inside the image: links left, wordmark centred, search + round icon buttons
  (`size-10 rounded-full bg-white/15 backdrop-blur`) right.
- **Photo hero**: `rounded-3xl overflow-hidden min-h-[520px]` photo with a dark left gradient;
  heading `text-5xl md:text-6xl font-medium leading-[1.05] text-white` with one `font-serif
  italic` word, short paragraph `text-sm text-white/80 max-w-sm`, cream pill "Shop now →"
  (`bg-accent text-accent-foreground`); a floating glass stat card bottom-right (`bg-white/10
  backdrop-blur border-white/20 rounded-2xl p-4 w-40`): three short lines, a leaf icon, and a
  big italic serif number ("96%").
- **Split hero**: soft tinted band (`bg-secondary`), left: uppercase eyebrow (`text-[11px]
  tracking-widest`), serif heading `text-5xl md:text-6xl` with an italic phrase in
  `text-primary` ("for *Every Table*"), paragraph, primary pill "Shop now →" + outline pill
  "Explore collections"; a stats row below with vertical dividers (`divide-x`, value `text-2xl
  font-medium`, caption `text-[11px] text-muted-foreground`); a large cut-out product image right.
- **Section heading** (pick one per site): (a) eyebrow "BROWSE" + serif `text-3xl`; (b) two
  lines of `text-2xl text-muted-foreground` ending in "✧ *Products*" (`font-serif italic
  text-foreground`). Right side: underlined "More products →" link, an outline pill "View all
  →", or filter pills (All / Sets / Drinkware, active filled primary).
- **Category circles**: a row of 6 round images (`size-24 md:size-28 rounded-full
  object-cover`), name in serif below and "24 products" in `text-xs text-muted-foreground`.
- **Product card (store)**: image on `bg-secondary rounded-2xl aspect-[4/5]` with a tag pill
  top-left (outlined italic "New", "Promotion", or filled "Bestseller" / "SALE 20%"); below:
  colour dots (`size-3 rounded-full`), tiny uppercase category, name (serif or `font-medium`,
  2 lines), variant ("6 piece · White glaze"), stars + "(428)", old price `line-through
  text-muted-foreground text-xs` + price `font-semibold`; either a small primary pill "+ Cart"
  beside the price or a full-width primary pill "Add to cart". In a carousel: 4 across with
  round arrow buttons overlapping the outer edges.
- **Value tiles**: 3 cream tiles (`bg-secondary rounded-2xl p-6 flex items-center gap-4`), icon
  in a white circle, two-line label with the first word in serif italic.
- **Explore tiles**: tall dark photo tiles (`aspect-[3/4] rounded-xl`) with "Explore" +
  italic serif name centred low and a tiny cream pill "Shop →"; carousel arrows on the edges.
- **Collection cards**: photo `rounded-2xl aspect-[4/3]`, serif title, "Clean · Simple ·
  Timeless" in `text-xs text-muted-foreground`, "Shop collection →" link.
- **Alternating splits**: text block (serif "Best *sellers*", 2–3 line paragraph, small primary
  pill) beside a large photo, then mirrored for "New *Arrival*".
- **Gallery**: a row of 5 photos with staggered heights (`items-start`, every other one taller),
  italic serif caption over the bottom-left of each, round arrows top-right.
- **Reviews band**: `bg-secondary rounded-3xl p-8`: big italic serif "4.9/5" + "More than
  **25,000** 5-star reviews"; a horizontal row of quote cards (`w-64 rounded-2xl p-5`, quote mark
  in the accent colour, text, name with italic surname, role in `text-[11px]`), the centre card
  raised (`bg-card shadow-md -translate-y-3`), the edge cards faded.
- **Statement**: three fanned photos (centre large, sides smaller, behind and tilted), then a
  centred `text-2xl md:text-3xl text-muted-foreground` paragraph with key words in
  `font-serif italic font-semibold text-foreground` and small rounded image pills inline
  (`inline-block h-6 w-12 rounded-full object-cover align-middle`).
- **Promo / newsletter band**: `bg-primary text-primary-foreground rounded-3xl p-10` (or a warm
  terracotta gradient): eyebrow, serif heading with an italic second line ("Sale — *Up to 35%
  off*"), code in bold, white pill "Shop the sale →"; for a newsletter, centred big serif offer
  ("10% Off"), an email input joined to a cream "Subscribe" button, photos scattered in the
  corners (`absolute rounded-xl w-40 rotate-[-4deg]`).
- **Footer**: brand + one-line mission + round social buttons; 4–5 link columns (Quick links,
  Company, Support, Contact with icons, Download app badges); a bottom row with legal links and
  payment method chips (`rounded border px-2 text-[10px]`); last, a giant faded wordmark
  (`font-display text-[18vw] leading-none text-muted-foreground/30 select-none`).
- **Product page (store)**: breadcrumb bar (`Home › Cookware › Heritage Dutch Oven`); a tinted
  band holding `grid lg:grid-cols-2 gap-12`. Left: main image on `bg-muted rounded-2xl
  aspect-square` with a sale pill, a row of 4 thumbnails below (active `ring-2 ring-primary`).
  Right: uppercase eyebrow ("COOKWARE · ORIGINAL"), serif title `text-5xl` with an italic
  second line, 2-line description, rating + "4.9 (512 reviews) | 2,400+ sold"; a white price card
  (`bg-card rounded-2xl p-5`): price `text-4xl font-bold`, old price struck through, "Save
  ₹1,400" chip (`bg-accent text-accent-foreground rounded-full`), "or ₹467/mo · 0% interest";
  "COLOUR — Forest Green" label (selected name in `text-primary`) above swatches (`size-11
  rounded-full`, selected with a check and `ring-2 ring-offset-2 ring-primary`, name under each);
  "SIZE - 5.5 L" above size boxes (`h-12 min-w-24 rounded-xl border`, selected `bg-primary
  text-primary-foreground`, sold out `opacity-50 line-through` + "Sold out"); a row of quantity
  stepper pill (− 1 +), big primary pill "Add to cart" (`h-14 flex-1`) and outline pill
  "Wishlist"; a trust row of 4 icon items with dividers (Free shipping, 30-day returns, 2-year
  warranty, 100% eco; title + `text-xs` caption). Below the band: underline `Tabs` (Description,
  Specifications, Care guide, Reviews (512), Shipping & returns); the Description tab is a
  serif "About this piece" + paragraph + bullet list beside a "Specifications" card of
  key/value rows (`grid grid-cols-2 py-3 border-b`, key muted).

## Shared elements and overlays
- **Pills everywhere**: buttons in marketing and commerce are `rounded-full`; dashboards may
  use `rounded-xl`. Heights: `h-9` small, `h-10` default, `h-12` hero CTAs.
- **Dropdown pill**: `rounded-full border h-9 px-3 text-sm` with a chevron, opens a `Select` or
  `DropdownMenu`.
- **Segmented control**: a row of pills in a `bg-muted rounded-full p-1` track (use `Tabs`).
- **Accordion**: rows with a title and chevron, content below, hairline dividers (use `Tabs` or a
  local `useState` toggle).
- **Carousel**: round arrow buttons (`size-10 rounded-full bg-card shadow`) and dots (active dot
  wider: `w-6 h-2 rounded-full bg-foreground`, others `size-2 bg-muted-foreground/40`).
- **Badges and chips**: status `Badge`; count badge on icons; tag chips `rounded-full bg-muted
  px-2 py-0.5 text-[10px]`.
- **Modals**: `Dialog` for confirmations ("Delete habit?"), quick views and short forms
  (`max-w-lg`, title, one-line description, actions right: ghost Cancel + primary/destructive);
  side sheets for carts and filters on mobile (`DialogContent` with `fixed right-0 inset-y-0
  max-w-md rounded-none`).
- **Images**: use `https://picsum.photos/seed/<word>/<w>/<h>` placeholders with meaningful seed
  words and real `alt` text; `object-cover` and a fixed aspect ratio so layouts don't jump.

## Writing
- Sentence case everywhere. Buttons say what they do ("Save habit", not "Submit").
- Short, friendly, specific messages; no jargon or error codes.
