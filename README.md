# Hudson Mathew: Portfolio

Static portfolio site with three Vercel serverless functions:

| Route | What it does | Needs |
|---|---|---|
| `/api/chat` | Huddy, the AI assistant (proxies Hero's AI) | `HEROS_API_KEY` |
| `/api/transcribe` | Voice input for Huddy | `HEROS_API_KEY` |
| `/api/contact` | Sends contact-form messages by email (Resend) | `RESEND_API_KEY` |

No build step and no npm dependencies.

## Run locally

```bash
cp .env.example .env   # then fill in the keys
npm run dev            # http://localhost:3000
```

`dev-server.mjs` serves the site, runs the `/api` functions with your `.env`, and applies the
same headers as production (from `vercel.json`), so CSP problems show up locally too.

## Deploy to Vercel

1. **Set your domain.** Find and replace `your-portfolio.vercel.app` in `index.html`,
   `robots.txt` and `sitemap.xml` with your real domain.
2. **Create the project.** Either push this folder to GitHub and import it at
   vercel.com/new, or run `npx vercel` in this folder. Framework preset: **Other**.
   Leave the build and output settings empty.
3. **Add environment variables** (Project → Settings → Environment Variables, for Production
   and Preview):
   - `HEROS_API_KEY`
   - `RESEND_API_KEY`
   - optional: `CONTACT_TO_EMAIL`, `CONTACT_FROM`
4. **Deploy**, then check: Huddy replies, the contact form delivers an email, and
   `/does-not-exist` shows the custom 404 page.

## Project notes

- `.vercelignore` keeps secrets, the Django `AI/` project, original PNGs (`My Photos/`,
  `images/*.png`) and local tooling out of the deployment.
- The site uses the optimised WebP images in `images/` and `photos/`. If you replace a
  screenshot, export it as WebP (about 1600px wide) and update the `width`/`height` in `index.html`.
- `_backup/` holds the pre-redesign HTML/CSS/JS (local only).
