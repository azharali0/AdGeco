import fs from 'fs';
import path from 'path';

const serverContent = fs.readFileSync('apps/api/src/server.ts', 'utf-8');
const lines = serverContent.split('\n'); // 0-indexed

// In server.ts, 1-indexed lines correspond to index = line - 1
const getLines = (start, end) => lines.slice(start - 1, end).join('\n');

const imports = getLines(1, 11);
const setupHooks = getLines(12, 18);
const sharedBlock = getLines(20, 38)
  .replace(/const email=/g, 'export const email=')
  .replace(/const role=/g, 'export const role=')
  .replace(/const orgType=/g, 'export const orgType=')
  .replace(/const tokenHash=/g, 'export const tokenHash=')
  .replace(/const deliveryToken=/g, 'export const deliveryToken=')
  .replace(/const verifyDeliveryToken=/g, 'export const verifyDeliveryToken=')
  .replace(/const deliveryBearer=/g, 'export const deliveryBearer=')
  .replace(/const bearer=/g, 'export const bearer=')
  .replace(/async function context/g, 'export async function context')
  .replace(/async function rolesFor/g, 'export async function rolesFor')
  .replace(/async function audit/g, 'export async function audit')
  .replace(/async function event/g, 'export async function event')
  .replace(/async function issueSession/g, 'export async function issueSession');

const healthChecks = getLines(40, 42);
const authRoutes = getLines(44, 75);
const orgRoutes = getLines(77, 85);
const pubRoutes = getLines(89, 102);
const advRoutes = getLines(106, 122);
const excRoutes = getLines(126, 209); 
// Note: registerOpenRtbRoutes is on line 210 in the view output.
const endBlock = getLines(210, 218);

const sharedFile = `
import { z } from 'zod';
import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import { loadConfig } from '@adgeco/config';
import { prisma, Prisma } from '@adgeco/database';
import { tenantRoles, type RequestContext, type TenantRole } from '@adgeco/contracts';
import type { FastifyRequest } from 'fastify';
import { signAccessSession, signMfaChallenge, verifySession } from './auth/session.js';
import { assertTenant, authorise, decryptSecret, encryptSecret, generateTotpSecret, hashPassword, hashToken, randomToken, verifyPassword, verifyTotp } from '@adgeco/auth';

export const config=loadConfig();
${sharedBlock}
`;

const routeHeader = (name) => `
import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma, Prisma } from '@adgeco/database';
import { tenantRoles, type TenantRole } from '@adgeco/contracts';
import { signAccessSession, signMfaChallenge, verifySession } from '../auth/session.js';
import { assertTenant, authorise, decryptSecret, encryptSecret, generateTotpSecret, hashPassword, hashToken, randomToken, verifyPassword, verifyTotp } from '@adgeco/auth';
import { config, email, role, orgType, tokenHash, deliveryToken, verifyDeliveryToken, deliveryBearer, bearer, context, rolesFor, audit, event, issueSession } from '../shared.js';

export const ${name}: FastifyPluginAsync = async (app) => {
`;

const authFile = routeHeader('authRoutes') + authRoutes + '\n};\n';
const orgFile = routeHeader('organisationsRoutes') + orgRoutes + '\n};\n';
const pubFile = routeHeader('publishersRoutes') + pubRoutes + '\n};\n';
const advFile = routeHeader('advertisersRoutes') + advRoutes + '\n};\n';
const excFile = routeHeader('exchangeRoutes') + excRoutes + '\n};\n';

const newServerFile = `
${imports}
import { authRoutes } from './routes/auth.routes.js';
import { organisationsRoutes } from './routes/organisations.routes.js';
import { publishersRoutes } from './routes/publishers.routes.js';
import { advertisersRoutes } from './routes/advertisers.routes.js';
import { exchangeRoutes } from './routes/exchange.routes.js';
import { config } from './shared.js';

${setupHooks.replace('const config=loadConfig();', '')}

${healthChecks}

app.register(authRoutes);
app.register(organisationsRoutes);
app.register(publishersRoutes);
app.register(advertisersRoutes);
app.register(exchangeRoutes);

${endBlock}
`;

fs.writeFileSync('apps/api/src/shared.ts', sharedFile);
fs.writeFileSync('apps/api/src/routes/auth.routes.ts', authFile);
fs.writeFileSync('apps/api/src/routes/organisations.routes.ts', orgFile);
fs.writeFileSync('apps/api/src/routes/publishers.routes.ts', pubFile);
fs.writeFileSync('apps/api/src/routes/advertisers.routes.ts', advFile);
fs.writeFileSync('apps/api/src/routes/exchange.routes.ts', excFile);
fs.writeFileSync('apps/api/src/server.ts', newServerFile);

console.log("Successfully split server.ts");
