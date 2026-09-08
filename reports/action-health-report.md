# Action Health Report — 2026-09-08

## Coverage

| Surface | Controls | Unique Action IDs | Contract records | Build |
| --- | ---: | ---: | ---: | --- |
| Long ProTivi | 165 | 165 | 165 | PASS |
| Mobi | 165 | 165 | 165 | PASS |
| longTV | 3 | 3 | 3 | PASS |
| **Total** | **333** | **333** | **333** | **PASS** |

## Health interpretation

- Structural coverage is 100%: every `<button>` declares a literal `data-action-id` and every ID produces one registry record.
- Duplicate IDs: 0.
- Verified executor/permission/input/receipt mappings: 0/333 in the generated baseline registry.
- All generated contracts therefore remain `gated`; they must not be represented as completed, connected, paid, published or live.
- Existing API routes and specialized component handlers have not yet been promoted to `active`; promotion requires a per-action owner review and receipt mapping.

## Highest-risk existing behaviors

1. UI-local `done`, `status` and `completed` state changes can still look successful without a backend/provider receipt.
2. Payment method confirmation is local UI state and is not a payment receipt.
3. Room creation reports validated configuration but has no room/session creation receipt.
4. Mixer persistence remains unavailable without authenticated backend persistence.
5. Display `TAKE LIVE` and device/connect actions need adapter receipts and role/permission enforcement.

## Release decision

**BLOCKED.** Structural P0 is complete; executor wiring and runtime simulation remain required.
