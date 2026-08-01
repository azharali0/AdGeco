# External Launch Certification Runbook

1. Create a fresh internet-connected Linux build host and clone the exact release commit.
2. Enable Corepack, generate `pnpm-lock.yaml`, commit it, then run a frozen installation.
3. Run type-checks, tests and production builds for every workspace.
4. Build, sign, publish, SBOM and scan every production image.
5. Apply migrations to a fresh PostgreSQL cluster and rehearse rollback, concurrency and restoration.
6. Deploy to two production-like Kubernetes regions and validate DNS, TLS, secrets, telemetry and alerts.
7. Commission sandbox/live providers and validate signed, replay-safe webhooks and reconciliation.
8. Run browser and physical-device SDK suites.
9. Execute independent security, load, soak, autoscaling, backup, restore, failover and disaster-recovery tests.
10. Run a limited-spend pilot and reconcile every minor currency unit across delivery, billing, fees, tax, earnings, settlement and payout.
11. Attach evidence to the gate register and rerun `npm run certify:launch` until the decision is GO.
