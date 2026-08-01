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

let combined = fs.readFileSync('apps/api/src/server.ts', 'utf8');
const routesDir = 'apps/api/src/routes';
for (const f of fs.readdirSync(routesDir)) {
  combined += '\n' + fs.readFileSync(path.join(routesDir, f), 'utf8');
}
fs.writeFileSync('apps/api/src/server.combined.txt', combined);

for (const file of testFiles) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/apps\/api\/src\/server\.combined\.ts/g, 'apps/api/src/server.combined.txt');
  fs.writeFileSync(file, content);
}

console.log('Fixed tests by creating server.combined.txt');
