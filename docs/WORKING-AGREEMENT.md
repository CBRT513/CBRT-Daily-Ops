# Working Agreement

## Invariants
- Layers: ui / domain / data / devices only
- Idempotent writes + audit log required
- PWA wiring must remain intact
- Separation of duties enforced in code + rules

## Loop (≈35 min)
1) Write/refresh a tiny item in 01-scope.md
2) Architect proposes files & interfaces (no code yet)
3) Patch 1: domain + unit test
4) Patch 2: data adapter + integration test
5) Patch 3: UI wire-up
6) Reviewer: merge/no-merge + decisions log update

## Patch Limits
- ≤ 3 files, ≤ 50 LOC per patch; split if bigger
