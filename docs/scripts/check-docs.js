#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const docsRoot = path.resolve(__dirname, '..');
const frameworkRoot = path.resolve(docsRoot, '..');
const config = JSON.parse(fs.readFileSync(path.join(docsRoot, 'docs.json'), 'utf8'));
const failures = [];
const pagePath = (page) => path.join(docsRoot, `${page}.mdx`);

for (const group of config.navigation.groups || []) {
  for (const page of group.pages || []) {
    if (!fs.existsSync(pagePath(page))) failures.push(`Navigation page is missing: ${page}.mdx`);
  }
}

const inventory = JSON.parse(fs.readFileSync(path.join(docsRoot, 'reference', 'api-inventory.json'), 'utf8'));
for (const entry of inventory) {
  if (entry.status !== 'stable') continue;
  if (!fs.existsSync(path.join(frameworkRoot, entry.source))) failures.push(`Inventory source is missing for ${entry.symbol}: ${entry.source}`);
  const referencePage = pagePath(entry.page);
  if (!fs.existsSync(referencePage)) {
    failures.push(`Inventory page is missing for ${entry.symbol}: ${entry.page}.mdx`);
  } else if (!fs.readFileSync(referencePage, 'utf8').toLowerCase().includes(entry.symbol.toLowerCase())) {
    failures.push(`Inventory symbol is not documented: ${entry.symbol} (${entry.page}.mdx)`);
  }
}

function walk(directory, extension, output = []) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, item.name);
    if (item.isDirectory()) walk(full, extension, output);
    if (item.isFile() && full.endsWith(extension)) output.push(full);
  }
  return output;
}

const luaFiles = walk(path.join(docsRoot, 'examples', 'basic-rotation'), '.lua');
const luac = process.env.LUAC || 'luac';
try {
  execFileSync(luac, ['-v'], { stdio: 'ignore' });
  for (const file of luaFiles) execFileSync(luac, ['-p', file], { stdio: 'pipe' });
} catch (error) {
  if (error.code === 'ENOENT') console.warn(`${luac} is unavailable; skipped Lua syntax validation.`);
  else failures.push(`Lua syntax validation failed: ${error.stderr?.toString() || error.message}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Warden docs check passed (${inventory.length} stable API inventory entries, ${luaFiles.length} Lua examples).`);
