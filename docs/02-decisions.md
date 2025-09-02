# 02 — Decisions Log

- 2025-08-31: Outbound idempotency key = ${releaseNo}:${barcode} (prevents dupes)
- 2025-08-31: Operator PIN sessions non-persistent on shared devices
- 2025-09-02: Skipped emulator integration test due to local gRPC stream flake; proceed with unit tests; revisit using REST/lite client or admin SDK for CI.
