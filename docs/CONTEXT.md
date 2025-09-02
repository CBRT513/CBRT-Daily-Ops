# CONTEXT — Daily Operations App

## Mission
Single, fast, offline-capable PWA for CBRT daily operations:
- Releases → Staging → Verification (separation of duties) → Loading → BOL → Shipped
- Inventory is the single source of truth (individually tracked + bulk/master-barcode)
- Audit by default, role-limited access

## Roles (MVP)
- Operator: PIN, non-persistent. Can stage, scan, load. Cannot change releases or settings.
- Office: Google SSO. Manage releases, inventory, print BOLs, resolve exceptions.
- Admin: SSO/email+password (+MFA optional). Manage roles, settings, audits, overrides.

## Non-negotiables
- Black-box layers: ui / domain / data / devices (no cross-leaks)
- Offline-first, conflict-safe, idempotent writes
- Separation of duties: stager ≠ verifier
- All critical actions logged (who/what/when)
- PWA icons/manifest/Service Worker remain wired

## Canonical Lifecycle
Entered → Staged → Verified → Loaded → Shipped → Closed

## Tech Guardrails
- React + Vite + Tailwind
- Firebase Auth (Operator PIN + SSO), Firestore, Cloud Functions (as needed)
- PWA: installable, offline, background sync where possible
- Tests: domain is pure TS and must have unit tests before adapters/UI

## Definition of Done
- Touch ≤ 3 files, ≤ 50 LOC; else split patches
- Domain change has tests (pass locally)
- No new TODOs/console noise
- Update /docs/02-decisions.md with a one-liner
