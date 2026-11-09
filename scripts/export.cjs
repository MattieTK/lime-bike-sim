const fs = require('fs');
const path = require('path');

const dest = process.argv[2];
if (!dest) {
  console.log('Usage: npm run export /path/to/dest');
  process.exit(1);
}

const distDir = path.join(__dirname, '..', 'dist');
const destDir = path.resolve(dest);

// Clean old JS/CSS/d.ts files from destination (keep JSON data files)
if (fs.existsSync(destDir)) {
  const existingFiles = fs.readdirSync(destDir);
  existingFiles.forEach(f => {
    if (f.endsWith('.js') || f.endsWith('.css') || f.endsWith('.d.ts')) {
      fs.unlinkSync(path.join(destDir, f));
      console.log(`  Cleaned ${f}`);
    }
  });
}

// Create destination directory
fs.mkdirSync(destDir, { recursive: true });

// Get all JS files (including chunks with hashes)
const files = fs.readdirSync(distDir);
const jsFiles = files.filter(f => f.endsWith('.js'));
const cssFiles = files.filter(f => f.endsWith('.css'));
const dtsFiles = ['ssr-safe.d.ts', 'index.d.ts'];

// Copy all JS files
jsFiles.forEach(f => {
  fs.copyFileSync(path.join(distDir, f), path.join(destDir, f));
  console.log(`  Copied ${f}`);
});

// Copy CSS
cssFiles.forEach(f => {
  fs.copyFileSync(path.join(distDir, f), path.join(destDir, f));
  console.log(`  Copied ${f}`);
});

// Copy type definitions
dtsFiles.forEach(f => {
  const src = path.join(distDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(destDir, f));
    console.log(`  Copied ${f}`);
  }
});

console.log(`\nExported to ${destDir}`);
console.log(`\nUsage in Astro:`);
console.log(`  import { LimeBikeSimulator } from './${path.basename(destDir)}/ssr-safe.js';`);
console.log(`  import './${path.basename(destDir)}/style.css';`);
console.log(`\n  <LimeBikeSimulator client:only="react" height={500} />`);
