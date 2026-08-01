import { spawn } from 'child_process';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsDir = join(__dirname, 'apps');

const colors = [
  '\x1b[36m', // Cyan
  '\x1b[32m', // Green
  '\x1b[33m', // Yellow
  '\x1b[34m', // Blue
  '\x1b[35m', // Magenta
  '\x1b[96m', // Light Cyan
  '\x1b[92m', // Light Green
  '\x1b[93m', // Light Yellow
  '\x1b[94m', // Light Blue
  '\x1b[95m', // Light Magenta
];
const resetColor = '\x1b[0m';

console.log('🚀 Starting AdGeco Microservices Ecosystem...');

try {
  const apps = readdirSync(appsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  apps.forEach((app, index) => {
    const appDir = join(appsDir, app);
    const pkgJsonPath = join(appDir, 'package.json');
    
    if (!existsSync(pkgJsonPath)) {
      console.log(`⚠️ Skipping ${app}: No package.json found`);
      return;
    }

    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
    const scripts = pkgJson.scripts || {};
    
    // Default to 'start' if 'dev' is not available
    const scriptToRun = scripts.dev ? 'dev' : (scripts.start ? 'start' : null);
    
    if (!scriptToRun) {
      console.log(`⚠️ Skipping ${app}: No 'dev' or 'start' script found`);
      return;
    }

    const color = colors[index % colors.length];
    const appPrefix = `${color}[${app}]${resetColor}`;
    
    console.log(`${appPrefix} Starting with 'pnpm run ${scriptToRun}'...`);

    const ports = {
      'api': 3001,
      'exchange-service': 3010,
      'measurement-service': 3011,
      'fraud-service': 3012,
      'ledger-service': 3013,
      'settlement-service': 3014,
      'notification-service': 3015,
      'reporting-service': 3016,
      'web': 3000
    };
    
    const env = { ...process.env };
    if (ports[app]) {
      env.PORT = ports[app].toString();
    }

    // Using shell: true is important on Windows for npm/pnpm scripts
    const child = spawn('pnpm', ['--filter', pkgJson.name, 'run', scriptToRun], {
      stdio: 'pipe',
      shell: true,
      cwd: __dirname,
      env
    });

    child.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.log(`${appPrefix} ${line}`);
        }
      });
    });

    child.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.error(`${appPrefix} (err): ${line}`);
        }
      });
    });

    child.on('close', (code) => {
      console.log(`${appPrefix} Exited with code ${code}`);
    });
  });

  console.log('\n✅ All services have been instructed to start! Wait for the logs to settle.\n');

} catch (err) {
  console.error('❌ Failed to start services:', err);
}
