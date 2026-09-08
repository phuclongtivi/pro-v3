# Long Pro R4B8 — Action Contract + Six-Core Receipt

## Scope completed

- 153/153 source buttons have unique Action IDs and handlers.
- Every registry entry uses `long-action/v3`, an input schema, output schema, workflow links and a six-stage execution plan.
- Every runtime invocation is routed through EventSpace, Connection, Long AI, Long Scene, Flash Flow and Media in a fixed, hash-linked order.
- Every core stage emits an HMAC-signed `long-core-receipt/v1`; the envelope verifies order, input hash, previous-receipt hash and signature.
- Internal navigation/filter/view actions may complete with a signed executor receipt.
- Device, OAuth/provider, payment and worker actions remain gated until their real adapter returns evidence. No core receipt is treated as business success.
- Canonical UI remains `Home | Phòng Thu | Store | Me`; Group A and shared B/C workspace, structured Event form, full Store warehouse, AI configuration, Mixer console and integrated Chat window are preserved.
- Pixel output policy is 720p default / 1080p option. Enhanced 4K/8K remains explicitly reconstructed output, not a native-source claim.

## Verification

- Action coverage: 153/153.
- Duplicate literal IDs: 0.
- Static IDs inside list maps: 0.
- Dead source buttons: 0.
- Six-core registry audit: 153/153.
- Production build: PASS.
- Runtime truth test: internal action = 200/success/6 verified core receipts/executor receipt; device action without ACK = 409/gated/6 verified core receipts/no executor receipt.

## Required production inputs

Set `LONG_RECEIPT_SECRET` to a private value of at least 32 characters and keep `LONG_RUNTIME_MODE=production`. Database, OAuth/provider, payment, render-worker and device credentials are still required for their corresponding actions. Missing infrastructure intentionally produces `gated`, never fake success.
