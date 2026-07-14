#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const partialPath = path.join(ROOT, 'partials', 'nav.html');
if (!fs.existsSync(partialPath)) {
  console.error('partials/nav.html not found.');
  process.exit(1);
}
const partial = fs.readFileSync(partialPath, 'utf8').trim();

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
for (const f of files) {
  const p = path.join(ROOT, f);
  if (f.startsWith('blog') || f === '404.html') continue;
  let src = fs.readFileSync(p, 'utf8');
  const headerStart = src.indexOf('<header');
  const headerEnd = src.indexOf('</header>');
  if (headerStart !== -1 && headerEnd !== -1 && headerEnd > headerStart) {
    const before = src.slice(0, headerStart);
    const after = src.slice(headerEnd + '</header>'.length);
    const newContent = before + partial + '\n' + after;
    fs.writeFileSync(p, newContent, 'utf8');
    console.log('Updated header in', f);
  } else {
    console.log('No header block found in', f);
  }
}

console.log('Done.');
