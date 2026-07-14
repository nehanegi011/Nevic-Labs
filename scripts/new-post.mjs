#!/usr/bin/env node
/**
 * Scaffold a new blog post.
 * Usage:  node scripts/new-post.mjs "Title of the post" "Category" c3
 *
 * - Appends the new post to data/posts.json
 * - Writes blog/posts/<slug>.html from the template
 * - Regenerates blog/index.html so the new card appears
 *
 * The generated HTML file contains only the article body; header/footer/CSS
 * come from the shared shell so all posts stay visually consistent.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const [,, title, category = 'Field Notes', cover = 'c1'] = process.argv;
if (!title) {
  console.error('Usage: node scripts/new-post.mjs "Title" "Category" c1..c7');
  process.exit(1);
}

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const today = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();

const postsPath = path.join(ROOT, 'data/posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
if (posts.find(p => p.slug === slug)) { console.error('Slug already exists:', slug); process.exit(1); }

const newPost = {
  slug, title, cat: category, cover,
  excerpt: 'Short one-line summary of the post shown on the blog index card.',
  paragraphs: [
    'Write your opening paragraph here — one clear thought per line.',
    'Add as many paragraphs as you like. Each string in this array becomes one <p>.',
    'Wrap terms you want emphasised in <b>...</b>; links use <a href="...">...</a>.'
  ],
  readtime: '5 MIN READ',
  date: today
};

posts.unshift(newPost);
fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

// Emit a stub HTML file. To regenerate the full styled version + blog index,
// run: node scripts/build.mjs   (see README §Build)
const stub = `<!-- Auto-generated stub. Run \`node scripts/build.mjs\` to render the styled page. -->
<!-- slug: ${slug} -->\n<!-- Edit the paragraphs array in data/posts.json, then rebuild. -->\n`;
fs.writeFileSync(path.join(ROOT, `blog/posts/${slug}.html`), stub);

console.log('Created draft post:', slug);
console.log('Next steps:');
console.log('  1. Edit data/posts.json — flesh out excerpt + paragraphs for slug "' + slug + '"');
console.log('  2. Run: node scripts/build.mjs   (rebuilds blog index + all post pages)');
