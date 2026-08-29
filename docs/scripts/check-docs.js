#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const docsRoot = path.resolve(__dirname, '..');
const configuredFrameworkRoot = process.env.WARDEN_FRAMEWORK_ROOT;
const frameworkRoot = configuredFrameworkRoot
  ? path.resolve(configuredFrameworkRoot)
  : path.resolve(docsRoot, '..', '..', 'LRrotations');
const config = JSON.parse(fs.readFileSync(path.join(docsRoot, 'docs.json'), 'utf8'));
const failures = [];
const pagePath = (page) => path.join(docsRoot, `${page}.mdx`);

for (const group of config.navigation.groups || []) {
  for (const page of group.pages || []) {
    if (!fs.existsSync(pagePath(page))) failures.push(`Navigation page is missing: ${page}.mdx`);
  }
}

const inventory = JSON.parse(fs.readFileSync(path.join(docsRoot, 'reference', 'api-inventory.json'), 'utf8'));
const inventorySymbols = new Set();
for (const entry of inventory) {
  if (entry.status !== 'stable') continue;
  if (inventorySymbols.has(entry.symbol)) failures.push(`Duplicate inventory symbol: ${entry.symbol}`);
  inventorySymbols.add(entry.symbol);
  const sourcePath = path.join(frameworkRoot, entry.source);
  if (!fs.existsSync(sourcePath)) {
    failures.push(`Inventory source is missing for ${entry.symbol}: ${entry.source}`);
  } else {
    const source = fs.readFileSync(sourcePath, 'utf8').toLowerCase();
    const symbolTail = entry.symbol.split(/[.:]/).pop().toLowerCase();
    if (!source.includes(symbolTail)) {
      failures.push(`Inventory symbol was not found in source: ${entry.symbol} (${entry.source})`);
    }
  }
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
