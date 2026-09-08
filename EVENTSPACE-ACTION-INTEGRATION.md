# EventSpace Action Integration — P0.2

## Implemented

- Every button retains a unique literal `data-action-id`.
- `ActionRuntimeBridge` is mounted once in `AppShell`.
- Every enabled button signal is captured before its legacy handler.
- Each signal receives an invocation ID, owner-core routing and six-core trace.
- Results are recorded in `long-action-evidence-ledger-v1` (maximum 500 local entries).
- Safe navigation/local controls can receive a navigation receipt.
- Ordinary business actions remain `pending` while waiting for executor receipt.
- Risky payment/publish/delete/logout/Take Live actions are `gated` unless explicitly approved by a reviewed integration.
- The older EventSpace document-click dispatcher ignores buttons owned by the new bridge, preventing duplicate dispatch.

## Truth boundary

This release connects button signals to the EventSpace/Connection control plane. It does not manufacture provider, device, payment or media receipts. A business action is not complete until its existing API/adapter handler is migrated to settle the matching invocation with a verified receipt.

## Verification

- Action coverage: 165/165.
- Duplicate IDs: 0.
- Production build: PASS.
