# Portfolio site

A personal product-management portfolio: Next.js 16 (App Router, Turbopack), Tailwind CSS 4, Sanity (embedded Studio at `/studio`), Motion, Formspree. Dark-only "Obsidian Prism" design. Every visible string on the site is editable in Sanity; publishing a change updates the live site within seconds through a webhook, with no redeploy.

## How it fits together

```
 you edit in /studio  ──publish──▶  Sanity  ──webhook──▶  POST /api/revalidate  ──▶  Next.js cache expired
                                                                                           │
 visitor ──▶ Next.js (cached, static-speed pages) ◀── re-fetches from Sanity on next request ┘
 images  ──▶ cdn.sanity.io (resized + WebP/AVIF by Sanity, never through /_next/image)
 contact form ──▶ formspree.io (browser → Formspree → your inbox; no server code)
```

## Requirements

- Node.js 20.9 or newer (Node 22 LTS recommended, locally and on the host).
- A free [Sanity](https://www.sanity.io/manage) project.
- A free [Formspree](https://formspree.io) form.

## Quick start

```bash
cp .env.example .env.local   # fill in the values below
npm install
npm run dev                  # http://localhost:3000, Studio at /studio
```

### Environment variables

| Variable | Required | What it is |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | Public URL, e.g. `https://yourdomain.com`. Used for canonical links, Open Graph, sitemap. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | From sanity.io/manage. |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | Usually `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | yes | A date string; `2026-10-01` is fine. |
| `SANITY_API_READ_TOKEN` | optional | Only if the dataset is private. |
| `SANITY_REVALIDATE_SECRET` | yes for deploy | Any long random string. Must match the webhook secret in Sanity. |
| `NEXT_PUBLIC_FORMSPREE_FORM_ID` | yes for deploy | The ID in your Formspree form URL. Without it the contact page shows only the email channel. |

`NEXT_PUBLIC_*` values are baked in at build time. Change one, rebuild.

### Seed-preview mode (no accounts needed)

If `NEXT_PUBLIC_SANITY_PROJECT_ID` is empty, or `SANITY_SEED_PREVIEW=true` is set, the site reads `seed/content.ndjson` from disk instead of Sanity (GROQ is evaluated locally with `groq-js`). That is how `npm run build` passes on a fresh clone and how you can preview the layout before creating any account. Images are not available in this mode.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack. |
| `npm run build` | Production build. |
| `npm start` | Production server; respects `PORT`. |
| `npm run lint` | ESLint (flat config, `eslint` CLI; `next lint` no longer exists). |
| `npm run typecheck` | `tsc --noEmit`. |

## One-time setup (in this order)

1. **Create a Sanity project** at sanity.io/manage (free tier). Note the project ID. Use dataset `production`.
2. **Create a Formspree form.** Note the form ID and set the notification email.
3. **Fill `.env.local`** from `.env.example`, then `npm install` and `npm run dev`.
4. **Add CORS origins** in Sanity manage → API → CORS origins: `http://localhost:3000` and your production domain, both with *Allow credentials* checked. The embedded Studio needs this.
5. **Import seed content:**
   ```bash
   npx sanity dataset import seed/content.ndjson production
   ```
   (`sanity.cli.ts` reads the project ID and dataset from `.env.local`; if the CLI cannot find them, pass `--project <id>` or run `npx sanity login` first.)
6. **Open `localhost:3000/studio`**, log in, replace the placeholder content, upload your photo, social share image and resume PDF. The Studio sidebar shows five fixed singletons (Site settings, Home, Projects page, About, Contact) plus Projects, Categories, Experience and Education.
7. **Push the repo** to a private GitHub repository.
8. **Create the Node.js web app on Hostinger** (hPanel → Websites → Node.js web app) connected to the GitHub repo. Node version 22, build command `npm run build`, start command `npm start`. Add every variable from `.env.example`. Confirm your plan includes Node.js web apps; shared plans that only serve PHP/HTML will not run this site.
9. **Point your domain** at the app and enable SSL.
10. **Create the Sanity webhook** (sanity.io/manage → API → Webhooks):
    - URL: `https://<your-domain>/api/revalidate`
    - Trigger on: create, update, delete
    - Filter: `_type in ["siteSettings","homePage","projectsPage","aboutPage","contactPage","project","category","experience","education"]`
    - Projection: `{_type, "slug": slug.current}`
    - HTTP method: POST
    - Secret: the same value as `SANITY_REVALIDATE_SECRET`
11. **Test:** edit the home headline in `/studio`, publish, reload the live site within 10 seconds.

### Deploying elsewhere

Vercel runs this stack with zero configuration: import the repo, add the env vars, deploy. The webhook URL is the same. Do **not** set `output: 'export'`; a static export silently breaks `/api/revalidate`, `/studio` and cache revalidation.

### Hosting caveat

Self-hosted Next.js stores its page cache on the server's disk. If the host runs more than one instance, or wipes the disk on redeploy, a redeploy simply rebuilds from Sanity. Correctness is unaffected; at worst one instance serves slightly older content until the next webhook or redeploy.

## Content model

Five singletons hold page copy; four repeatable types hold projects, categories, experience and education. Required fields are enforced in the Studio; every image requires alt text; `heroHighlight` and each `highlight` must appear in their heading; list limits match the design (3 hero metrics, 4 stats, 3 pillars, and so on).

Optional fields hide their element when empty. There is no placeholder text on the live site: an empty metric list hides the row, an availability toggle that is off (the default) hides the badge and the contact-page card, a missing booking URL hides the "Prefer a call?" card, and an empty FAQ hides the accordion.

Case-study bodies are Portable Text with these custom blocks: section header, metric grid, card grid, process steps, highlight pair, spec table, image with caption, code. Seed project one uses every block; project two is prose only.

Icons come from a fixed list of `lucide-react` names (`sparkles`, `cpu`, `brain`, `layers`, `workflow`, `flask-conical`, `users`, `rocket`, `gauge`, `target`, `terminal`, `shield-check`, `graduation-cap`, `search`) mapped in `components/Icon.tsx`.

## Project structure

```
app/
  (site)/                 header, footer, fonts and MotionConfig live in its layout
    page.tsx              home
    projects/page.tsx     index with category filter (?category=) and bento grid
    projects/[slug]/      case study (generateStaticParams, notFound on unknown slug)
    about/page.tsx
    contact/page.tsx
    not-found.tsx         branded 404 (plus a catch-all route that triggers it)
  studio/[[...tool]]/     embedded Sanity Studio (force-static)
  api/revalidate/         Sanity webhook → revalidateTag(type, { expire: 0 })
  layout.tsx              html/body only
  globals.css             Tailwind v4 + @theme design tokens
  sitemap.ts, robots.ts   robots disallows /studio and /api
components/               Header, MobileMenu, Footer, ClosingCta, ProjectCard, ProjectsExplorer,
                          ContactForm, CopyEmail, Faq, PortableText, blocks/*, motion/*, Icon
sanity/
  schemaTypes/            documents/* and objects/* (one file per document; blocks in objects/blocks.ts)
  lib/                    client.ts, fetch.ts, queries.ts, image.ts, imageLoader.ts, seed.ts, types.ts
  structure.ts            singleton sidebar
seed/content.ndjson       placeholder content for `sanity dataset import`
sanity.config.ts, sanity.cli.ts, next.config.ts, eslint.config.mjs, postcss.config.mjs
```

## Design notes

- Tokens live in `app/globals.css` under `@theme`; there is no `tailwind.config.js`.
- Fonts (Plus Jakarta Sans, Inter, Space Grotesk) are self-hosted through `next/font/google`; no runtime Google request.
- Motion only runs in small client wrappers (`components/motion/*`), wrapped in `MotionConfig reducedMotion="user"`. Reduced-motion users get no animation, and the pulsing availability dot is turned off in CSS.
- Images use a custom `next/image` loader (`sanity/lib/imageLoader.ts`) so Sanity's CDN serves resized, `auto=format` images with the editor's hotspot and crop respected, plus an LQIP blur placeholder.
- The one gradient phrase per H1 comes from the `highlight` field; the rest of the headline stays plain.

## Acceptance checks run on this build

- `npm run build`, `npm run lint`, `npm run typecheck` pass with zero errors.
- All pages render with seed content and no images; unknown project slugs return a branded 404.
- `POST /api/revalidate` without a valid signature returns 401; GET returns 405.
- `robots.txt` blocks `/studio` and `/api`; `sitemap.xml` lists every project with `lastModified`.
- Category filter writes `?category=`, survives reload, and the bento layout holds for 1 and 3 results.
- Contact form shows inline validation errors linked with `aria-describedby`; copy-email announces through `aria-live`; the mobile menu traps focus, closes on Escape and returns focus to the button.
- Lighthouse (mobile, home page): Performance 93, Accessibility 100, Best Practices 100, SEO 100.
