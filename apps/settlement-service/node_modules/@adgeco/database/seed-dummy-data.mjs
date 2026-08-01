import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Injecting dummy QA data...');

  // 1. Get Advertiser Org
  const advertiserOrg = await prisma.organisation.findUnique({
    where: { slug: 'demo-advertiser' }
  });

  if (advertiserOrg) {
    // Create Profile
    await prisma.advertiserProfile.upsert({
      where: { organisationId: advertiserOrg.id },
      update: {},
      create: {
        organisationId: advertiserOrg.id,
        legalName: 'Acme Corp',
        countryCode: 'US',
        industry: 'Retail'
      }
    });

    // Create Campaign
    await prisma.campaign.create({
      data: {
        organisationId: advertiserOrg.id,
        name: 'Summer Sale 2026',
        objective: 'CONVERSION',
        totalBudget: 5000,
        startAt: new Date(),
        endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE'
      }
    });

    // Create Creative
    await prisma.creative.create({
      data: {
        organisationId: advertiserOrg.id,
        name: 'Summer Sale Banner 300x250',
        type: 'IMAGE',
        assetUrl: 'https://example.com/banner.png',
        mimeType: 'image/png',
        clickThroughUrl: 'https://example.com/sale',
        status: 'APPROVED',
        metadata: {}
      }
    });
    console.log('✅ Advertiser dummy data injected.');
  }

  // 2. Get Publisher Org
  const publisherOrg = await prisma.organisation.findUnique({
    where: { slug: 'demo-publisher' }
  });

  if (publisherOrg) {
    // Create Profile
    await prisma.publisherProfile.upsert({
      where: { organisationId: publisherOrg.id },
      update: {},
      create: {
        organisationId: publisherOrg.id,
        legalName: 'Global News Media',
        countryCode: 'GB'
      }
    });

    // Create Property
    const property = await prisma.property.create({
      data: {
        organisationId: publisherOrg.id,
        type: 'WEBSITE',
        name: 'Global News Hub',
        externalIdentifier: 'global-news-hub-1',
        category: 'NEWS',
        language: 'en',
        countryCodes: ['GB', 'US'],
        status: 'ACTIVE'
      }
    });

    // Create Placement
    await prisma.placement.create({
      data: {
        propertyId: property.id,
        name: 'Homepage Header Banner',
        format: 'BANNER',
        status: 'ACTIVE'
      }
    });

    // Create SDK Registration
    await prisma.sdkRegistration.create({
      data: {
        organisationId: publisherOrg.id,
        propertyId: property.id,
        platform: 'WEB',
        sdkVersion: '1.0.0',
        environment: 'PRODUCTION',
        publicKeyPrefix: 'pk_live_123',
        secretHash: 'hash',
        status: 'ACTIVE'
      }
    });
    console.log('✅ Publisher dummy data injected.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
