CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE "OrganisationType" AS ENUM ('PLATFORM', 'PUBLISHER', 'ADVERTISER', 'AGENCY');
CREATE TYPE "MembershipStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'REMOVED');
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FAILED');
CREATE TYPE "TokenPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'MFA_ENROLMENT');
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');
CREATE TYPE "CredentialStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');
CREATE TYPE "PublisherStatus" AS ENUM ('DRAFT', 'PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'REJECTED');
CREATE TYPE "VerificationStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFORMATION');
CREATE TYPE "PropertyType" AS ENUM ('WEBSITE', 'MOBILE_APP', 'MOBILE_GAME');
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'REJECTED');
CREATE TYPE "PlacementFormat" AS ENUM ('BANNER', 'INTERSTITIAL', 'REWARDED_VIDEO', 'NATIVE', 'PLAYABLE', 'IN_FEED', 'SPLASH', 'FULLSCREEN', 'CUSTOM');
CREATE TYPE "PlacementStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'REJECTED');
CREATE TYPE "SdkPlatform" AS ENUM ('WEB', 'ANDROID', 'IOS', 'UNITY');
CREATE TYPE "SdkRegistrationStatus" AS ENUM ('REGISTERED', 'TESTING', 'CERTIFIED', 'ACTIVE', 'SUSPENDED', 'REVOKED');
CREATE TYPE "PayoutProfileStatus" AS ENUM ('DRAFT', 'PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED');
CREATE TYPE "AdvertiserStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'REJECTED');
CREATE TYPE "BillingProfileStatus" AS ENUM ('DRAFT', 'PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED');
CREATE TYPE "WalletTransactionType" AS ENUM ('FUNDING', 'RESERVATION', 'RELEASE', 'CHARGE', 'REFUND', 'ADJUSTMENT');
CREATE TYPE "WalletTransactionStatus" AS ENUM ('PENDING', 'POSTED', 'FAILED', 'REVERSED');
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'PAUSED', 'REJECTED', 'COMPLETED');
CREATE TYPE "LineItemStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED');
CREATE TYPE "PacingMode" AS ENUM ('EVEN', 'ACCELERATED', 'ASAP');
CREATE TYPE "CreativeType" AS ENUM ('IMAGE', 'VIDEO', 'HTML', 'NATIVE');
CREATE TYPE "CreativeStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "CreativeReviewDecision" AS ENUM ('APPROVED', 'REJECTED', 'NEEDS_CHANGES');
CREATE TYPE "AdRequestStatus" AS ENUM ('RECEIVED', 'VALIDATED', 'AUCTIONED', 'NO_FILL', 'REJECTED');
CREATE TYPE "AuctionStatus" AS ENUM ('CREATED', 'COMPLETED', 'NO_FILL', 'FAILED');
CREATE TYPE "AuctionDecisionStatus" AS ENUM ('WINNER', 'NO_FILL');
CREATE TYPE "BudgetReservationStatus" AS ENUM ('RESERVED', 'RELEASED', 'CHARGED', 'EXPIRED');
CREATE TYPE "DeliveryStatus" AS ENUM ('ISSUED', 'ASSET_RESOLVED', 'RENDERED', 'IMPRESSION_QUALIFIED', 'CLICKED', 'COMPLETED', 'FAILED', 'EXPIRED');
CREATE TYPE "MeasurementEventType" AS ENUM ('ASSET_RESOLVED', 'RENDER_STARTED', 'RENDER_SUCCEEDED', 'IMPRESSION', 'VIEWABLE', 'CLICK', 'VIDEO_START', 'VIDEO_FIRST_QUARTILE', 'VIDEO_MIDPOINT', 'VIDEO_THIRD_QUARTILE', 'VIDEO_COMPLETE', 'DELIVERY_FAILED');
CREATE TYPE "MeasurementValidationStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'DUPLICATE');
CREATE TYPE "PlaybackQuartile" AS ENUM ('START', 'FIRST_QUARTILE', 'MIDPOINT', 'THIRD_QUARTILE', 'COMPLETE');
CREATE TYPE "FraudDecisionStatus" AS ENUM ('CLEAR', 'REVIEW', 'BLOCKED');
CREATE TYPE "BillableEventStatus" AS ENUM ('PENDING', 'QUALIFIED', 'REJECTED', 'POSTED', 'REVERSED');
CREATE TYPE "AttributionModel" AS ENUM ('LAST_CLICK', 'LAST_VIEW');
CREATE TYPE "LedgerAccountType" AS ENUM ('ASSET', 'LIABILITY', 'REVENUE', 'EXPENSE', 'EQUITY');
CREATE TYPE "LedgerEntryStatus" AS ENUM ('POSTED', 'REVERSED');
CREATE TYPE "ReconciliationStatus" AS ENUM ('PENDING', 'MATCHED', 'EXCEPTION', 'RESOLVED');
CREATE TYPE "PartnerType" AS ENUM ('PUBLISHER', 'DSP', 'SSP', 'AGENCY', 'TECHNOLOGY', 'FINANCIAL', 'ANALYTICS');
CREATE TYPE "PartnerStatus" AS ENUM ('DRAFT', 'SANDBOX', 'CERTIFICATION_PENDING', 'CERTIFIED', 'ACTIVE', 'SUSPENDED', 'REVOKED');
CREATE TYPE "WebhookStatus" AS ENUM ('ACTIVE', 'PAUSED', 'REVOKED');
CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('PENDING', 'DELIVERED', 'RETRYING', 'FAILED');
CREATE TYPE "CertificationStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PASSED', 'FAILED', 'EXPIRED', 'REVOKED');
CREATE TYPE "SandboxScenarioStatus" AS ENUM ('READY', 'RUNNING', 'COMPLETED', 'FAILED');
CREATE TYPE "SettlementBatchStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PROCESSING', 'COMPLETED', 'PARTIAL_FAILED', 'FAILED', 'CANCELLED');
CREATE TYPE "SettlementItemStatus" AS ENUM ('PENDING', 'LOCKED', 'PROCESSING', 'PAID', 'FAILED', 'RETURNED', 'CANCELLED');
CREATE TYPE "PayoutAttemptStatus" AS ENUM ('PENDING', 'SUBMITTED', 'SUCCEEDED', 'FAILED', 'RETRY_SCHEDULED');
CREATE TYPE "StatementStatus" AS ENUM ('DRAFT', 'ISSUED', 'VOID');
CREATE TYPE "InvestigationStatus" AS ENUM ('OPEN', 'TRIAGE', 'INVESTIGATING', 'ACTION_REQUIRED', 'RESOLVED', 'CLOSED');
CREATE TYPE "SupportCaseStatus" AS ENUM ('OPEN', 'PENDING_CUSTOMER', 'PENDING_INTERNAL', 'RESOLVED', 'CLOSED');
CREATE TYPE "IncidentSeverity" AS ENUM ('P0', 'P1', 'P2', 'P3');
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'MITIGATED', 'RESOLVED', 'CLOSED');
CREATE TYPE "ServiceHealthStatus" AS ENUM ('HEALTHY', 'DEGRADED', 'UNAVAILABLE', 'UNKNOWN');
CREATE TYPE "ScheduledReportStatus" AS ENUM ('ACTIVE', 'PAUSED', 'FAILED');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "emailVerifiedAt" TIMESTAMPTZ(3),
  "mfaEnabled" BOOLEAN NOT NULL,
  "mfaSecretEncrypted" TEXT,
  "failedLoginAttempts" INTEGER NOT NULL,
  "lockedUntil" TIMESTAMPTZ(3),
  "lastLoginAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Organisation" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "type" "OrganisationType" NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrganisationMembership" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "organisationId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "status" "MembershipStatus" NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Session" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "organisationId" TEXT NOT NULL,
  "refreshTokenHash" TEXT NOT NULL,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "lastUsedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMPTZ(3),
  "revokeReason" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "UserToken" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "purpose" "TokenPurpose" NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "consumedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrganisationInvitation" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "status" "InvitationStatus" NOT NULL,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "invitedByUserId" TEXT NOT NULL,
  "acceptedByUserId" TEXT,
  "acceptedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ServiceAccount" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "clientId" TEXT NOT NULL,
  "secretHash" TEXT NOT NULL,
  "scopes" TEXT[] NOT NULL,
  "status" "CredentialStatus" NOT NULL,
  "lastUsedAt" TIMESTAMPTZ(3),
  "expiresAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ApiCredential" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "prefix" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "scopes" TEXT[] NOT NULL,
  "status" "CredentialStatus" NOT NULL,
  "lastUsedAt" TIMESTAMPTZ(3),
  "expiresAt" TIMESTAMPTZ(3),
  "createdByUserId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMPTZ(3)
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "requestId" TEXT NOT NULL,
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OutboxEvent" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT,
  "type" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "correlationId" TEXT NOT NULL,
  "causationId" TEXT,
  "payload" JSONB NOT NULL,
  "status" "OutboxStatus" NOT NULL,
  "attempts" INTEGER NOT NULL,
  "availableAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lockedAt" TIMESTAMPTZ(3),
  "lockedBy" TEXT,
  "lastError" TEXT,
  "publishedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PublisherProfile" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "legalName" TEXT NOT NULL,
  "tradingName" TEXT,
  "website" TEXT,
  "countryCode" TEXT NOT NULL,
  "registrationNumber" TEXT,
  "status" "PublisherStatus" NOT NULL,
  "trustScore" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PublisherVerification" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "publisherProfileId" TEXT NOT NULL,
  "status" "VerificationStatus" NOT NULL,
  "verificationType" TEXT NOT NULL,
  "providerReference" TEXT,
  "submittedData" JSONB NOT NULL,
  "decisionReason" TEXT,
  "reviewedByUserId" TEXT,
  "reviewedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Property" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "type" "PropertyType" NOT NULL,
  "name" TEXT NOT NULL,
  "externalIdentifier" TEXT NOT NULL,
  "domain" TEXT,
  "storeUrl" TEXT,
  "packageName" TEXT,
  "bundleId" TEXT,
  "gameEngine" TEXT,
  "category" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "countryCodes" TEXT[] NOT NULL,
  "status" "PropertyStatus" NOT NULL,
  "ownershipVerifiedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "InventoryPolicy" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "floorCpm" DECIMAL(65,30),
  "currency" TEXT NOT NULL,
  "blockedCategories" TEXT[] NOT NULL,
  "blockedAdvertiserDomains" TEXT[] NOT NULL,
  "allowedCountryCodes" TEXT[] NOT NULL,
  "requireBrandSafety" BOOLEAN NOT NULL,
  "active" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Placement" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "propertyId" TEXT NOT NULL,
  "inventoryPolicyId" TEXT,
  "name" TEXT NOT NULL,
  "format" "PlacementFormat" NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "rewardName" TEXT,
  "rewardAmount" INTEGER,
  "floorCpm" DECIMAL(65,30),
  "currency" TEXT NOT NULL,
  "status" "PlacementStatus" NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SdkRegistration" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "platform" "SdkPlatform" NOT NULL,
  "sdkVersion" TEXT NOT NULL,
  "environment" TEXT NOT NULL,
  "publicKeyPrefix" TEXT NOT NULL,
  "secretHash" TEXT NOT NULL,
  "status" "SdkRegistrationStatus" NOT NULL,
  "lastHeartbeatAt" TIMESTAMPTZ(3),
  "certifiedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PublisherPayoutProfile" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "accountReferenceEncrypted" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "countryCode" TEXT NOT NULL,
  "schedule" TEXT NOT NULL,
  "minimumThreshold" DECIMAL(65,30) NOT NULL,
  "taxIdentifierEncrypted" TEXT,
  "status" "PayoutProfileStatus" NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AdvertiserProfile" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "legalName" TEXT NOT NULL,
  "tradingName" TEXT,
  "website" TEXT,
  "countryCode" TEXT NOT NULL,
  "registrationNumber" TEXT,
  "industry" TEXT NOT NULL,
  "status" "AdvertiserStatus" NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AdvertiserBillingProfile" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "billingEmail" TEXT NOT NULL,
  "legalName" TEXT NOT NULL,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  "city" TEXT NOT NULL,
  "region" TEXT,
  "postalCode" TEXT NOT NULL,
  "countryCode" TEXT NOT NULL,
  "taxIdentifierEncrypted" TEXT,
  "currency" TEXT NOT NULL,
  "status" "BillingProfileStatus" NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AdvertiserWallet" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "availableBalance" DECIMAL(65,30) NOT NULL,
  "reservedBalance" DECIMAL(65,30) NOT NULL,
  "lifetimeFunded" DECIMAL(65,30) NOT NULL,
  "lifetimeSpent" DECIMAL(65,30) NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "WalletTransaction" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "walletId" TEXT NOT NULL,
  "type" "WalletTransactionType" NOT NULL,
  "status" "WalletTransactionStatus" NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "currency" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "providerReference" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Campaign" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "objective" TEXT NOT NULL,
  "status" "CampaignStatus" NOT NULL,
  "currency" TEXT NOT NULL,
  "totalBudget" DECIMAL(65,30) NOT NULL,
  "dailyBudget" DECIMAL(65,30),
  "startAt" TIMESTAMPTZ(3) NOT NULL,
  "endAt" TIMESTAMPTZ(3) NOT NULL,
  "pacingMode" "PacingMode" NOT NULL,
  "approvalReason" TEXT,
  "approvedByUserId" TEXT,
  "approvedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "LineItem" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "campaignId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "LineItemStatus" NOT NULL,
  "bidAmount" DECIMAL(65,30) NOT NULL,
  "bidStrategy" TEXT NOT NULL,
  "budget" DECIMAL(65,30) NOT NULL,
  "dailyBudget" DECIMAL(65,30),
  "pacingMode" "PacingMode" NOT NULL,
  "targeting" JSONB NOT NULL,
  "frequencyCap" JSONB,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Creative" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "campaignId" TEXT,
  "name" TEXT NOT NULL,
  "type" "CreativeType" NOT NULL,
  "status" "CreativeStatus" NOT NULL,
  "assetUrl" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "durationSeconds" INTEGER,
  "clickThroughUrl" TEXT NOT NULL,
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CreativeReview" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "creativeId" TEXT NOT NULL,
  "reviewerUserId" TEXT NOT NULL,
  "decision" "CreativeReviewDecision" NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AdRequest" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "requestKey" TEXT NOT NULL,
  "publisherOrganisationId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "placementId" TEXT NOT NULL,
  "sdkRegistrationId" TEXT NOT NULL,
  "status" "AdRequestStatus" NOT NULL,
  "countryCode" TEXT,
  "language" TEXT,
  "deviceType" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "userKeyHash" TEXT,
  "contextualData" JSONB NOT NULL,
  "receivedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMPTZ(3)
);

CREATE TABLE "Auction" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "adRequestId" TEXT NOT NULL,
  "status" "AuctionStatus" NOT NULL,
  "currency" TEXT NOT NULL,
  "floorCpm" DECIMAL(65,30) NOT NULL,
  "eligibleBidCount" INTEGER NOT NULL,
  "completedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuctionBid" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "auctionId" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "lineItemId" TEXT NOT NULL,
  "creativeId" TEXT NOT NULL,
  "advertiserOrganisationId" TEXT NOT NULL,
  "bidCpm" DECIMAL(65,30) NOT NULL,
  "eligible" BOOLEAN NOT NULL,
  "rejectionReasons" TEXT[] NOT NULL,
  "rank" INTEGER,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuctionDecision" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "auctionId" TEXT NOT NULL,
  "status" "AuctionDecisionStatus" NOT NULL,
  "advertiserOrganisationId" TEXT,
  "campaignId" TEXT,
  "lineItemId" TEXT,
  "creativeId" TEXT,
  "winningBidCpm" DECIMAL(65,30),
  "clearingPriceCpm" DECIMAL(65,30),
  "budgetReservationId" TEXT,
  "noFillReason" TEXT,
  "evidence" JSONB NOT NULL,
  "decidedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BudgetReservation" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "requestKey" TEXT NOT NULL,
  "walletId" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "lineItemId" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "currency" TEXT NOT NULL,
  "status" "BudgetReservationStatus" NOT NULL,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "releasedAt" TIMESTAMPTZ(3),
  "chargedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "FrequencyExposure" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "userKeyHash" TEXT NOT NULL,
  "lineItemId" TEXT NOT NULL,
  "occurredAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AdDelivery" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "auctionId" TEXT NOT NULL,
  "decisionId" TEXT NOT NULL,
  "creativeId" TEXT NOT NULL,
  "deliveryTokenHash" TEXT NOT NULL,
  "status" "DeliveryStatus" NOT NULL,
  "assetUrl" TEXT NOT NULL,
  "resolvedAssetUrl" TEXT,
  "clickThroughUrl" TEXT NOT NULL,
  "issuedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "firstRenderedAt" TIMESTAMPTZ(3),
  "impressionQualifiedAt" TIMESTAMPTZ(3),
  "clickedAt" TIMESTAMPTZ(3),
  "completedAt" TIMESTAMPTZ(3),
  "failedAt" TIMESTAMPTZ(3),
  "failureCode" TEXT,
  "failureDetail" TEXT
);

CREATE TABLE "DeliveryMeasurementEvent" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "deliveryId" TEXT NOT NULL,
  "eventType" "MeasurementEventType" NOT NULL,
  "eventKey" TEXT NOT NULL,
  "validationStatus" "MeasurementValidationStatus" NOT NULL,
  "occurredAt" TIMESTAMPTZ(3) NOT NULL,
  "receivedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "evidence" JSONB NOT NULL,
  "rejectionReason" TEXT
);

CREATE TABLE "VideoPlaybackEvent" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "deliveryId" TEXT NOT NULL,
  "quartile" "PlaybackQuartile" NOT NULL,
  "eventKey" TEXT NOT NULL,
  "positionSeconds" DECIMAL(65,30),
  "durationSeconds" DECIMAL(65,30),
  "occurredAt" TIMESTAMPTZ(3) NOT NULL,
  "receivedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ViewabilityAssessment" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "deliveryId" TEXT NOT NULL,
  "visiblePercentage" DECIMAL(65,30) NOT NULL,
  "durationMs" INTEGER NOT NULL,
  "viewportWidth" INTEGER,
  "viewportHeight" INTEGER,
  "tabFocused" BOOLEAN NOT NULL,
  "qualified" BOOLEAN NOT NULL,
  "ruleVersion" TEXT NOT NULL,
  "assessedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "FraudAssessment" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "deliveryId" TEXT NOT NULL,
  "status" "FraudDecisionStatus" NOT NULL,
  "riskScore" INTEGER NOT NULL,
  "signals" TEXT[] NOT NULL,
  "evidence" JSONB NOT NULL,
  "assessedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ConversionEvent" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "deliveryId" TEXT NOT NULL,
  "eventKey" TEXT NOT NULL,
  "conversionType" TEXT NOT NULL,
  "value" DECIMAL(65,30),
  "currency" TEXT,
  "occurredAt" TIMESTAMPTZ(3) NOT NULL,
  "receivedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata" JSONB NOT NULL
);

CREATE TABLE "AttributionRecord" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "deliveryId" TEXT NOT NULL,
  "conversionEventId" TEXT,
  "model" "AttributionModel" NOT NULL,
  "attributed" BOOLEAN NOT NULL,
  "confidence" DECIMAL(65,30) NOT NULL,
  "evidence" JSONB NOT NULL,
  "attributedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BillableEvent" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "deliveryId" TEXT NOT NULL,
  "eventKey" TEXT NOT NULL,
  "status" "BillableEventStatus" NOT NULL,
  "advertiserAmount" DECIMAL(65,30) NOT NULL,
  "publisherAmount" DECIMAL(65,30) NOT NULL,
  "platformAmount" DECIMAL(65,30) NOT NULL,
  "currency" TEXT NOT NULL,
  "qualificationEvidence" JSONB NOT NULL,
  "qualifiedAt" TIMESTAMPTZ(3),
  "postedAt" TIMESTAMPTZ(3),
  "rejectionReason" TEXT
);

CREATE TABLE "PublisherEarning" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "billableEventId" TEXT NOT NULL,
  "publisherOrganisationId" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "currency" TEXT NOT NULL,
  "availableAt" TIMESTAMPTZ(3) NOT NULL,
  "settledAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PlatformRevenueAllocation" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "billableEventId" TEXT NOT NULL,
  "platformOrganisationId" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "currency" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "LedgerAccount" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "LedgerAccountType" NOT NULL,
  "currency" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "LedgerEntry" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "reference" TEXT NOT NULL,
  "status" "LedgerEntryStatus" NOT NULL,
  "description" TEXT NOT NULL,
  "occurredAt" TIMESTAMPTZ(3) NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reversedEntryId" TEXT,
  "metadata" JSONB NOT NULL
);

CREATE TABLE "LedgerLine" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "entryId" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "debit" DECIMAL(65,30) NOT NULL,
  "credit" DECIMAL(65,30) NOT NULL,
  "currency" TEXT NOT NULL
);

CREATE TABLE "FinancialReconciliation" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "billableEventId" TEXT NOT NULL,
  "status" "ReconciliationStatus" NOT NULL,
  "advertiserCharge" DECIMAL(65,30) NOT NULL,
  "publisherEarning" DECIMAL(65,30) NOT NULL,
  "platformRevenue" DECIMAL(65,30) NOT NULL,
  "ledgerDebit" DECIMAL(65,30) NOT NULL,
  "ledgerCredit" DECIMAL(65,30) NOT NULL,
  "variance" DECIMAL(65,30) NOT NULL,
  "evidence" JSONB NOT NULL,
  "reconciledAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PartnerProfile" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "type" "PartnerType" NOT NULL,
  "status" "PartnerStatus" NOT NULL,
  "displayName" TEXT NOT NULL,
  "technicalContactEmail" TEXT NOT NULL,
  "callbackBaseUrl" TEXT,
  "openRtbVersion" TEXT,
  "capabilities" TEXT[] NOT NULL,
  "approvedAt" TIMESTAMPTZ(3),
  "suspendedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "WebhookEndpoint" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "eventTypes" TEXT[] NOT NULL,
  "secretHash" TEXT NOT NULL,
  "secretPrefix" TEXT NOT NULL,
  "status" "WebhookStatus" NOT NULL,
  "lastDeliveredAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "WebhookDelivery" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "endpointId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "status" "WebhookDeliveryStatus" NOT NULL,
  "attempts" INTEGER NOT NULL,
  "responseCode" INTEGER,
  "nextAttemptAt" TIMESTAMPTZ(3),
  "deliveredAt" TIMESTAMPTZ(3),
  "lastError" TEXT,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "IntegrationCertification" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "CertificationStatus" NOT NULL,
  "sdkPlatform" "SdkPlatform",
  "protocolVersion" TEXT,
  "checks" JSONB NOT NULL,
  "score" INTEGER NOT NULL,
  "evidence" JSONB NOT NULL,
  "reviewedByUserId" TEXT,
  "submittedAt" TIMESTAMPTZ(3),
  "completedAt" TIMESTAMPTZ(3),
  "expiresAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SandboxScenario" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "scenarioType" TEXT NOT NULL,
  "status" "SandboxScenarioStatus" NOT NULL,
  "input" JSONB NOT NULL,
  "output" JSONB,
  "seed" INTEGER NOT NULL,
  "startedAt" TIMESTAMPTZ(3),
  "completedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SettlementBatch" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "publisherOrganisationId" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "periodStart" TIMESTAMPTZ(3) NOT NULL,
  "periodEnd" TIMESTAMPTZ(3) NOT NULL,
  "grossAmount" DECIMAL(65,30) NOT NULL,
  "withholdingAmount" DECIMAL(65,30) NOT NULL,
  "netAmount" DECIMAL(65,30) NOT NULL,
  "status" "SettlementBatchStatus" NOT NULL,
  "scheduledFor" TIMESTAMPTZ(3),
  "completedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SettlementItem" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "batchId" TEXT NOT NULL,
  "publisherOrganisationId" TEXT NOT NULL,
  "publisherEarningId" TEXT NOT NULL,
  "grossAmount" DECIMAL(65,30) NOT NULL,
  "withholdingAmount" DECIMAL(65,30) NOT NULL,
  "netAmount" DECIMAL(65,30) NOT NULL,
  "status" "SettlementItemStatus" NOT NULL,
  "failureReason" TEXT,
  "paidAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PayoutAttempt" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "settlementItemId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerReference" TEXT,
  "idempotencyKey" TEXT NOT NULL,
  "status" "PayoutAttemptStatus" NOT NULL,
  "attemptNumber" INTEGER NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "currency" TEXT NOT NULL,
  "nextRetryAt" TIMESTAMPTZ(3),
  "errorCode" TEXT,
  "errorMessage" TEXT,
  "submittedAt" TIMESTAMPTZ(3),
  "completedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PublisherStatement" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "publisherOrganisationId" TEXT NOT NULL,
  "settlementBatchId" TEXT NOT NULL,
  "statementNumber" TEXT NOT NULL,
  "status" "StatementStatus" NOT NULL,
  "periodStart" TIMESTAMPTZ(3) NOT NULL,
  "periodEnd" TIMESTAMPTZ(3) NOT NULL,
  "currency" TEXT NOT NULL,
  "grossAmount" DECIMAL(65,30) NOT NULL,
  "withholdingAmount" DECIMAL(65,30) NOT NULL,
  "netAmount" DECIMAL(65,30) NOT NULL,
  "issuedAt" TIMESTAMPTZ(3),
  "documentUrl" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TrustInvestigation" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT,
  "subjectType" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" "InvestigationStatus" NOT NULL,
  "severity" INTEGER NOT NULL,
  "riskScore" INTEGER NOT NULL,
  "assignedToUserId" TEXT,
  "evidence" JSONB NOT NULL,
  "decision" JSONB,
  "resolvedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SupportCase" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT,
  "requesterUserId" TEXT,
  "subject" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "SupportCaseStatus" NOT NULL,
  "priority" INTEGER NOT NULL,
  "assignedToUserId" TEXT,
  "tags" TEXT[] NOT NULL,
  "metadata" JSONB NOT NULL,
  "resolvedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Incident" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "severity" "IncidentSeverity" NOT NULL,
  "status" "IncidentStatus" NOT NULL,
  "service" TEXT NOT NULL,
  "region" TEXT,
  "ownerUserId" TEXT,
  "startedAt" TIMESTAMPTZ(3) NOT NULL,
  "mitigatedAt" TIMESTAMPTZ(3),
  "resolvedAt" TIMESTAMPTZ(3),
  "rootCause" TEXT,
  "impact" JSONB NOT NULL,
  "timeline" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ServiceHealthSnapshot" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT,
  "service" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "status" "ServiceHealthStatus" NOT NULL,
  "availability" DECIMAL(65,30),
  "latencyMs" INTEGER,
  "errorRate" DECIMAL(65,30),
  "queueDepth" INTEGER,
  "details" JSONB NOT NULL,
  "observedAt" TIMESTAMPTZ(3) NOT NULL
);

CREATE TABLE "ScheduledReport" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "organisationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "reportType" TEXT NOT NULL,
  "schedule" TEXT NOT NULL,
  "recipients" TEXT[] NOT NULL,
  "status" "ScheduledReportStatus" NOT NULL,
  "filters" JSONB NOT NULL,
  "lastRunAt" TIMESTAMPTZ(3),
  "nextRunAt" TIMESTAMPTZ(3),
  "lastError" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_slug_key" UNIQUE ("slug");
ALTER TABLE "OrganisationMembership" ADD CONSTRAINT "OrganisationMembership_userId_organisationId_role_key" UNIQUE ("userId", "organisationId", "role");
ALTER TABLE "OrganisationMembership" ADD CONSTRAINT "OrganisationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE;
ALTER TABLE "OrganisationMembership" ADD CONSTRAINT "OrganisationMembership_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_refreshTokenHash_key" UNIQUE ("refreshTokenHash");
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE;
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_tokenHash_key" UNIQUE ("tokenHash");
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE;
ALTER TABLE "OrganisationInvitation" ADD CONSTRAINT "OrganisationInvitation_tokenHash_key" UNIQUE ("tokenHash");
ALTER TABLE "OrganisationInvitation" ADD CONSTRAINT "OrganisationInvitation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "OrganisationInvitation" ADD CONSTRAINT "OrganisationInvitation_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT;
ALTER TABLE "ServiceAccount" ADD CONSTRAINT "ServiceAccount_clientId_key" UNIQUE ("clientId");
ALTER TABLE "ServiceAccount" ADD CONSTRAINT "ServiceAccount_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "ApiCredential" ADD CONSTRAINT "ApiCredential_prefix_key" UNIQUE ("prefix");
ALTER TABLE "ApiCredential" ADD CONSTRAINT "ApiCredential_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE SET NULL;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL;
ALTER TABLE "OutboxEvent" ADD CONSTRAINT "OutboxEvent_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE SET NULL;
ALTER TABLE "PublisherProfile" ADD CONSTRAINT "PublisherProfile_organisationId_key" UNIQUE ("organisationId");
ALTER TABLE "PublisherProfile" ADD CONSTRAINT "PublisherProfile_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "PublisherVerification" ADD CONSTRAINT "PublisherVerification_publisherProfileId_fkey" FOREIGN KEY ("publisherProfileId") REFERENCES "PublisherProfile" ("id") ON DELETE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_organisationId_externalIdentifier_key" UNIQUE ("organisationId", "externalIdentifier");
ALTER TABLE "Property" ADD CONSTRAINT "Property_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "InventoryPolicy" ADD CONSTRAINT "InventoryPolicy_organisationId_name_key" UNIQUE ("organisationId", "name");
ALTER TABLE "InventoryPolicy" ADD CONSTRAINT "InventoryPolicy_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_propertyId_name_key" UNIQUE ("propertyId", "name");
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE;
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_inventoryPolicyId_fkey" FOREIGN KEY ("inventoryPolicyId") REFERENCES "InventoryPolicy" ("id") ON DELETE SET NULL;
ALTER TABLE "SdkRegistration" ADD CONSTRAINT "SdkRegistration_publicKeyPrefix_key" UNIQUE ("publicKeyPrefix");
ALTER TABLE "SdkRegistration" ADD CONSTRAINT "SdkRegistration_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "SdkRegistration" ADD CONSTRAINT "SdkRegistration_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE;
ALTER TABLE "PublisherPayoutProfile" ADD CONSTRAINT "PublisherPayoutProfile_organisationId_key" UNIQUE ("organisationId");
ALTER TABLE "PublisherPayoutProfile" ADD CONSTRAINT "PublisherPayoutProfile_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "AdvertiserProfile" ADD CONSTRAINT "AdvertiserProfile_organisationId_key" UNIQUE ("organisationId");
ALTER TABLE "AdvertiserProfile" ADD CONSTRAINT "AdvertiserProfile_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "AdvertiserBillingProfile" ADD CONSTRAINT "AdvertiserBillingProfile_organisationId_key" UNIQUE ("organisationId");
ALTER TABLE "AdvertiserBillingProfile" ADD CONSTRAINT "AdvertiserBillingProfile_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "AdvertiserWallet" ADD CONSTRAINT "AdvertiserWallet_organisationId_key" UNIQUE ("organisationId");
ALTER TABLE "AdvertiserWallet" ADD CONSTRAINT "AdvertiserWallet_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_idempotencyKey_key" UNIQUE ("idempotencyKey");
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "AdvertiserWallet" ("id") ON DELETE CASCADE;
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE;
ALTER TABLE "Creative" ADD CONSTRAINT "Creative_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "Creative" ADD CONSTRAINT "Creative_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL;
ALTER TABLE "CreativeReview" ADD CONSTRAINT "CreativeReview_creativeId_fkey" FOREIGN KEY ("creativeId") REFERENCES "Creative" ("id") ON DELETE CASCADE;
ALTER TABLE "CreativeReview" ADD CONSTRAINT "CreativeReview_reviewerUserId_fkey" FOREIGN KEY ("reviewerUserId") REFERENCES "User" ("id") ON DELETE RESTRICT;
ALTER TABLE "AdRequest" ADD CONSTRAINT "AdRequest_requestKey_key" UNIQUE ("requestKey");
ALTER TABLE "AdRequest" ADD CONSTRAINT "AdRequest_publisherOrganisationId_fkey" FOREIGN KEY ("publisherOrganisationId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT;
ALTER TABLE "AdRequest" ADD CONSTRAINT "AdRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT;
ALTER TABLE "AdRequest" ADD CONSTRAINT "AdRequest_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement" ("id") ON DELETE RESTRICT;
ALTER TABLE "AdRequest" ADD CONSTRAINT "AdRequest_sdkRegistrationId_fkey" FOREIGN KEY ("sdkRegistrationId") REFERENCES "SdkRegistration" ("id") ON DELETE RESTRICT;
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_adRequestId_key" UNIQUE ("adRequestId");
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_adRequestId_fkey" FOREIGN KEY ("adRequestId") REFERENCES "AdRequest" ("id") ON DELETE RESTRICT;
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_auctionId_lineItemId_creativeId_key" UNIQUE ("auctionId", "lineItemId", "creativeId");
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE CASCADE;
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT;
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem" ("id") ON DELETE RESTRICT;
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_creativeId_fkey" FOREIGN KEY ("creativeId") REFERENCES "Creative" ("id") ON DELETE RESTRICT;
ALTER TABLE "AuctionDecision" ADD CONSTRAINT "AuctionDecision_auctionId_key" UNIQUE ("auctionId");
ALTER TABLE "AuctionDecision" ADD CONSTRAINT "AuctionDecision_budgetReservationId_key" UNIQUE ("budgetReservationId");
ALTER TABLE "AuctionDecision" ADD CONSTRAINT "AuctionDecision_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE RESTRICT;
ALTER TABLE "AuctionDecision" ADD CONSTRAINT "AuctionDecision_advertiserOrganisationId_fkey" FOREIGN KEY ("advertiserOrganisationId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT;
ALTER TABLE "AuctionDecision" ADD CONSTRAINT "AuctionDecision_budgetReservationId_fkey" FOREIGN KEY ("budgetReservationId") REFERENCES "BudgetReservation" ("id") ON DELETE SET NULL;
ALTER TABLE "BudgetReservation" ADD CONSTRAINT "BudgetReservation_requestKey_key" UNIQUE ("requestKey");
ALTER TABLE "BudgetReservation" ADD CONSTRAINT "BudgetReservation_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "AdvertiserWallet" ("id") ON DELETE RESTRICT;
ALTER TABLE "BudgetReservation" ADD CONSTRAINT "BudgetReservation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT;
ALTER TABLE "BudgetReservation" ADD CONSTRAINT "BudgetReservation_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem" ("id") ON DELETE RESTRICT;
ALTER TABLE "AdDelivery" ADD CONSTRAINT "AdDelivery_auctionId_key" UNIQUE ("auctionId");
ALTER TABLE "AdDelivery" ADD CONSTRAINT "AdDelivery_decisionId_key" UNIQUE ("decisionId");
ALTER TABLE "AdDelivery" ADD CONSTRAINT "AdDelivery_deliveryTokenHash_key" UNIQUE ("deliveryTokenHash");
ALTER TABLE "AdDelivery" ADD CONSTRAINT "AdDelivery_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE RESTRICT;
ALTER TABLE "AdDelivery" ADD CONSTRAINT "AdDelivery_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "AuctionDecision" ("id") ON DELETE RESTRICT;
ALTER TABLE "AdDelivery" ADD CONSTRAINT "AdDelivery_creativeId_fkey" FOREIGN KEY ("creativeId") REFERENCES "Creative" ("id") ON DELETE RESTRICT;
ALTER TABLE "DeliveryMeasurementEvent" ADD CONSTRAINT "DeliveryMeasurementEvent_eventKey_key" UNIQUE ("eventKey");
ALTER TABLE "DeliveryMeasurementEvent" ADD CONSTRAINT "DeliveryMeasurementEvent_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "AdDelivery" ("id") ON DELETE CASCADE;
ALTER TABLE "VideoPlaybackEvent" ADD CONSTRAINT "VideoPlaybackEvent_deliveryId_quartile_key" UNIQUE ("deliveryId", "quartile");
ALTER TABLE "VideoPlaybackEvent" ADD CONSTRAINT "VideoPlaybackEvent_eventKey_key" UNIQUE ("eventKey");
ALTER TABLE "VideoPlaybackEvent" ADD CONSTRAINT "VideoPlaybackEvent_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "AdDelivery" ("id") ON DELETE CASCADE;
ALTER TABLE "ViewabilityAssessment" ADD CONSTRAINT "ViewabilityAssessment_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "AdDelivery" ("id") ON DELETE CASCADE;
ALTER TABLE "FraudAssessment" ADD CONSTRAINT "FraudAssessment_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "AdDelivery" ("id") ON DELETE CASCADE;
ALTER TABLE "ConversionEvent" ADD CONSTRAINT "ConversionEvent_eventKey_key" UNIQUE ("eventKey");
ALTER TABLE "ConversionEvent" ADD CONSTRAINT "ConversionEvent_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "AdDelivery" ("id") ON DELETE RESTRICT;
ALTER TABLE "AttributionRecord" ADD CONSTRAINT "AttributionRecord_conversionEventId_key" UNIQUE ("conversionEventId");
ALTER TABLE "AttributionRecord" ADD CONSTRAINT "AttributionRecord_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "AdDelivery" ("id") ON DELETE RESTRICT;
ALTER TABLE "AttributionRecord" ADD CONSTRAINT "AttributionRecord_conversionEventId_fkey" FOREIGN KEY ("conversionEventId") REFERENCES "ConversionEvent" ("id") ON DELETE SET NULL;
ALTER TABLE "BillableEvent" ADD CONSTRAINT "BillableEvent_eventKey_key" UNIQUE ("eventKey");
ALTER TABLE "BillableEvent" ADD CONSTRAINT "BillableEvent_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "AdDelivery" ("id") ON DELETE RESTRICT;
ALTER TABLE "PublisherEarning" ADD CONSTRAINT "PublisherEarning_billableEventId_key" UNIQUE ("billableEventId");
ALTER TABLE "PublisherEarning" ADD CONSTRAINT "PublisherEarning_billableEventId_fkey" FOREIGN KEY ("billableEventId") REFERENCES "BillableEvent" ("id") ON DELETE RESTRICT;
ALTER TABLE "PublisherEarning" ADD CONSTRAINT "PublisherEarning_publisherOrganisationId_fkey" FOREIGN KEY ("publisherOrganisationId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT;
ALTER TABLE "PlatformRevenueAllocation" ADD CONSTRAINT "PlatformRevenueAllocation_billableEventId_key" UNIQUE ("billableEventId");
ALTER TABLE "PlatformRevenueAllocation" ADD CONSTRAINT "PlatformRevenueAllocation_billableEventId_fkey" FOREIGN KEY ("billableEventId") REFERENCES "BillableEvent" ("id") ON DELETE RESTRICT;
ALTER TABLE "PlatformRevenueAllocation" ADD CONSTRAINT "PlatformRevenueAllocation_platformOrganisationId_fkey" FOREIGN KEY ("platformOrganisationId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT;
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_code_key" UNIQUE ("code");
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE SET NULL;
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_reference_key" UNIQUE ("reference");
ALTER TABLE "LedgerLine" ADD CONSTRAINT "LedgerLine_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "LedgerEntry" ("id") ON DELETE CASCADE;
ALTER TABLE "LedgerLine" ADD CONSTRAINT "LedgerLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount" ("id") ON DELETE RESTRICT;
ALTER TABLE "FinancialReconciliation" ADD CONSTRAINT "FinancialReconciliation_billableEventId_key" UNIQUE ("billableEventId");
ALTER TABLE "FinancialReconciliation" ADD CONSTRAINT "FinancialReconciliation_billableEventId_fkey" FOREIGN KEY ("billableEventId") REFERENCES "BillableEvent" ("id") ON DELETE RESTRICT;
ALTER TABLE "PartnerProfile" ADD CONSTRAINT "PartnerProfile_organisationId_key" UNIQUE ("organisationId");
ALTER TABLE "PartnerProfile" ADD CONSTRAINT "PartnerProfile_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "WebhookEndpoint" ADD CONSTRAINT "WebhookEndpoint_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_endpointId_eventId_key" UNIQUE ("endpointId", "eventId");
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "WebhookEndpoint" ("id") ON DELETE CASCADE;
ALTER TABLE "IntegrationCertification" ADD CONSTRAINT "IntegrationCertification_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "SandboxScenario" ADD CONSTRAINT "SandboxScenario_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;
ALTER TABLE "SettlementBatch" ADD CONSTRAINT "SettlementBatch_publisherOrganisationId_fkey" FOREIGN KEY ("publisherOrganisationId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT;
ALTER TABLE "SettlementItem" ADD CONSTRAINT "SettlementItem_publisherEarningId_key" UNIQUE ("publisherEarningId");
ALTER TABLE "SettlementItem" ADD CONSTRAINT "SettlementItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "SettlementBatch" ("id") ON DELETE CASCADE;
ALTER TABLE "SettlementItem" ADD CONSTRAINT "SettlementItem_publisherOrganisationId_fkey" FOREIGN KEY ("publisherOrganisationId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT;
ALTER TABLE "PayoutAttempt" ADD CONSTRAINT "PayoutAttempt_idempotencyKey_key" UNIQUE ("idempotencyKey");
ALTER TABLE "PayoutAttempt" ADD CONSTRAINT "PayoutAttempt_settlementItemId_fkey" FOREIGN KEY ("settlementItemId") REFERENCES "SettlementItem" ("id") ON DELETE CASCADE;
ALTER TABLE "PublisherStatement" ADD CONSTRAINT "PublisherStatement_settlementBatchId_key" UNIQUE ("settlementBatchId");
ALTER TABLE "PublisherStatement" ADD CONSTRAINT "PublisherStatement_statementNumber_key" UNIQUE ("statementNumber");
ALTER TABLE "PublisherStatement" ADD CONSTRAINT "PublisherStatement_publisherOrganisationId_fkey" FOREIGN KEY ("publisherOrganisationId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT;
ALTER TABLE "PublisherStatement" ADD CONSTRAINT "PublisherStatement_settlementBatchId_fkey" FOREIGN KEY ("settlementBatchId") REFERENCES "SettlementBatch" ("id") ON DELETE RESTRICT;
ALTER TABLE "TrustInvestigation" ADD CONSTRAINT "TrustInvestigation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE SET NULL;
ALTER TABLE "TrustInvestigation" ADD CONSTRAINT "TrustInvestigation_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User" ("id") ON DELETE SET NULL;
ALTER TABLE "SupportCase" ADD CONSTRAINT "SupportCase_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE SET NULL;
ALTER TABLE "SupportCase" ADD CONSTRAINT "SupportCase_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User" ("id") ON DELETE SET NULL;
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE SET NULL;
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User" ("id") ON DELETE SET NULL;
ALTER TABLE "ServiceHealthSnapshot" ADD CONSTRAINT "ServiceHealthSnapshot_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE SET NULL;
ALTER TABLE "ScheduledReport" ADD CONSTRAINT "ScheduledReport_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE CASCADE;

CREATE INDEX "OrganisationMembership_organisationId_status_idx" ON "OrganisationMembership" ("organisationId", "status");
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session" ("userId", "expiresAt");
CREATE INDEX "Session_organisationId_expiresAt_idx" ON "Session" ("organisationId", "expiresAt");
CREATE INDEX "UserToken_userId_purpose_expiresAt_idx" ON "UserToken" ("userId", "purpose", "expiresAt");
CREATE INDEX "OrganisationInvitation_organisationId_status_idx" ON "OrganisationInvitation" ("organisationId", "status");
CREATE INDEX "OrganisationInvitation_email_status_idx" ON "OrganisationInvitation" ("email", "status");
CREATE INDEX "ServiceAccount_organisationId_status_idx" ON "ServiceAccount" ("organisationId", "status");
CREATE INDEX "ApiCredential_organisationId_status_idx" ON "ApiCredential" ("organisationId", "status");
CREATE INDEX "AuditLog_organisationId_createdAt_idx" ON "AuditLog" ("organisationId", "createdAt");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog" ("entityType", "entityId");
CREATE INDEX "OutboxEvent_status_availableAt_idx" ON "OutboxEvent" ("status", "availableAt");
CREATE INDEX "OutboxEvent_correlationId_idx" ON "OutboxEvent" ("correlationId");
CREATE INDEX "PublisherVerification_publisherProfileId_status_idx" ON "PublisherVerification" ("publisherProfileId", "status");
CREATE INDEX "Property_organisationId_status_idx" ON "Property" ("organisationId", "status");
CREATE INDEX "Placement_propertyId_status_idx" ON "Placement" ("propertyId", "status");
CREATE INDEX "SdkRegistration_organisationId_status_idx" ON "SdkRegistration" ("organisationId", "status");
CREATE INDEX "SdkRegistration_propertyId_platform_idx" ON "SdkRegistration" ("propertyId", "platform");
CREATE INDEX "WalletTransaction_walletId_createdAt_idx" ON "WalletTransaction" ("walletId", "createdAt");
CREATE INDEX "Campaign_organisationId_status_idx" ON "Campaign" ("organisationId", "status");
CREATE INDEX "LineItem_campaignId_status_idx" ON "LineItem" ("campaignId", "status");
CREATE INDEX "Creative_organisationId_status_idx" ON "Creative" ("organisationId", "status");
CREATE INDEX "CreativeReview_creativeId_createdAt_idx" ON "CreativeReview" ("creativeId", "createdAt");
CREATE INDEX "AdRequest_placementId_receivedAt_idx" ON "AdRequest" ("placementId", "receivedAt");
CREATE INDEX "AdRequest_publisherOrganisationId_status_idx" ON "AdRequest" ("publisherOrganisationId", "status");
CREATE INDEX "AuctionBid_auctionId_eligible_bidCpm_idx" ON "AuctionBid" ("auctionId", "eligible", "bidCpm");
CREATE INDEX "BudgetReservation_walletId_status_expiresAt_idx" ON "BudgetReservation" ("walletId", "status", "expiresAt");
CREATE INDEX "FrequencyExposure_userKeyHash_lineItemId_occurredAt_idx" ON "FrequencyExposure" ("userKeyHash", "lineItemId", "occurredAt");
CREATE INDEX "AdDelivery_status_issuedAt_idx" ON "AdDelivery" ("status", "issuedAt");
CREATE INDEX "DeliveryMeasurementEvent_deliveryId_eventType_occurredAt_idx" ON "DeliveryMeasurementEvent" ("deliveryId", "eventType", "occurredAt");
CREATE INDEX "ViewabilityAssessment_deliveryId_assessedAt_idx" ON "ViewabilityAssessment" ("deliveryId", "assessedAt");
CREATE INDEX "FraudAssessment_deliveryId_status_assessedAt_idx" ON "FraudAssessment" ("deliveryId", "status", "assessedAt");
CREATE INDEX "ConversionEvent_deliveryId_occurredAt_idx" ON "ConversionEvent" ("deliveryId", "occurredAt");
CREATE INDEX "AttributionRecord_deliveryId_attributedAt_idx" ON "AttributionRecord" ("deliveryId", "attributedAt");
CREATE INDEX "BillableEvent_status_qualifiedAt_idx" ON "BillableEvent" ("status", "qualifiedAt");
CREATE INDEX "PublisherEarning_publisherOrganisationId_availableAt_idx" ON "PublisherEarning" ("publisherOrganisationId", "availableAt");
CREATE INDEX "LedgerEntry_occurredAt_status_idx" ON "LedgerEntry" ("occurredAt", "status");
CREATE INDEX "LedgerLine_accountId_entryId_idx" ON "LedgerLine" ("accountId", "entryId");
CREATE INDEX "FinancialReconciliation_status_createdAt_idx" ON "FinancialReconciliation" ("status", "createdAt");
CREATE INDEX "WebhookEndpoint_organisationId_status_idx" ON "WebhookEndpoint" ("organisationId", "status");
CREATE INDEX "WebhookDelivery_status_nextAttemptAt_idx" ON "WebhookDelivery" ("status", "nextAttemptAt");
CREATE INDEX "IntegrationCertification_organisationId_status_idx" ON "IntegrationCertification" ("organisationId", "status");
CREATE INDEX "SandboxScenario_organisationId_status_idx" ON "SandboxScenario" ("organisationId", "status");
CREATE INDEX "SettlementBatch_publisherOrganisationId_status_scheduledFor_idx" ON "SettlementBatch" ("publisherOrganisationId", "status", "scheduledFor");
CREATE INDEX "SettlementItem_batchId_status_idx" ON "SettlementItem" ("batchId", "status");
CREATE INDEX "PayoutAttempt_status_nextRetryAt_idx" ON "PayoutAttempt" ("status", "nextRetryAt");
CREATE INDEX "PublisherStatement_publisherOrganisationId_periodEnd_idx" ON "PublisherStatement" ("publisherOrganisationId", "periodEnd");
CREATE INDEX "TrustInvestigation_status_severity_createdAt_idx" ON "TrustInvestigation" ("status", "severity", "createdAt");
CREATE INDEX "TrustInvestigation_subjectType_subjectId_idx" ON "TrustInvestigation" ("subjectType", "subjectId");
CREATE INDEX "SupportCase_status_priority_createdAt_idx" ON "SupportCase" ("status", "priority", "createdAt");
CREATE INDEX "Incident_status_severity_startedAt_idx" ON "Incident" ("status", "severity", "startedAt");
CREATE INDEX "ServiceHealthSnapshot_service_region_observedAt_idx" ON "ServiceHealthSnapshot" ("service", "region", "observedAt");
CREATE INDEX "ScheduledReport_organisationId_status_nextRunAt_idx" ON "ScheduledReport" ("organisationId", "status", "nextRunAt");

CREATE INDEX IF NOT EXISTS "OutboxEvent_unpublished_idx" ON "OutboxEvent" ("createdAt") WHERE "publishedAt" IS NULL;
CREATE INDEX IF NOT EXISTS "WebhookDelivery_retry_idx" ON "WebhookDelivery" ("nextAttemptAt") WHERE "status" IN ('PENDING','RETRYING');
CREATE INDEX IF NOT EXISTS "BudgetReservation_expiry_idx" ON "BudgetReservation" ("expiresAt") WHERE "status" = 'RESERVED';
