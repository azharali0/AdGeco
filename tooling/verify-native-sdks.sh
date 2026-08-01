#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
(cd packages/sdk-android && npm run typecheck)
(cd packages/sdk-ios && npm run typecheck)
(cd packages/sdk-unity && npm run typecheck)
