# ADG-LAUNCH-CERTIFICATION-1 — Final Launch Certification Report

Release: **1.2.0-launch-candidate.1**
Decision: **CONDITIONAL-NO-GO**
Generated: 2026-07-27T10:05:57.725Z

## Gate summary

| Status | Count |
|---|---:|
| PASS | 5 |
| AVAILABLE | 0 |
| BLOCKED | 23 |
| FAIL | 0 |

## Certification gates

| Gate | Domain | Status | Evidence or reason |
|---|---|---|---|
| repository-proof | repository | PASS | certification/launch-certification/evidence/repository-proof.log |
| native-sdk-compiler-proof | sdk | PASS | certification/launch-certification/evidence/native-sdk-compiler-proof.log |
| source-sbom | supply-chain | PASS | certification/launch-certification/evidence/source-sbom.log |
| migration-static-integrity | database | PASS | certification/launch-certification/evidence/migration-static-integrity.log |
| deployment-static-integrity | infrastructure | PASS | certification/launch-certification/evidence/deployment-static-integrity.log |
| canonical-lockfile | build | BLOCKED | pnpm-lock.yaml is absent and registry DNS is unavailable. |
| internet-clean-room | build | BLOCKED | The execution environment cannot resolve registry.npmjs.org. |
| frozen-install-and-workspace-build | build | BLOCKED | Requires registry access and the committed canonical lockfile. |
| container-build-sign-scan | containers | BLOCKED | Docker, cosign, Syft and Trivy are unavailable. |
| postgres-runtime-certification | database | BLOCKED | A production-equivalent PostgreSQL endpoint and psql are unavailable. |
| kubernetes-multiregion-certification | infrastructure | BLOCKED | kubectl, cluster credentials and multi-region targets are unavailable. |
| provider-payments | providers | BLOCKED | Missing required environment variables: PAYMENT_PROVIDER_URL, PAYMENT_PROVIDER_KEY |
| provider-payouts | providers | BLOCKED | Missing required environment variables: PAYOUT_PROVIDER_URL, PAYOUT_PROVIDER_KEY |
| provider-kyb | providers | BLOCKED | Missing required environment variables: VERIFICATION_PROVIDER_URL, VERIFICATION_PROVIDER_KEY |
| provider-consent | providers | BLOCKED | Missing required environment variables: CONSENT_PROVIDER_URL, CONSENT_PROVIDER_KEY |
| provider-tax | providers | BLOCKED | Missing required environment variables: TAX_PROVIDER_URL, TAX_PROVIDER_KEY |
| provider-email | providers | BLOCKED | Missing required environment variables: EMAIL_PROVIDER_URL, EMAIL_PROVIDER_KEY |
| provider-storage | providers | BLOCKED | Missing required environment variables: OBJECT_STORAGE_UPLOAD_URL, OBJECT_STORAGE_PUBLIC_URL |
| provider-cdn | providers | BLOCKED | Missing required environment variables: CDN_DISTRIBUTION_ID, CDN_INVALIDATION_ROLE |
| browser-e2e | experience | BLOCKED | A deployed browser test environment is unavailable. |
| android-real-device | sdk | BLOCKED | ANDROID_SERIAL is not configured. |
| ios-real-device | sdk | BLOCKED | IOS_DEVICE_UDID is not configured. |
| unity-runtime | sdk | BLOCKED | UNITY_EDITOR_PATH is not configured. |
| independent-security-certification | security | BLOCKED | Independent penetration testing and internet-backed vulnerability databases are unavailable. |
| load-stress-soak | performance | BLOCKED | A deployed production-like environment and traffic generators are unavailable. |
| backup-restore-failover-dr | resilience | BLOCKED | Managed database, object storage and multi-region infrastructure are unavailable. |
| controlled-commercial-pilot | pilot | BLOCKED | No live pilot publishers, advertisers, approved spend or provider accounts are connected. |
| financial-reconciliation | finance | BLOCKED | Real spend, fees, tax, earnings, settlement and payout evidence is unavailable. |

## Certification conclusion

Repository-backed gates passed where available, but launch remains blocked until every BLOCKED gate is executed in the required external environment.
