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
