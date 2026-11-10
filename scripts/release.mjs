#!/usr/bin/env node
// Publishes the built package as a tagged commit on the `release` branch, so
// another project can install it straight from GitHub:
//
//   "lime-bike-simulator": "github:MattieTK/lime-bike-sim#v2.0.0"
//
// Tags point at release commits rather than source commits for two reasons.
// The release commit holds only what a consumer needs (dist/, README and a
// package.json), and that package.json has no scripts: npm reacts to a `build`
// script in a git dependency by installing all of its devDependencies first,
// which would add Vite, Vitest and the rest to every install of the consumer.
//
// Usage: bump "version" in package.json, commit, then `npm run release`.

import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const git = (args, cwd = root) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tag = `v${pkg.version}`;

if (git(['status', '--porcelain'])) fail('Commit or discard your changes first, so the release matches a commit.');
if (git(['tag', '--list', tag])) fail(`${tag} already exists. Bump "version" in package.json.`);

// Use the local release branch, or pick it up from origin in a fresh clone.
if (!git(['branch', '--list', 'release'])) {
  try {
    git(['fetch', 'origin', 'release:release']);
  } catch {
    fail('There is no release branch locally or on origin.');
  }
}

execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });

const source = git(['rev-parse', 'HEAD']);
const work = mkdtempSync(join(tmpdir(), 'lime-release-'));
git(['worktree', 'add', work, 'release']);
try {
  for (const entry of readdirSync(work)) {
    if (entry !== '.git') rmSync(join(work, entry), { recursive: true });
  }
  cpSync(join(root, 'dist'), join(work, 'dist'), { recursive: true });
  cpSync(join(root, 'README.md'), join(work, 'README.md'));

  // Everything the built files import is bundled apart from React, so the
  // published manifest needs no scripts and no devDependencies.
  const { scripts, devDependencies, ...manifest } = pkg;
  writeFileSync(join(work, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');

  git(['add', '--all'], work);
  git(['commit', '--message', `${tag}\n\nBuilt from ${source}`], work);
  git(['tag', tag], work);
} finally {
  git(['worktree', 'remove', '--force', work]);
}

console.log(`\nCreated ${tag} on the release branch. Publish it with:\n\n  git push origin release ${tag}\n`);
