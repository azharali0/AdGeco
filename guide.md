# AdGeco Project Scope Guide

## 🏢 Project Overview
**AdGeco** is a comprehensive, multi-tenant advertising technology platform designed to operate similarly to Google Ads. It serves as a marketplace connecting **Publishers** (who sell ad space on websites/apps) and **Advertisers** (who bid on that space). 

The platform handles everything from user onboarding and wallet funding to real-time ad auctions, click/impression tracking, fraud detection, and automated financial settlements (revenue splitting 70/30).

**Current Status:** The repository is currently at a "pre-production engineering baseline" (ADG-RRP-6 level). It is feature-complete but requires rigorous local verification, testing, and production environment provisioning before it can be certified for a live deployment with real money.

---

## 🗂️ Codebase Architecture

The project is built as a **TypeScript Monorepo** managed by `pnpm` (with Corepack enabled). It is divided into 10 runnable applications and 17 shared packages.

### 📁 apps/ (The 10 Runnable Applications)
These are the executing programs, structured heavily around a microservices pattern:
1. **`api`** (Port 3001): The "Main Brain." A monolithic Fastify REST API handling all core routing (auth, campaigns, etc.). Note: `src/server.ts` is exceptionally large (95KB, 218 dense lines) and is a critical risk area.
2. **`web`** (Port 3000): The user-facing Next.js frontend with 13 distinct dashboards (Publisher, Advertiser, Admin, Operations, etc.). Strictly adheres to a clean, gradient-free design policy.
3. **`worker`**: Background job processor (emails, webhooks).
4. **`exchange-service`** (Port 3010): The real-time bidding auction engine.
5. **`measurement-service`** (Port 3011): Tracks renders, impressions, and clicks.
6. **`fraud-service`** (Port 3012): Bot and invalid traffic detection.
7. **`ledger-service`** (Port 3013): Double-entry bookkeeping engine.
8. **`settlement-service`** (Port 3014): Calculates publisher payouts and withholding taxes.
9. **`notification-service`**: Handles internal notifications.
10. **`reporting-service`**: Generates analytics and metrics.

### 📁 packages/ (The 17 Shared Libraries)
These are reusable internal libraries heavily imported across the `apps/`:
*   **`database`**: The single source of truth. Uses Prisma ORM connected to PostgreSQL. The `schema.prisma` file is massive (1,100+ lines, 40+ tables, 59 enums).
*   **`contracts`**: Defines the 17 unique user roles, canonical events, and shared TypeScript interfaces.
*   **`domain`**: Contains the core, critical business logic (auction selection, revenue splitting math, ledger assertion).
*   **`auth`**: Handles JWT sessions, TOTP MFA, bcrypt hashing, and Role-Based Access Control (RBAC).

---

## 🔄 The Core Data & Money Flow
Understanding this flow is crucial to understanding the entire system:
1.  **Funding:** Advertiser adds funds to their wallet.
2.  **Campaign:** Advertiser creates a campaign with a budget and targeting.
3.  **Auction:** Publisher's app requests an ad → API routes it → `exchange-service` runs an auction.
4.  **Reservation:** Winning bid amount is reserved from the advertiser's wallet.
5.  **Delivery & Tracking:** Ad is rendered to the user → `measurement-service` tracks it → `fraud-service` qualifies it.
6.  **Revenue Split:** `domain` logic splits the revenue (70% to publisher, 30% to platform).
7.  **Accounting:** `ledger-service` posts a balanced, double-entry ledger record.
8.  **Payout:** `settlement-service` batches earnings and pays the publisher.

---

## 🚀 Key Tooling & Commands

*   **Package Management:** `pnpm` (must use `--frozen-lockfile`)
*   **Database Setup:** `pnpm db:generate`, `pnpm db:validate`, `pnpm db:migrate`
*   **Quality Gates:** `pnpm typecheck`, `pnpm test`
*   **Build & Run:** `pnpm build`, `pnpm --filter @adgeco/api dev`
*   **Docker Orchestration:** `docker compose up -d` (Spins up Postgres, Redis, and all 11 services)
*   **Certification Gates:** `npm run proof:local`, `npm run proof:converged`

---

## ⚠️ Known Risks & Priorities
When working in this codebase, pay special attention to:
1.  **The API Monolith:** Any changes to `apps/api/src/server.ts` must be thoroughly tested as it controls the entire platform's routing.
2.  **Financial Integrity:** Modifications to `packages/domain` or `apps/ledger-service` carry high risk. The double-entry bookkeeping logic is unforgiving.
3.  **Docker Networking:** Ensuring all microservices can communicate over the Docker network correctly when testing locally.
4.  **Strict UI Policies:** The frontend (`apps/web`) has strict design convergence gates (e.g., no gradients allowed).
