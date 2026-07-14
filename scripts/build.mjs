#!/usr/bin/env node
/**
 * Build blog/index.html and every blog/posts/<slug>.html from data/posts.json.
 * Run whenever you edit posts.json or add a post via new-post.mjs.
 *
 * Static pages outside /blog (index, solutions, products, etc.) are hand-authored
 * HTML — this script does not touch them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const posts = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src', 'data', 'posts.json'), 'utf8')
);

const NAV = [
  ['solutions.html','Solutions','solutions'],
  ['products.html','Products','products'],
  ['blog/index.html','Blog','blog'],
  ['about.html','About Us','about'],
  ['careers.html','Careers','careers'],
  ['faq.html','FAQ','faq'],
  ['contact.html','Contact','contact'],
];

const head = (title, desc, rel) => `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${desc}">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${title} · Nevic Labs</title>
<link rel="icon" href="${rel}assets/img/nevic-logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${rel}assets/css/main.css">
</head><body>`;

const header = (active, rel) => {
  const links = NAV.map(([h,l,k]) => `<a href="${rel}${h}"${k===active?' class="active"':''}>${l}</a>`).join('');
  return `<header class="nav"><div class="wrap nav-in">
    <a href="${rel}index.html" class="brand"><span class="brand-logo"><img src="${rel}assets/img/nevic-logo.png" alt="Nevic Labs"></span></a>
    <nav class="nav-links" id="links">${links}</nav>
    <div class="nav-r"><a href="${rel}contact.html" class="btn btn-primary hide-sm">Book a demo</a><button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button></div>
  </div></header>`;
};

const footer = rel => `<footer><div class="wrap"><div class="fgrid">
  <div class="fbrand"><span class="b"><img src="${rel}assets/img/nevic-logo.png" alt=""><span>Nevic Labs</span></span><p>Elevating experiences across Indian healthcare — one clinic, one conversation, one thread at a time.</p></div>
  <div><h5>Product</h5><a href="${rel}products.html">Nevic Connect</a><a href="${rel}products.html">Nevic Pulse</a><a href="${rel}solutions.html">Solutions</a><a href="${rel}faq.html">FAQ</a></div>
  <div><h5>Company</h5><a href="${rel}team.html">Team</a><a href="${rel}careers.html">Careers</a><a href="${rel}blog/index.html">Blog</a><a href="${rel}contact.html">Contact</a></div>
  <div><h5>Legal</h5><a href="${rel}privacy.html">Privacy Policy</a></div>
  <div><h5>Contact</h5><a href="mailto:hello@neviclabs.in">hello@neviclabs.in</a><a href="${rel}contact.html">Book a demo</a></div>
</div><div class="fbot"><span>© 2026 NEVIC LABS PRIVATE LIMITED · PUNE, INDIA</span><span>MADE IN INDIA · FOR INDIA'S CLINICS</span></div></div></footer>
<script src="${rel}assets/js/main.js"></script></body></html>`;

const pageHero = (eyebrow, title, sub, crumbs) => `<section class="page-hero"><div class="wrap">
  ${crumbs?`<div class="crumbs">${crumbs}</div>`:''}
  <span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}
</div></section>`;

// Blog index
const cards = posts.map(p => `<a class="post" href="posts/${p.slug}.html">
  <div class="post-cover ${p.cover}"><span class="cat">${p.cat}</span></div>
  <div class="post-body"><h3>${p.title}</h3><p>${p.excerpt}</p>
    <div class="post-more">Read the full post →</div>
    <div class="post-meta"><span>${p.readtime}</span><span>${p.date}</span></div>
  </div></a>`).join('');

fs.writeFileSync(path.join(ROOT, 'blog/index.html'),
  head('Blog · Field notes','Practical writing on patient engagement and clinic operations.','../')
  + header('blog','../')
  + pageHero('Blog · Field notes','Ideas from the frontline of <em>Indian healthcare</em>.','','<a href="../index.html">Home</a> / Blog')
  + `<section class="section"><div class="wrap"><div class="blog-grid reveal">${cards}</div></div></section>`
  + footer('../'));

// Each post page
for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  const body = p.paragraphs.map(t => `<p>${t}</p>`).join('\n');
  const related = posts.filter(x => x.slug !== p.slug).slice(0, 3).map(x => `
    <a class="post" href="${x.slug}.html">
      <div class="post-cover ${x.cover}"><span class="cat">${x.cat}</span></div>
      <div class="post-body"><h3>${x.title}</h3><p>${x.excerpt}</p></div>
    </a>`).join('');

  fs.writeFileSync(path.join(ROOT, `blog/posts/${p.slug}.html`),
    head(p.title, p.excerpt, '../../')
    + header('blog','../../')
    + `<article class="article">
        <div class="crumbs" style="margin-bottom:14px;color:var(--ink-2)"><a href="../../index.html" style="color:var(--ink-2)">Home</a> / <a href="../index.html" style="color:var(--ink-2)">Blog</a> / ${p.cat}</div>
        <div class="cover ${p.cover}"></div>
        <div class="amet"><span class="cat">${p.cat}</span><span>${p.readtime}</span><span>${p.date}</span></div>
        <h1>${p.title}</h1><div class="body">${body}</div>
        <a class="backlink" href="../index.html">← Back to all posts</a>
      </article>
      <section class="related"><div class="wrap">
        <div class="head" style="margin-bottom:32px"><span class="eyebrow">Keep reading</span><h2 style="font-size:32px">More field notes</h2></div>
        <div class="blog-grid">${related}</div>
      </div></section>`
    + footer('../../'));
}

console.log(`Built blog index + ${posts.length} post pages.`);
