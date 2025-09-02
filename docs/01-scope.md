# 01 — Scope (running backlog of small tasks)

## Template (copy for each mini-task)
### Title:
### Goal (1–2 lines):
### Acceptance Criteria (bullet list):
### Risks/Constraints:
### Out of Scope:

---

### EXAMPLE: Queue outbound scan (PENDING)
Goal: When Operator scans a barcode for a selected release, save a row with status=PENDING.
Acceptance:
- Duplicate (same release+barcode) is rejected with friendly error
- Works offline (queued write) and reconciles on reconnect
- Creates an audit log entry
Risks: barcode timing quirks, offline race conditions
Out of scope: UI styling, BOL generation
