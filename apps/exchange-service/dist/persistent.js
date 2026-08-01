import { Prisma } from '@prisma/client';
import { withSerializableRetry } from '@adgeco/service-runtime';
const asRecord = (v) => v && typeof v === 'object' && !Array.isArray(v) ? v : {};
const arr = (v) => Array.isArray(v) ? v.map(String) : [];
export async function executePersistentAuction(prisma, input) {
    return withSerializableRetry(() => prisma.$transaction(async (tx) => {
        const existing = await tx.adRequest.findUnique({ where: { requestKey: input.requestKey }, include: { auction: { include: { decision: true, delivery: true } } } });
        if (existing?.auction?.decision)
            return existing.auction;
        const placement = await tx.placement.findUnique({ where: { id: input.placementId }, include: { property: { include: { sdkRegistrations: true } }, inventoryPolicy: true } });
        if (!placement || placement.status !== 'ACTIVE')
            throw new Error('INVENTORY_NOT_ACTIVE');
        const sdk = placement.property.sdkRegistrations.find((s) => s.id === input.sdkRegistrationId && s.status === 'ACTIVE');
        if (!sdk)
            throw new Error('SDK_NOT_ACTIVE');
        const request = existing ?? await tx.adRequest.create({ data: { requestKey: input.requestKey, publisherOrganisationId: placement.property.organisationId, propertyId: placement.propertyId, placementId: placement.id, sdkRegistrationId: sdk.id, countryCode: input.countryCode, language: input.language, deviceType: input.deviceType, channel: input.channel, userKeyHash: input.userKeyHash, contextualData: (input.contextualData ?? Prisma.JsonNull) } });
        const auction = await tx.auction.upsert({ where: { adRequestId: request.id }, create: { adRequestId: request.id, floorCpm: placement.floorCpm ?? placement.inventoryPolicy?.floorCpm ?? 0 }, update: {} });
        const campaigns = await tx.campaign.findMany({ where: { status: 'ACTIVE', startAt: { lte: new Date() }, endAt: { gt: new Date() } }, include: { lineItems: { where: { status: 'ACTIVE' } }, creatives: { where: { status: 'APPROVED' } }, organisation: { include: { advertiserWallet: true } } } });
        const candidates = [];
        for (const campaign of campaigns) {
            const wallet = campaign.organisation.advertiserWallet;
            if (!wallet || wallet.currency !== campaign.currency)
                continue;
            for (const line of campaign.lineItems) {
                const targeting = asRecord(line.targeting);
                const countries = arr(targeting.countries);
                const devices = arr(targeting.deviceTypes);
                const channels = arr(targeting.channels);
                const reasons = [];
                if (countries.length && (!input.countryCode || !countries.includes(input.countryCode)))
                    reasons.push('COUNTRY');
                if (devices.length && !devices.includes(input.deviceType))
                    reasons.push('DEVICE');
                if (channels.length && !channels.includes(input.channel))
                    reasons.push('CHANNEL');
                const creative = campaign.creatives[0];
                if (!creative)
                    reasons.push('CREATIVE');
                const bid = Number(line.bidAmount);
                if (bid < Number(auction.floorCpm))
                    reasons.push('FLOOR');
                if (Number(wallet.availableBalance) < bid / 1000)
                    reasons.push('BUDGET');
                if (creative)
                    candidates.push({ campaignId: campaign.id, lineItemId: line.id, creativeId: creative.id, organisationId: campaign.organisationId, bid, walletId: wallet.id, reasons });
            }
        }
        candidates.sort((a, b) => b.bid - a.bid || a.lineItemId.localeCompare(b.lineItemId));
        const eligible = candidates.filter(c => !c.reasons.length);
        for (const [rank, c] of candidates.entries())
            await tx.auctionBid.upsert({ where: { auctionId_lineItemId_creativeId: { auctionId: auction.id, lineItemId: c.lineItemId, creativeId: c.creativeId } }, create: { auctionId: auction.id, campaignId: c.campaignId, lineItemId: c.lineItemId, creativeId: c.creativeId, advertiserOrganisationId: c.organisationId, bidCpm: c.bid, eligible: !c.reasons.length, rejectionReasons: c.reasons, rank: rank + 1 }, update: { eligible: !c.reasons.length, rejectionReasons: c.reasons, rank: rank + 1, bidCpm: c.bid } });
        if (!eligible.length) {
            const decision = await tx.auctionDecision.upsert({ where: { auctionId: auction.id }, create: { auctionId: auction.id, status: 'NO_FILL', noFillReason: 'NO_ELIGIBLE_DEMAND', evidence: { candidateCount: candidates.length } }, update: {} });
            await tx.auction.update({ where: { id: auction.id }, data: { status: 'NO_FILL', eligibleBidCount: 0, completedAt: new Date() } });
            await tx.adRequest.update({ where: { id: request.id }, data: { status: 'NO_FILL', processedAt: new Date() } });
            await tx.outboxEvent.create({ data: { organisationId: request.publisherOrganisationId, type: 'AuctionNoFill', correlationId: input.requestKey, payload: { auctionId: auction.id, decisionId: decision.id } } });
            return { ...auction, decision };
        }
        const winner = eligible[0];
        const charge = Number((winner.bid / 1000).toFixed(6));
        const wallet = await tx.advertiserWallet.findUniqueOrThrow({ where: { id: winner.walletId } });
        if (Number(wallet.availableBalance) < charge)
            throw new Error('INSUFFICIENT_BUDGET');
        await tx.advertiserWallet.update({ where: { id: wallet.id }, data: { availableBalance: { decrement: new Prisma.Decimal(charge) }, reservedBalance: { increment: new Prisma.Decimal(charge) } } });
        const reservation = await tx.budgetReservation.create({ data: { requestKey: input.requestKey, walletId: wallet.id, campaignId: winner.campaignId, lineItemId: winner.lineItemId, amount: charge, currency: wallet.currency, expiresAt: new Date(Date.now() + 5 * 60_000) } });
        const decision = await tx.auctionDecision.upsert({ where: { auctionId: auction.id }, create: { auctionId: auction.id, status: 'WINNER', advertiserOrganisationId: winner.organisationId, campaignId: winner.campaignId, lineItemId: winner.lineItemId, creativeId: winner.creativeId, winningBidCpm: winner.bid, clearingPriceCpm: winner.bid, budgetReservationId: reservation.id, evidence: { rank: 1, candidateCount: candidates.length } }, update: {} });
        await tx.auction.update({ where: { id: auction.id }, data: { status: 'COMPLETED', eligibleBidCount: eligible.length, completedAt: new Date() } });
        await tx.adRequest.update({ where: { id: request.id }, data: { status: 'AUCTIONED', processedAt: new Date() } });
        await tx.outboxEvent.create({ data: { organisationId: winner.organisationId, type: 'AuctionWon', correlationId: input.requestKey, payload: { auctionId: auction.id, decisionId: decision.id, reservationId: reservation.id } } });
        return { ...auction, decision };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }));
}
