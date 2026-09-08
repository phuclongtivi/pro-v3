# Runtime Simulation Report — Round 2 / P0

## Executed checks

| Check | Result | Evidence |
| --- | --- | --- |
| Source contract scan | PASS | Pro 165/165, Mobi 165/165, TV 3/3 |
| Duplicate Action ID | PASS | 333 unique IDs |
| Registry generation | PASS | `reports/action-registry.json` per surface |
| Missing receipt rejection | PASS | `isVerifiedReceipt(undefined, actionId)` is false |
| Wrong-action receipt rejection | PASS | Receipt for another action is false |
| Valid success receipt acceptance | PASS | Matching ID, non-empty receipt ID and timestamp accepted |
| Production type/build | PASS | Next.js builds completed for all three surfaces |

## Not yet executed

- Per-action success/4xx/5xx/timeout/offline/malformed-receipt/permission-denied matrix.
- Browser navigation, double-click/idempotency, refresh/back, keyboard/touch and screen-reader test.
- Cross-role/spoofed identity, expired OAuth/pairing and sensitive-log security test.
- Real device matrix for camera, microphone, casting, TV pairing and display output.
- Payment webhook reconciliation and provider receipt verification.

## Truth rule

No action may move to `success` unless the receipt matches its `actionId`, has state `success`, a non-empty receipt ID and an issue timestamp. Missing receipts remain `pending`; unconfigured contracts remain `gated`.
