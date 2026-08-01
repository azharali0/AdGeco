# AdGeco Canonical Monorepo — ADG-RRP-4

**Version 0.50.0** — Persistent dedicated transactional runtimes with evidence-based cutover.

# AdGeco Canonical Monorepo

Current remediation level: **ADG-RRP-1 / 0.30.0**.

See `docs/remediation/ADG-RRP-1.md` for implemented capabilities, evidence and the remaining production proof boundary.

# AdGeco Canonical Monorepo — Deep Remediation Baseline

AdGeco is a multi-tenant advertising marketplace covering publisher onboarding, advertiser campaigns, real-time auction decisions, creative delivery, measurement, fraud screening, ledger posting, settlements, operations and developer integrations.

This repository is a **pre-production engineering baseline**. It does not claim deployment certification until the networked CI, PostgreSQL, mobile builds, cloud infrastructure and external-provider gates pass.

## Implemented runtime

- Fastify API with identity, organisations, RBAC and tenant enforcement.
- Publisher properties, placements, inventory policies and SDK registrations.
- Advertiser wallets, campaigns, line items, targeting and creative review.
- Real-time request validation, eligibility, auction decisions and budget reservations.
- Signed delivery tokens, render/click/video measurement and failure release.
- Viewability/fraud assessments, attribution, billable events, earnings and ledger records.
- Settlement batches, payout attempts, publisher statements and operations workflows.
- Partner profiles, sandbox scenarios, certification records and webhooks.
- Transactional-outbox worker with webhook delivery/retries, email dispatch and reservation expiry.
- Executable consolidated PostgreSQL baseline migration.
- Behavioural domain tests for auction, revenue, ledger, settlement and idempotency invariants.
- Prometheus-format metrics endpoint and structured logs.
- Kubernetes and provider-neutral Terraform deployment baselines.

## Local commissioning

```bash
cp .env.example .env
corepack enable
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:validate
pnpm db:migrate
pnpm typecheck
pnpm test
pnpm build
pnpm --filter @adgeco/api dev
pnpm --filter @adgeco/worker dev
```

`docker compose up -d` starts local PostgreSQL and Redis dependencies.

## Proof boundaries

The current execution environment has no npm-registry access, running PostgreSQL, cloud account, payment/payout provider, CDN, SIEM, Android build system, Xcode or Unity editor. Those gates are configured or documented but are **not certified** in this package.

See:

- `docs/DEEP-REMEDIATION-REPORT.md`
- `docs/ROADMAP-RECONCILIATION.md`
- `infrastructure/kubernetes/production.yaml`
- `infrastructure/terraform/README.md`

## ADG-RRP-6 launch-nearness remediation

Version 0.60.0 adds safe outbox leasing, encrypted transactional identity links, complete browser identity flows, a web production container, migration/ingress/autoscaling manifests, and explicit global-launch proof gates.

Run repository evidence checks with:

```bash
npm run proof:local
bash tooling/verify-native-sdks.sh
```

See `docs/GLOBAL-LAUNCH-GAP-REGISTER.md` before any live-money or public launch decision.

## Canonical convergence release

The canonical repository version is `1.0.0-converged`. Run `npm run proof:converged` for the full inherited and convergence-specific proof chain. The repository-controlled defect register is `REPOSITORY-DEFECT-REGISTER.json`; external commissioning evidence is tracked separately and is not represented as a source-code defect.
