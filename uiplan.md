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
