# ADG-PRODUCTION-VALIDATION-1 Report

## Decision

The repository-controlled validation chain passes. The release is a **conditional production launch candidate**, not a production-certified deployment.

## Passed in this execution environment

- Complete inherited repository proof chain
- Migration static integrity validation
- Behavioural and security tests
- Tenant-isolation tests
- Exchange algorithm benchmark
- Android Kotlin compiler validation
- iOS Swift type-check
- Unity SDK source validation
- Source-manifest SPDX SBOM generation
- Runtime topology and UI policy validation

## Externally blocked gates

- Registry-backed lockfile generation and frozen installation
- Dependency-backed monorepo build
- Container build, signing, publishing, resolved SBOM and image vulnerability scanning
- Fresh PostgreSQL migration deployment and concurrency exercises
- Production-like Kubernetes deployment and autoscaling
- Live payment, payout, KYB, tax, consent, email, storage and CDN commissioning
- Physical-device SDK certification
- Independent penetration testing
- Deployed load, stress and soak testing
- Backup, restore, failover and disaster-recovery exercises
- Real publisher/advertiser campaigns and real-money reconciliation

Every blocked gate is represented in `validation-results.json`; none is recorded as passed without evidence.
