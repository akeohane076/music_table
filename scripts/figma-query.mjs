#!/usr/bin/env node
// Ad-hoc structural queries against the cached Figma document.
//
//   node scripts/figma-query.mjs tree "<frame name>"   # indented tree with sizes
//   node scripts/figma-query.mjs find "<node name>"    # every node matching, with geometry

import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = JSON.parse(readFileSync(join(root, '.figma-cache', 'raw.json'), 'utf8'));

const hex = (c) =>
  '#' + ['r', 'g', 'b'].map((k) => Math.round((c[k] ?? 0) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();

const box = (n) => {
  const b = n.absoluteBoundingBox;
  return b ? `${Math.round(b.width)}x${Math.round(b.height)} @${Math.round(b.x)},${Math.round(b.y)}` : '';
};

const style = (n) => {
  const bits = [];
  const f = (n.fills ?? []).find((p) => p.type === 'SOLID' && p.visible !== false);
  if (f) bits.push(`fill:${hex(f.color)}${(f.opacity ?? 1) < 1 ? `@${f.opacity}` : ''}`);
  const s = (n.strokes ?? []).find((p) => p.type === 'SOLID' && p.visible !== false);
  if (s) bits.push(`stroke:${hex(s.color)}/${n.strokeWeight ?? 1}`);
  if (typeof n.cornerRadius === 'number' && n.cornerRadius) bits.push(`r:${n.cornerRadius}`);
  if (n.visible === false) bits.push('HIDDEN');
  if (n.opacity != null && n.opacity < 1) bits.push(`opacity:${n.opacity}`);
  if (n.style?.fontSize) bits.push(`${n.style.fontFamily} ${n.style.fontWeight} ${n.style.fontSize}px`);
  if (n.characters) bits.push(JSON.stringify(n.characters.slice(0, 40)));
  return bits.join(' ');
};

function* walk(node, depth = 0, parentHidden = false) {
  const hidden = parentHidden || node.visible === false;
  yield {node, depth, hidden};
  for (const c of node.children ?? []) yield* walk(c, depth + 1, hidden);
}

const [cmd, arg] = process.argv.slice(2);

if (cmd === 'tree') {
  // Several frames share the name "Songs"; a trailing index picks between them.
  const index = Number(process.argv[4] ?? 0);
  const matches = [...walk(file.document)].filter(({node}) => node.name === arg);
  const target = matches[index];
  if (!target) {
    console.error(`No node named ${JSON.stringify(arg)} at index ${index} (${matches.length} match).`);
    process.exit(1);
  }
  for (const {node, depth, hidden} of walk(target.node)) {
    if (hidden) continue;
    console.log(`${'  '.repeat(depth)}${node.type} "${node.name}"  ${box(node)}  ${style(node)}`);
  }
} else if (cmd === 'find') {
  for (const {node, hidden} of walk(file.document)) {
    if (!node.name.toLowerCase().includes(arg.toLowerCase())) continue;
    console.log(`${hidden ? '[hidden] ' : ''}${node.type} "${node.name}"  ${box(node)}  ${style(node)}`);
  }
} else {
  console.error('usage: figma-query.mjs tree|find <name>');
  process.exit(1);
}
