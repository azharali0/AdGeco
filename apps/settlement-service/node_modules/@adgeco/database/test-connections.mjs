import { PrismaClient } from '@prisma/client';
import tls from 'tls';

const dbUrl = process.env.DATABASE_URL;
const redisUrl = process.env.REDIS_URL;

async function testPostgres() {
  console.log("Testing PostgreSQL (Neon)...");
  if (!dbUrl) {
    console.error("❌ DATABASE_URL is missing!");
    return;
  }
  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ PostgreSQL connection successful!");
    console.log("✅ Prisma Client is communicating with the database perfectly.");
  } catch (e) {
    console.error("❌ PostgreSQL connection failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function testRedis() {
  console.log("\nTesting Redis (Upstash)...");
  if (!redisUrl) {
    console.error("❌ REDIS_URL is missing!");
    return;
  }
  
  try {
    const url = new URL(redisUrl);
    const host = url.hostname;
    const port = url.port || 6379;
    const pass = url.password;
    const user = url.username || 'default';

    return new Promise((resolve) => {
      const socket = tls.connect({ host, port: Number(port) }, () => {
        console.log(`✅ Redis TLS socket connected to ${host}:${port}!`);
        if (pass) {
          socket.write(`AUTH ${user} ${pass}\r\n`);
        } else {
          socket.write(`PING\r\n`);
        }
      });

      socket.on('data', (data) => {
        const response = data.toString().trim();
        if (response === '+OK') {
          console.log("✅ Redis authentication successful!");
          socket.write(`PING\r\n`);
        } else if (response === '+PONG') {
          console.log("✅ Redis PING/PONG successful!");
          socket.end();
          resolve();
        } else if (response.startsWith('-ERR') || response.startsWith('-WRONGPASS')) {
          console.error("❌ Redis error:", response);
          socket.end();
          resolve();
        }
      });

      socket.on('error', (err) => {
        console.error("❌ Redis connection failed:", err.message);
        resolve();
      });
      
      socket.setTimeout(5000, () => {
         console.error("❌ Redis connection timed out.");
         socket.end();
         resolve();
      });
    });
  } catch (err) {
    console.error("❌ Failed to parse REDIS_URL:", err.message);
  }
}

async function run() {
  await testPostgres();
  await testRedis();
}

run();
