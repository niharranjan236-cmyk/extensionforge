# ExtensionForge

ExtensionForge is a production-ready AI Chrome Extension Builder built with Next.js 15, TypeScript, Tailwind CSS, and the App Router. Users describe the extension they want in plain English, generate Manifest V3 source files, save projects to a dashboard, and export a downloadable ZIP.

## Features

- OpenAI-powered prompt workflow that turns plain-English descriptions into complete extension source files
- Generates `manifest.json`, `popup.html`, `styles.css`, `popup.js`, `background.js`, conditional `content.js`, SVG icons, and extension README files
- Browser ZIP export powered by JSZip
- Authentication screens for login and registration
- Supabase Auth and row-level-secured project storage
- Responsive SaaS landing page and app workspace
- Vercel-ready configuration

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Create `.env.local` with the following values before running the app:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

Run the SQL in `supabase/migrations/202607260001_create_projects.sql` in your Supabase project to create the authenticated `projects` table and row-level-security policies.

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
