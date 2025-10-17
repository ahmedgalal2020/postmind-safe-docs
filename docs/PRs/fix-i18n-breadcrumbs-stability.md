Title: Fix i18n language persistence and localized breadcrumbs across all pages

Branch: fix/i18n-breadcrumbs-stability

Summary:
- Synchronized i18n language with the URL locale prefix on app startup and throughout navigation. `src/i18n.ts` now derives the initial language from the path (`/de` or `/en`) and backs off to `pm_lang` in localStorage, replacing previous `locale` key usage.
- Enforced locale-prefixed URLs globally via `useLocale`: if a path lacks `/de` or `/en`, it redirects to the current language-prefixed path (using `replace` to avoid history growth). The hook also persists the selected language to `pm_lang` and updates it on manual switches.
- Localized breadcrumbs consistently by skipping the locale segment, translating static routes, and providing a friendly label for `letters/:id` using a cached title (if available) or a truncated ID fallback.
- Added minimal smoke tests with Vitest/Testing Library to verify NavBar presence on public pages, language switching updates the URL prefix and persists across re-render, and breadcrumbs render on deep routes.

Files changed:
- src/i18n.ts
- src/hooks/useLocale.tsx
- src/hooks/useBreadcrumbs.tsx
- vite.config.ts
- src/__tests__/i18n-breadcrumbs.stability.spec.tsx
