# ExtensionForge

ExtensionForge is a production-ready AI Chrome Extension Builder built with Next.js 15, TypeScript, Tailwind CSS, and the App Router. Users describe the extension they want in plain English, generate Manifest V3 source files, save projects to a dashboard, and export a downloadable ZIP.

## Features

- AI-style prompt workflow that infers extension metadata from a plain-English description
- Generates `manifest.json`, `popup.html`, `popup.css`, `popup.js`, `background.js`, `content.js`, SVG icons, and extension README files
- Browser ZIP export powered by JSZip
- Authentication screens for login and registration
- Project saving and dashboard using local storage for this deployable prototype
- Responsive SaaS landing page and app workspace
- Vercel-ready configuration

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

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Keep the detected Next.js settings or use `vercel.json`.
4. Deploy.

## Project structure

- `app/` - App Router pages and global styles
- `components/` - shared navigation, sidebar, and auth components
- `lib/` - extension generation utilities
