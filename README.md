# ExtensionForge

ExtensionForge is a production-ready SaaS starter built with Next.js 15, TypeScript, Tailwind CSS, and the App Router. It includes a Vercel/Linear-inspired landing page, authentication screens, a dashboard, and a Chrome extension generator that exports a ZIP containing `manifest.json`, `popup.html`, and `popup.js`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev` - start local development
- `npm run build` - create a production build
- `npm run start` - serve the production build
- `npm run typecheck` - run TypeScript checks

## Project structure

- `app/` - App Router pages and global styles
- `components/` - shared navigation, sidebar, and auth components
- `lib/` - extension generation utilities
