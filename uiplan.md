# UI Overhaul Plan — Rixie Investor IDE

> Goal: Strip the current UI down to a minimal, Cursor-inspired aesthetic. Clean surfaces, tight information density, monochrome palette with one purposeful accent, sharp typography. No glass effects, no AI slop, no decoration that doesn't earn its place.

**Target vibe**: Cursor editor meets Bloomberg Terminal — professional, fast, information-dense, quietly confident. Dark by default. Every pixel serves a purpose.

---

## Current State Assessment

### Desktop App (`apps/desktop`)
- **Stack**: Tauri + Vite + React, Tailwind v4, shadcn/ui (new-york/zinc), react-resizable-panels, cmdk, zustand
- **Styling**: Split across `shell.css` (plain CSS), `index.css` (Tailwind/shadcn tokens), inline `style={{}}` props, and shadcn component classes — inconsistent and hard to maintain
- **Layout**: Sidebar + tab area + bottom panel + status bar via react-resizable-panels

### Landing Page (`apps/fe`)
- **Stack**: Next.js 16, Tailwind v4, Framer Motion, Inter + Instrument Serif fonts
- **Styling**: Tailwind utility classes + `globals.css` custom properties

### Problems to Fix
1. **Liquid glass everywhere** — `liquid-glass` class on sidebar, status bar, feature cards, navbar. Glassmorphism with backdrop-blur is 2024 AI slop. Remove all of it.
2. **Blue accent (`oklch(0.623 0.214 259.815)`)** — saturated blue primary in dark mode is the most common AI-generated color choice. Replace with something muted and intentional.
3. **Inline styles** — `EmptyState`, `Sidebar`, `PipelineView`, `SettingsView` all use `style={{}}` instead of Tailwind. Migrating these improves consistency and maintainability.
4. **Nested card pattern** — `data-card` inside `data-card`, `list-stack` wrapping `data-card`. Flatten the hierarchy.
5. **No motion** — desktop app has zero transitions. Tab switches, panel reveals, sidebar interactions all snap instantly.
6. **Generic tab strip** — looks like a cheap VS Code clone. Cursor's tab bar is cleaner — no visible borders between tabs, subtle active indicator.
7. **Landing page orbs** — purple radial-gradient blobs in Hero and CTA sections. Classic AI tell.
8. **Feature card grid** — 6 identical glass cards with icon-title-description. The most recognizable AI layout pattern.
9. **Typography** — body at `font-weight: 300` renders poorly on many screens. No real type scale. Section headers inside pages are inconsistent sizes.
10. **Scrollbar styling** — white-on-transparent looks disconnected. Cursor uses near-invisible scrollbars that appear on hover.

---

## Phase 1 — Design Tokens & Typography Foundation

**Scope**: `apps/desktop/src/index.css`, `apps/fe/app/globals.css`, `apps/fe/app/layout.tsx`
**Zero dependency on other phases. All other phases consume these tokens.**

### 1.1 Color Palette Overhaul

Replace the current blue-accent-on-dark palette with a monochrome system plus one muted accent. Inspired by Cursor's neutral warmth.

**Desktop dark theme (`index.css` `.dark` block)**:
```
--background:         oklch(0.09 0.005 260)     /* near-black with faint cool tint */
--foreground:         oklch(0.93 0.005 260)     /* off-white, not pure */
--card:               oklch(0.11 0.005 260)     /* slightly lifted surface */
--muted:              oklch(0.15 0.005 260)     /* secondary surface */
--muted-foreground:   oklch(0.55 0.01 260)      /* secondary text */
--border:             oklch(0.18 0.005 260)     /* subtle, not transparent */
--input:              oklch(0.13 0.005 260)
--primary:            oklch(0.75 0.01 260)      /* muted cool gray, NOT saturated blue */
--primary-foreground: oklch(0.09 0.005 260)
--accent:             oklch(0.65 0.06 160)      /* muted teal — one accent, used sparingly */
--destructive:        oklch(0.55 0.18 25)
--ring:               oklch(0.35 0.01 260)
```

**Remove**: All oklch values with chroma > 0.1 from non-accent tokens. No more `oklch(0.623 0.214 259.815)` saturated blue scattered everywhere.

**Landing page (`globals.css`)**:
- Align to the same palette above
- Remove `--hero-subtitle` — unnecessary; use `--foreground` with opacity
- Replace all `rgba(255, 255, 255, 0.xx)` hardcoded values with semantic tokens

### 1.2 Typography System

**Desktop**:
- Remove `font-weight: 300` from body — use `400` (regular)
- Establish type scale using Tailwind's defaults: `text-xs` (12px), `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px)
- Section labels: `text-xs font-medium uppercase tracking-wider text-muted-foreground`
- Page titles: `text-base font-semibold`
- Body: `text-xs` (12px for data-dense views) or `text-sm` (14px for prose)
- Keep Geist Sans as primary. It's clean and purpose-built for UI. Remove Inter from the fallback — let it be Geist or system.
- **Monospace for data**: use `font-mono` (`Geist Mono` or system monospace) for numbers, dates, IDs in pipeline tables and stat cards

**Landing page**:
- Keep Inter + Instrument Serif — the sans/serif pairing works
- Tighten heading sizes: current `text-5xl md:text-7xl` hero is fine, but section headings at `text-4xl md:text-5xl` are too large for the content weight. Drop to `text-3xl md:text-4xl`.
- Add `font-mono` for technical labels (layer numbers, tags in HowItWorks)

### 1.3 Spacing Rhythm

Define consistent spacing tokens used across both apps:
- Component internal padding: `p-3` (12px) — tight, Cursor-like
- Section gaps: `gap-3` or `gap-4`
- Page-level padding: `p-4` (16px)
- Between stacked cards: `gap-2` (8px) — tighter than current `gap-0` with border separators

### 1.4 Cleanup Tasks

- [ ] Rewrite `:root` and `.dark` blocks in `index.css` with new palette
- [ ] Rewrite `globals.css` variables to match
- [ ] Remove `liquid-glass` class definition from both CSS files
- [ ] Remove the `liquid-glass::before` gradient border effect from `globals.css`
- [ ] Update body font-weight to 400 in `index.css`
- [ ] Remove Geist Sans fallback chain — simplify to `"Geist Sans", system-ui, sans-serif`
- [ ] Add `--font-mono` custom property pointing to `"Geist Mono", ui-monospace, monospace`
- [ ] Update scrollbar styles: make thumb `oklch(1 0 0 / 0.06)` default, `oklch(1 0 0 / 0.12)` on hover — less visible by default

---

## Phase 2 — Desktop Shell & Layout Chrome

**Scope**: `apps/desktop/src/shell.css`, `Sidebar.tsx`, `TabArea.tsx`, `BottomPanel.tsx`, `StatusBar.tsx`, `MainLayout.tsx`, `CommandPalette.tsx`
**Depends only on Phase 1 tokens. Independent of Phase 3, 4, 5.**

### 2.1 Sidebar Redesign

Current: `liquid-glass` background, inline styles for header, `style={{fontSize: 10, letterSpacing...}}` labels.

**Target**: Flat surface, no glass. Tight spacing. Cursor-style sidebar with icon+label nav.

Changes:
- Remove `liquid-glass` class from `<aside>` in `Sidebar.tsx`
- Replace `sidebar-card` background: `background: var(--card)` — solid, not transparent
- Sidebar header: remove inline styles, use Tailwind classes. Product name smaller, left-aligned. Remove the `⇆` button or replace with a proper collapse icon (e.g., `PanelLeftClose` from lucide).
- Nav items: reduce height from 30px to 28px. Active state: `bg-accent/10 text-foreground` with no left-border. The colored left-border active indicator is a dated pattern. Use subtle background highlight only.
- Section headers: convert from `sidebar-section-header` class to Tailwind — `text-[10px] font-medium uppercase tracking-widest text-muted-foreground px-3 py-2`
- Recent items: use proper icons per entity type (Briefcase for deals, Lightbulb for theses, etc.) instead of `Clock` for every item
- Live Deals / Active Thesis sections: add item count badge next to section header

### 2.2 Tab Strip Redesign

Current: VS Code-style tabs with right borders between tabs, blue top-border on active.

**Target**: Cursor-style tabs — clean, minimal, no borders between tabs.

Changes to `shell.css`:
- `.tab-strip`: remove `background: oklch(0.09...)` — use `background: var(--background)`. Remove bottom border — let content area handle it.
- `.tab-button`: remove `border-right`, remove `border-top`. Use `text-muted-foreground` default, `text-foreground` on active. Height 32px.
- `.tab-button.active`: subtle `bg-card` background. Bottom border indicator (`border-b-2 border-accent`) instead of top border. Drop the blue.
- `.tab-close`: make invisible by default, visible on tab hover. `opacity-0 group-hover:opacity-100 transition-opacity`.
- Add horizontal scroll with fade indicators when many tabs open.

### 2.3 Bottom Panel

Current: Uses shadcn `Tabs` with `variant="line"`. Background is hardcoded oklch.

Changes:
- Background: `var(--card)` instead of hardcoded oklch
- Tab triggers: tighter, use `text-[11px]` instead of `text-xs`
- Remove `liquid-glass` if applied anywhere in bottom panel children
- Panel header height: 32px (match tab strip)
- `ActivityLog`, `TaskList`, `QuickNotes` — check for inline styles and migrate to Tailwind

### 2.4 Status Bar

Current: `liquid-glass` class, hardcoded background.

Changes:
- Remove `liquid-glass`
- Background: solid `var(--card)` or slightly darker than background
- Height: 24px (tighter — Cursor's is ~22px)
- Font: `text-[11px] font-mono` for status items — data should be monospaced
- Settings button: replace text button with a gear icon (`Settings` from lucide), no label
- Add keyboard shortcut hint: `⌘K` in the status bar, right-aligned

### 2.5 Command Palette

Current: Custom CSS in `shell.css` for `[cmdk-*]` selectors. Looks decent but uses hardcoded oklch values.

Changes:
- Replace all hardcoded `oklch(0.1 0.002 286)` with `var(--card)`
- Replace `oklch(1 0 0 / 0.05)` hover states with `var(--accent)/10` or `hsl(var(--muted))`
- Input height: 44px (slightly smaller, tighter)
- Results max-height: 320px
- Add subtle `shadow-lg` to the dialog panel
- Slide-in animation: keep but make it 100ms (currently 120ms)
- Add focus ring to selected item: `ring-1 ring-accent/20`

### 2.6 Resize Handles

Current: 8px width with inner pseudo-element.

Changes:
- Width: 1px visible, 8px hit area (use padding or pseudo-element for hit area)
- Remove the inner rounded pseudo-element — just a 1px solid line matching `var(--border)`
- On hover/drag: line becomes `var(--accent)` — only moment of color in the chrome

### 2.7 Shell CSS Cleanup

- Migrate all hardcoded oklch values in `shell.css` to CSS custom properties
- Consolidate `.data-card`, `.stat-card`, `.bottom-card`, `.content-card` into fewer surface variants: `surface-base` (background), `surface-raised` (card), `surface-overlay` (popover/modal)
- Remove `.liquid-glass` references everywhere

---

## Phase 3 — Desktop Content Views & Components

**Scope**: `apps/desktop/src/pages/*`, `apps/desktop/src/components/workspace/*`, `apps/desktop/src/components/layout/EmptyState.tsx`
**Depends only on Phase 1 tokens. Independent of Phase 2, 4, 5.**

### 3.1 Pipeline View

Current: `data-card` nesting, `stats-grid` with 5 stat cards, toolbar with native `<select>` elements.

Changes:
- **Stats strip**: Replace the 5 `stat-card` boxes with a single horizontal strip. Inline layout: `Sourcing: 4 · DD: 2 · IC: 1 · Offered: 1 · Closed: 0`. Font-mono for numbers. No card borders. This is Cursor-style information density — data without decoration.
- **Toolbar**: Replace native `<select>` with shadcn `Select` or simple button group. Style the view toggle (Table/Kanban) as a segmented control: two buttons, shared border, active one gets `bg-card`.
- **Table**: Tighten row padding from 7px to 6px. Remove hover background color on rows — use a subtle left-border on hover instead (`border-l-2 border-accent`). Company name column should be `font-medium` not `<strong>`.
- **Kanban**: `kanban-grid` columns should have a header label with deal count. Column background: `var(--card)`, rounded-lg.
- **Remove duplicate view toggle** — currently there's both a top-right Table/Kanban and a toolbar View selector. Pick one.

### 3.2 Deal Workspace

Current: Tab buttons are `.small-action` with active state. Card layout.

Changes:
- Sub-navigation (overview/notes/memos/timeline): Replace `.small-action` buttons with an underline tab pattern. Active tab gets `border-b-2 border-foreground` — monochrome, not colored.
- Deal header: Company name larger (`text-lg font-semibold`). Stage badge and confidence inline.
- Remove the "Deal Workspace" muted label — it's redundant when you're already in a deal tab.

### 3.3 Company Card

Current: `card-grid` with Sector/Geography/Funding/Employees.

Changes:
- Use a definition-list layout: label and value on the same line, separated by dots or space. `Sector · B2B SaaS    Geography · SF Bay Area    Funding · $4.2M`
- Company description: remove muted class from description text — it's important content, not secondary.
- Thesis badge: restyle as a subtle tag, not a full badge

### 3.4 Empty States

Current: `EmptyState.tsx` uses extensive inline styles.

Changes:
- Rewrite entirely with Tailwind classes — zero inline styles
- Icon container: `w-10 h-10 rounded-lg bg-muted flex items-center justify-center`
- Title: `text-sm font-medium`
- Description: `text-xs text-muted-foreground max-w-xs`
- Action button: use shadcn `Button` variant="outline" size="sm"
- Reduce vertical padding — empty states shouldn't dominate the viewport

### 3.5 Badges

Current: `.badge` class in shell.css — all badges look identical regardless of meaning.

Changes:
- Stage badges: use color-coded dot + text, no background. `● Sourcing`, `● DD`, `● IC Review`. Dot colors: neutral gray scale for most, accent for IC/Offered.
- Confidence badges: text-only with color. `High` in green-ish neutral, `Medium` in amber-ish, `Low` in default muted.
- Generic badges: keep minimal — `text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground`

### 3.6 Forms & Inputs

- All `<input>`, `<textarea>`, `<select>` elements: use shadcn `Input`/`Textarea`/`Select` components, or style consistently with: `bg-transparent border border-border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-accent/30 focus:border-accent/50`
- Remove native select elements — they break the dark theme on some platforms
- Form labels: `text-xs font-medium text-muted-foreground mb-1`

### 3.7 Tables

- `.table th`: add `font-mono text-[10px] uppercase tracking-wider` — column headers should look like terminal column labels
- `.table td`: `text-xs` — tighten from 12px
- Alternating row backgrounds: `even:bg-muted/30` — very subtle zebra striping
- Cursor uses no visible row borders — try `border-transparent` on `td` with just the zebra stripe for delineation

### 3.8 Settings View

- Remove inline styles on buttons
- Use shadcn `Button` for actions
- "Clear sample data" destructive button: use shadcn `Button variant="destructive"` instead of inline oklch colors
- About section: use monospace font for API base URL and data path values

### 3.9 Inline Style Migration

Migrate all remaining `style={{}}` props to Tailwind utility classes in:
- `Sidebar.tsx` — header branding, recent items overflow
- `TabArea.tsx` — empty state kbd styling
- `PipelineView.tsx` — stats grid margin, empty state height
- `DealWorkspace.tsx` — action row margin
- `SettingsView.tsx` — button justification, destructive button colors
- `CompanyCard.tsx` — card grid margin, description margin
- `EmptyState.tsx` — entire component

---

## Phase 4 — Landing Page Redesign

**Scope**: `apps/fe/app/sections/*`, `apps/fe/app/components/*`, `apps/fe/app/globals.css`
**Depends only on Phase 1 tokens. Independent of Phase 2, 3, 5.**

### 4.1 Remove AI Slop

Delete from every section:
- `liquid-glass` class usage (Hero badge, feature cards, differentiator cards, CTA button, HowItWorks number circles)
- `liquid-glass::before` gradient border effect in globals.css
- Purple radial gradient orb in Hero (the `rgba(120, 119, 198, 0.15)` blob)
- Ambient blur orb in CTA (`bg-white/[0.03] blur-[120px]`)
- Grid dot pattern overlay in HowItWorks (`backgroundImage: linear-gradient...backgroundSize: 20px 20px`)
- The pulsing green dot in HowItWorks status bar

### 4.2 Hero Section

Current: Video background + dark overlay + floating glass badge + giant heading + gradient orb.

**Target**: Clean, confident, no gimmicks.

Changes:
- Keep the video background — it's actual product content, not decoration
- Remove the radial gradient orb animation entirely
- Hero badge: replace `liquid-glass` with solid `bg-white/5 border border-white/10`. Remove the inner white `bg-white text-black rounded-md` pill — just text.
- CTA button: keep `bg-white text-black rounded-full` — that works. But remove `whileHover scale` — subtle opacity change is enough.
- Bottom gradient fade: keep, it's functional

### 4.3 Features Section

Current: 3-column grid of identical glass cards with icon-title-description.

**Target**: Break the identical card grid. Make it scannable, not decorative.

Option A — List layout:
- Replace 3-col grid with a 2-column layout: left column has feature title + short description, right side is empty/whitespace. Stacked vertically. Each feature is a row, not a card.
- No icons — the titles are clear enough. Icons on every card is AI pattern #1.
- Add thin horizontal rule between features

Option B — Asymmetric grid:
- Keep grid but vary the sizes. First feature spans 2 columns. Others are single column. Break the repetition.
- Remove the glass card styling. Use `border border-border rounded-xl p-6 hover:border-white/15 transition-colors`.
- Keep icons but make them smaller (16px) and muted.

Recommend **Option A** — it's more Cursor-like (information-first, not card-first).

### 4.4 How It Works Section

Current: Left description list + right architecture diagram. Pretty good actually.

Changes:
- Left side: keep the numbered list with connector lines — this works
- Number circles: replace `liquid-glass` with `border border-border bg-card`. Simpler.
- Right side diagram: remove grid dot overlay, remove green pulsing dot, remove `font-mono` on "System Architecture" label (or keep mono but drop the dot prefix)
- Layer rows: simplify hover state — just `text-foreground` on hover, don't shift adjacent layers with transform
- The concept is strong. Just strip decorative noise.

### 4.5 Differentiators Section

Current: 2-col grid of glass cards with icon + title + description.

Changes:
- Remove `liquid-glass` from cards
- Replace with: `border border-border rounded-xl p-6`
- Move icon inline with title (already done, good)
- Consider making icons monochrome and smaller
- Heading "The moat is not the model." — strong copy, keep it

### 4.6 CTA Section

Current: Giant blur orb + centered heading + two buttons.

Changes:
- Remove the animated blur orb entirely
- Keep the centered layout — it's clean
- Primary button: `bg-foreground text-background` — keep
- Secondary button: replace `liquid-glass rounded-full` with `border border-border rounded-full hover:bg-white/5`
- Remove `whileHover scale` from buttons — use opacity or border-color transition

### 4.7 Navbar

Current: Solid implementation with scroll-triggered glass effect.

Changes:
- On scroll: replace `rgba(255, 255, 255, 0.04)` glass with solid `bg-background/95 backdrop-blur-sm`. Simpler.
- "Request Access" button: replace `bg-white text-black rounded-lg` with `bg-foreground text-background rounded-full text-xs` — match the smaller nav context
- Logo "Rixie": add slight letter-spacing `tracking-tight` (already has it, good)

### 4.8 Testimonial Section

- Read `Testimonial.tsx` and assess — likely needs similar glass removal
- If it uses a quote card, strip it to text-only with a thin left border accent

---

## Phase 5 — Motion, Interaction & Polish

**Scope**: Both apps. All interaction patterns, transitions, hover states, focus management.
**Depends only on Phase 1 tokens. Independent of Phase 2, 3, 4.**

### 5.1 Desktop Transitions

Add CSS transitions to all interactive elements in `shell.css` and component files:

- **Tab switches**: content area fades in over 100ms (`opacity 0 -> 1, translateY -4px -> 0`)
- **Sidebar item hover**: `transition-colors duration-150`
- **Panel resize**: already handled by react-resizable-panels, but add a subtle border-color change on the resize handle during drag
- **Command palette**: tighten slide-in to 80ms, add backdrop fade-in 100ms
- **Button hovers**: all `.small-action` buttons get `transition-all duration-150`

### 5.2 Landing Page Motion Refinement

Current Framer Motion usage is decent but over-animated in places.

Changes:
