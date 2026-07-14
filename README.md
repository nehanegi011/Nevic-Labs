# Nevic Labs — Static Site

Multi-page static website for Nevic Labs. Each topic is its own HTML file. Blog posts live in `blog/posts/`, driven by `data/posts.json`. No server runtime, no framework, no client bundler.

---

## Folder structure

```
nevic-site/
├── index.html              ← home (hero, about, solutions preview, CTA)
├── solutions.html          ← 6 solution areas
├── products.html           ← Nevic One platform + Pulse + Connect + Reports
├── team.html               ← founder cards
├── careers.html            ← open roles
├── faq.html                ← FAQ accordion
├── contact.html            ← contact + demo form
├── privacy.html            ← privacy policy / legal
│
├── blog/
│   ├── index.html          ← blog listing (generated)
│   └── posts/              ← one file per post (generated)
│       ├── a-field-guide-to-going-digital-in-a-busy-opd.html
│       ├── the-front-desk-playbook-we-wish-every-clinic-had.html
│       └── ... (7 more)
│
├── assets/
│   ├── css/main.css        ← ALL styles (single stylesheet)
│   ├── js/main.js          ← nav toggle, reveal-on-scroll, form
│   └── img/
│       ├── nevic-logo.png
│       ├── pulse-day.png
│       ├── pulse-reports.png
│       ├── sunrise-hospital.gif           (drop-in — see “Missing assets”)
│       └── sunrise-hospital-english_only.gif
│
├── data/
│   └── posts.json          ← source of truth for blog content
│
└── scripts/
    ├── new-post.mjs        ← scaffold a new post
    └── build.mjs           ← regenerate blog index + post pages from posts.json
```

---

## Editing content

| I want to change… | Edit this |
| --- | --- |
| Home hero copy | `index.html` |
| Solution cards | `solutions.html` (and the copy in `index.html` if you also want it on home) |
| Product feature bullets | `products.html` |
| Team bios | `team.html` |
| Open roles | `careers.html` |
| FAQ Q&A | `faq.html` |
| Contact info / form | `contact.html` |
| Privacy policy | `privacy.html` |
| Any blog post body | `data/posts.json` → run `node scripts/build.mjs` |
| Nav links, logo, footer | edit the header/footer blocks in each HTML file **OR** in `scripts/build.mjs` if you want to regenerate blog pages |
| Colors / spacing / typography | `assets/css/main.css` (design tokens are the `--var` block at the top) |

---

## Adding a new blog post

```bash
cd nevic-site
node scripts/new-post.mjs "Why on-time OPDs matter" "Operations" c2
# then open data/posts.json, edit paragraphs / excerpt for the new slug
node scripts/build.mjs
```

`cover` is one of `c1`…`c7` (gradient colour keys defined in `main.css`). Every post inherits the same shell, so styling stays consistent forever.

Cover images are pure CSS gradients — no image files needed per post. If you later want photographic covers, add a `coverImage` field to each post record and adjust `.post-cover` in `main.css`.

---

## Suggested project structure & operating conventions

This is the layout the project already follows; the reasoning behind it is below.

**Maintainable**
- **One CSS file, tokenised.** All colours, spacing, typography live in `:root` at the top of `main.css`. Change a token, the whole site updates.
- **Blog content is data, not markup.** `posts.json` is the source of truth. The HTML files under `blog/posts/` are generated — never hand-edit them; edit JSON and rebuild.
- **Shared header/footer are duplicated on purpose.** Static sites without a runtime template engine trade a small duplication cost for zero build/deploy complexity. If duplication ever hurts, the `build.mjs` template functions can be extended to regenerate the top-level pages too — the shell (`head`/`header`/`footer` helpers) is already there.

**Scalable**
- **New topic → new HTML file** (e.g. `pricing.html`, `case-studies.html`). Copy the closest existing page as the starting shell, add its link to the `NAV` array in `scripts/build.mjs` and to the nav in each hand-authored file.
- **New blog category → new gradient class** in `main.css` (`.post-cover.c8 { … }`) and reference it from `posts.json`.
- **Case studies / customer stories** can follow the exact same pattern as blog: `data/customers.json` + `scripts/build-customers.mjs` + `customers/<slug>.html`.
- **When traffic grows** and this repo needs a CMS, the cleanest migration path is to a static site generator that reads the same `data/*.json` — 11ty, Astro or Hugo. Because content is already separated from markup, the port is mostly a template rewrite, not a content migration.

**Secure**
- **No third-party scripts.** No analytics, no ad pixels, no chat widgets. Every `<script>` in the site is your own code from `assets/js/`.
- **Security headers to set at the hosting layer** (Cloudflare Pages / Netlify / S3+CloudFront `_headers` file, or nginx):
    - `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'`
    - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
    - `X-Content-Type-Options: nosniff` (also set as a meta tag in every page)
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- **Contact form is client-side only** in this build — it validates and shows a thank-you but does not POST anywhere. Point it at your own backend (Cloudflare Worker, small API, or a form service you host). Never wire it to a third party that receives raw patient data.
- **Input hardening on the form.** All fields have `maxlength`, `autocomplete="off"` on the form, `type="email"`/`type="tel"` where relevant. Server-side validate again — never trust the client.
- **CSP-friendly by design.** No inline event handlers (`onclick=`), no `eval`, no dynamic script injection. All JS is in `assets/js/main.js`.
- **Data separation.** No patient data ever touches this repo. This site is the marketing shell; the product handles patient data behind auth.
- **Fonts** load from Google Fonts. If you want zero third-party requests, self-host the WOFF2 files under `assets/fonts/` and remove the `<link>` tags.

**Deployment**
- Any static host works. Recommended: **Cloudflare Pages** or **Netlify** — free HTTPS, automatic deploys from git, easy header rules.
- CI: on push to `main`, run `node scripts/build.mjs` then upload the folder. That's the entire build.
- Backups: the whole site is in git. Content backups = `data/posts.json` history.

---

## Missing assets to drop in

Two demo GIFs are referenced but not yet present:
- `assets/img/sunrise-hospital.gif`         — the desktop/tablet 3-language WhatsApp booking demo
- `assets/img/sunrise-hospital-english_only.gif` — the mobile version

Both already exist in your project root as loose files — copy them into `assets/img/`, or update the paths in `products.html`. The pages degrade gracefully (hidden) if the files are missing.

---

## Local preview

```bash
cd nevic-site
python3 -m http.server 8000
# then open http://localhost:8000/
```

Do **not** open the HTML files directly via `file://` — relative asset paths work but some browsers restrict local fetches.
