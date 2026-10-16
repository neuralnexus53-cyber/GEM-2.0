# Landing Page Guide

This guide covers only the public landing page. The landing page is implemented in [src/pages/LandingPage.tsx](./src/pages/LandingPage.tsx), with landing-only responsive and visual styling in [src/pages/LandingPage.css](./src/pages/LandingPage.css).

## Main files

| File | Purpose |
| --- | --- |
| `src/pages/LandingPage.tsx` | Landing page structure, navigation actions, carousel, modal state, section content, and footer content |
| `src/pages/LandingPage.css` | Landing-only colors, language selector styling, mobile/tablet/laptop responsive rules, and mobile action bar |
| `src/App.tsx` | Routes the public landing page at `/#/` and opens landing modals for `/#/faq` and `/#/dossier` |
| `src/context/LanguageContext.tsx` | Shared translation state used by the landing page; the landing selector intentionally exposes only English and Hindi |

## Page map

### 1. Navigation and header

In `LandingPage.tsx`, navigation starts around the first large JSX return block:

- Full-screen navigation drawer: around lines 155-240
- Government top strip: around lines 228-242
- Sticky landing header and logo: around lines 243-276
- Desktop navigation row: around lines 277-308
- Landing language selector component: near the top of the file, around lines 29-57
- The desktop/tablet brand label is `GEM 2.0 COMPLIANCE PORTAL`; phones use the shorter `GEM 2.0 COMPLIANCE` label.

To change navigation labels or destinations, update the links and buttons in these sections. Use `scrollToSection('section-id')` for links that stay on the landing page.

Current section destinations:

- `about`: summary cards
- `statistics`: live platform statistics
- `portals`: vendor and procurement officer entry cards
- `architecture`: operational architecture

### 2. Hero / carousel

The hero begins around lines 310-381.

- Slide content is defined in `HERO_SLIDES` near the top of the file.
- Images are stored under `public/images/`.
- The carousel auto-advances every 5.5 seconds and wraps across the three configured slides.
- Previous/next buttons and slide dots are inside the hero section.

### 3. Main content

Main content begins around line 383.

- Summary cards: around lines 386-492
- Live statistics: around lines 494-544
- Portal gateway cards: around lines 546-630
- Operational architecture wrapper: around lines 632-642

The detailed operational architecture is a reusable component in [src/components/OperationalArchitecture.tsx](./src/components/OperationalArchitecture.tsx).

### 4. Footer

The footer begins around line 644 and continues until the modal markup.

It contains:

- Statutory and policy links
- GeM 2.0 compliance links
- Portal access links
- Support and regulatory resources
- Closing government attribution and copyright text

Footer buttons usually open a tab in the landing page's About/Dossier modal. Keep the `aboutModalTab` value aligned with the modal tab type near the top of `LandingPage.tsx`.

### 5. Modals and overlays

The modal markup appears after the footer:

- About / official regulatory dossier modal
- FAQ dossier modal
- Compliance clarification ticket modal

The modal state and tab selection are declared near the top of `LandingPage.tsx`. When adding a new dossier chapter, update both the `aboutModalTab` union and its sidebar/content rendering.

## Responsive editing rules

- Mobile rules are inside `@media (max-width: 768px)` in `LandingPage.css`.
- Very small phone adjustments are inside `@media (max-width: 380px)`.
- Tablet rules are inside `@media (min-width: 769px) and (max-width: 1199px)`.
- Laptop/desktop uses the base classes in `LandingPage.tsx` and the base CSS rules.
- Keep all landing styles scoped under `.landing-page` so vendor and government portals are not affected.

## Safe validation

After landing-only changes:

```powershell
npm run build
git diff --check
```

Also check the landing page at approximately 375px, 768px, and 1280px widths. Confirm no horizontal overflow, the header language control remains visible, and the drawer/modal overlays can be opened and closed.
