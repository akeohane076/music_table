#!/usr/bin/env node
// Pulls raw style values out of the take-home Figma file and reports them by
// frequency, so the most-used values become the design tokens.
//
//   node scripts/extract-figma-tokens.mjs [fileKey]
//
// Needs FIGMA_TOKEN in .env.local. Create one at
// https://www.figma.com/developers/api#access-tokens with the "File content" read scope.

import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_FILE_KEY = 'zfbbcBpUe0LCchk6k4yKJK';

function loadEnv() {
  try {
    for (const line of readFileSync(join(root, '.env.local'), 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (m) process.env[m[1]] ??= m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch {
    /* no .env.local — fall back to the ambient environment */
  }
}

const hex = (c) =>
  '#' +
  ['r', 'g', 'b']
    .map((k) => Math.round((c[k] ?? 0) * 255).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

const solid = (paint) => {
  if (!paint || paint.type !== 'SOLID' || paint.visible === false) return null;
  const a = (paint.opacity ?? 1) * (paint.color?.a ?? 1);
  return a >= 0.999 ? hex(paint.color) : `${hex(paint.color)} / ${a.toFixed(2)}`;
};

// Every bucket maps a formatted value -> {count, where: Set(node names)}
const buckets = {
  fill: new Map(),
  stroke: new Map(),
  text: new Map(),
  radius: new Map(),
  shadow: new Map(),
  gap: new Map(),
  padding: new Map(),
};

function tally(bucket, value, nodeName) {
  if (value == null) return;
  const key = String(value);
  const entry = buckets[bucket].get(key) ?? {count: 0, where: new Set()};
  entry.count += 1;
  if (entry.where.size < 6 && nodeName) entry.where.add(nodeName);
  buckets[bucket].set(key, entry);
}

function walk(node, depth = 0) {
  // Hidden nodes are layout scaffolding the designer left in the file — their
  // colors and radii are not part of the design and must not become tokens.
  if (node.visible === false) return;

  const name = node.name;

  for (const p of node.fills ?? []) tally('fill', solid(p), name);
  for (const p of node.strokes ?? []) {
    const c = solid(p);
    if (c) tally('stroke', `${c}  ${node.strokeWeight ?? 1}px`, name);
  }

  if (node.type === 'TEXT' && node.style) {
    const s = node.style;
    const lh = s.lineHeightPx ? `${Math.round(s.lineHeightPx)}px` : 'auto';
    const ls = s.letterSpacing ? ` ls:${s.letterSpacing.toFixed(2)}` : '';
    tally('text', `${s.fontFamily} ${s.fontWeight} ${s.fontSize}px/${lh}${ls}`, name);
  }

  if (typeof node.cornerRadius === 'number') tally('radius', `${node.cornerRadius}px`, name);
  else if (node.rectangleCornerRadii) tally('radius', node.rectangleCornerRadii.join(' ') + 'px', name);

  for (const e of node.effects ?? []) {
    if (e.visible === false) continue;
    if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
      const {x = 0, y = 0} = e.offset ?? {};
      const inner = e.type === 'INNER_SHADOW' ? 'inset ' : '';
      tally('shadow', `${inner}${x} ${y} ${e.radius ?? 0} ${e.spread ?? 0}  ${hex(e.color)} / ${(e.color?.a ?? 1).toFixed(2)}`, name);
    }
  }

  if (node.itemSpacing) tally('gap', `${node.itemSpacing}px`, name);
  const pad = [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft];
  if (pad.some((v) => v)) tally('padding', pad.map((v) => v ?? 0).join(' ') + 'px', name);

  for (const child of node.children ?? []) walk(child, depth + 1);
}

const LABELS = {
  fill: 'FILL COLORS',
  stroke: 'STROKE COLORS (color + weight)',
  text: 'TEXT STYLES (family weight size/lineHeight)',
  radius: 'CORNER RADII',
  shadow: 'SHADOWS (x y blur spread color)',
  gap: 'AUTO-LAYOUT GAPS',
  padding: 'AUTO-LAYOUT PADDING (t r b l)',
};

function report() {
  for (const [bucket, label] of Object.entries(LABELS)) {
    const rows = [...buckets[bucket]].sort((a, b) => b[1].count - a[1].count);
    console.log(`\n\x1b[1m${label}\x1b[0m  (${rows.length} distinct)`);
    if (!rows.length) {
      console.log('  —');
      continue;
    }
    for (const [value, {count, where}] of rows) {
      console.log(`  ${String(count).padStart(4)}x  ${value.padEnd(38)}  ${[...where].join(', ')}`);
    }
  }
}

async function main() {
  loadEnv();
  const token = process.env.FIGMA_TOKEN;
  const fileKey = process.argv[2] || process.env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY;

  if (!token) {
    console.error(
      'Missing FIGMA_TOKEN.\n' +
        'Add it to music_table/.env.local as:  FIGMA_TOKEN=figd_...\n' +
        'Create one at https://www.figma.com/developers/api#access-tokens (scope: File content — read).',
    );
    process.exit(1);
  }

  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: {'X-Figma-Token': token},
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`Figma API ${res.status} ${res.statusText}\n${body.slice(0, 400)}`);
    if (res.status === 403) {
      console.error(
        '\n403 usually means either the token lacks the "File content" read scope,\n' +
          'or your account cannot open this file. Fix: open the Figma link in the browser,\n' +
          'duplicate it to your drafts, and re-run with the new file key from that URL:\n' +
          '  node scripts/extract-figma-tokens.mjs <newFileKey>',
      );
    }
    process.exit(1);
  }

  const file = await res.json();
  console.log(`\nFile: ${file.name}   (last modified ${file.lastModified})`);
  walk(file.document);
  report();

  mkdirSync(join(root, '.figma-cache'), {recursive: true});
  const out = join(root, '.figma-cache', 'raw.json');
  writeFileSync(out, JSON.stringify(file, null, 2));
  console.log(`\nRaw document written to ${out} (gitignored) for follow-up queries.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
