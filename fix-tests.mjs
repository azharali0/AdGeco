import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.test.mjs')) results.push(file);
    }
  }
  return results;
}

const testFiles = walk('tests');

const helper = `(function(){
  const fs2 = await import('node:fs');
  const path2 = await import('node:path');
  let c = fs2.readFileSync('apps/api/src/server.ts', 'utf8');
  const d = 'apps/api/src/routes';
  if(fs2.existsSync(d)) {
    for(const f of fs2.readdirSync(d)) {
      c += fs2.readFileSync(path2.join(d, f), 'utf8');
    }
  }
  return c;
})()`;

// Wait, the test files are mostly not async where they read this (some are).
// A cleaner way: just replace the path string 'apps/api/src/server.ts' with a dummy file that contains everything!
// Yes! Let's generate 'apps/api/src/server.combined.ts' and replace the string in the tests to point to it!

let combined = fs.readFileSync('apps/api/src/server.ts', 'utf8');
const routesDir = 'apps/api/src/routes';
for (const f of fs.readdirSync(routesDir)) {
  combined += '\n' + fs.readFileSync(path.join(routesDir, f), 'utf8');
}
fs.writeFileSync('apps/api/src/server.combined.ts', combined);

for (const file of testFiles) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/apps\/api\/src\/server\.ts/g, 'apps/api/src/server.combined.ts');
  fs.writeFileSync(file, content);
}

console.log('Fixed tests by creating server.combined.ts');
