#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')

const ignoreDirs = new Set(['node_modules', '.git', 'react-app'])

function walk(dir){
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const e of entries){
    if (e.isDirectory()){
      if (ignoreDirs.has(e.name)) continue
      files = files.concat(walk(path.join(dir, e.name)))
    } else if (e.isFile() && e.name.endsWith('.html')){
      files.push(path.join(dir, e.name))
    }
  }
  return files
}

if (!fs.existsSync(SRC)) fs.mkdirSync(SRC, { recursive: true })

const files = walk(ROOT)
for (const f of files){
  // skip files already under src
  if (f.startsWith(SRC)) continue
  // compute relative path from ROOT
  const rel = path.relative(ROOT, f)
  const dest = path.join(SRC, rel)
  const destDir = path.dirname(dest)
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
  fs.renameSync(f, dest)
  console.log('Moved', rel, '->', path.relative(ROOT, dest))
}

console.log('Done moving HTML files to src/.')
