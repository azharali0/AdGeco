import { PrismaClient } from '@prisma/client';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
const prisma = new PrismaClient();
const scrypt = promisify(scryptCallback);
async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const derived = await scrypt(password, salt, 64);
    return `scrypt$${salt}$${derived.toString('hex')}`;
}
async function main() {
    console.log('🌱 Starting Database Seeding...');
    const defaultPassword = 'Password123!';
    const passwordHash = await hashPassword(defaultPassword);
    // 1. Create Super Admin
    const platformOrg = await prisma.organisation.upsert({
        where: { slug: 'adgeco-platform' },
        update: {},
        create: {
            type: 'PLATFORM',
            name: 'AdGeco Platform',
            slug: 'adgeco-platform',
        }
    });
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@adgeco.local' },
        update: { passwordHash },
        create: {
            email: 'admin@adgeco.local',
            passwordHash,
            emailVerifiedAt: new Date(),
        }
    });
    await prisma.organisationMembership.upsert({
        where: {
            userId_organisationId_role: {
                userId: adminUser.id,
                organisationId: platformOrg.id,
                role: 'SUPER_ADMIN'
            }
        },
        update: {},
        create: {
            userId: adminUser.id,
            organisationId: platformOrg.id,
            role: 'SUPER_ADMIN',
            status: 'ACTIVE'
        }
    });
    console.log('✅ Super Admin created (admin@adgeco.local)');
    // 2. Create Publisher
    const publisherOrg = await prisma.organisation.upsert({
        where: { slug: 'demo-publisher' },
        update: {},
        create: {
            type: 'PUBLISHER',
            name: 'Demo Publisher',
            slug: 'demo-publisher',
        }
    });
    const publisherUser = await prisma.user.upsert({
        where: { email: 'publisher@adgeco.local' },
        update: { passwordHash },
        create: {
            email: 'publisher@adgeco.local',
            passwordHash,
            emailVerifiedAt: new Date(),
        }
    });
    await prisma.organisationMembership.upsert({
        where: {
            userId_organisationId_role: {
                userId: publisherUser.id,
                organisationId: publisherOrg.id,
                role: 'PUBLISHER_OWNER'
            }
        },
        update: {},
        create: {
            userId: publisherUser.id,
            organisationId: publisherOrg.id,
            role: 'PUBLISHER_OWNER',
            status: 'ACTIVE'
        }
    });
    console.log('✅ Publisher created (publisher@adgeco.local)');
    // 3. Create Advertiser with Wallet
    const advertiserOrg = await prisma.organisation.upsert({
        where: { slug: 'demo-advertiser' },
        update: {},
        create: {
            type: 'ADVERTISER',
            name: 'Demo Advertiser',
            slug: 'demo-advertiser',
        }
    });
    const advertiserUser = await prisma.user.upsert({
        where: { email: 'advertiser@adgeco.local' },
        update: { passwordHash },
        create: {
            email: 'advertiser@adgeco.local',
            passwordHash,
            emailVerifiedAt: new Date(),
        }
    });
    await prisma.organisationMembership.upsert({
        where: {
            userId_organisationId_role: {
                userId: advertiserUser.id,
                organisationId: advertiserOrg.id,
                role: 'ADVERTISER_OWNER'
            }
        },
        update: {},
        create: {
            userId: advertiserUser.id,
            organisationId: advertiserOrg.id,
            role: 'ADVERTISER_OWNER',
            status: 'ACTIVE'
        }
    });
    await prisma.advertiserWallet.upsert({
        where: { organisationId: advertiserOrg.id },
        update: {}, // keep existing balance if already seeded
        create: {
            organisationId: advertiserOrg.id,
            availableBalance: 10000.00,
            currency: 'USD'
        }
    });
    console.log('✅ Advertiser created (advertiser@adgeco.local) with $10,000 Wallet Balance');
    console.log('🌱 Seeding Complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
