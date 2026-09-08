# App Store Readiness and Upgrade Proposal

Updated: 2026-09-08

## Current decision

**NOT READY FOR STORE SUBMISSION.** The code builds and every button enters the control plane, but production action completion is not yet proven for all critical paths.

## P0 blockers before submission

1. Replace mechanical source-order IDs with stable domain action IDs for every business control.
2. Review the 44 local-success candidates and remove every false completion state.
3. Map all 43 fetch sites to an Action Contract, timeout/error model and receipt schema.
4. Implement durable server-side Evidence Ledger and daily health aggregation.
5. Complete auth/session/role verification server-side; protect all Boss routes and APIs.
6. Connect room creation, Mixer persistence, render/export job and Flash/Pixel device adapters.
7. Complete TV pairing expiry/revoke and same-code confirmation tests.
8. Complete payment webhook verification; keep payment UI gated until then.
9. Complete Scene Purchase license/attribution/quota registry.
10. Run device/accessibility/privacy/security regression matrices.

## Connect Engine control handoff

- Boss dashboard: `/boss/actions`.
- Registry endpoint: `/api/connect/actions`, protected by Boss session.
- Daily fields: invocation count, success, pending, gated, last activity.
- Consolidation rule: no proposal before at least 7 distinct telemetry days.
- Low-use candidate threshold: at most 2 invocations in the observation window.
- Connect Engine only proposes; Boss reviews the contract, impact and rollback before modification.

## Recommended upgrade order

### Upgrade 1 — Truthful execution foundation

Prioritize Auth/Boss, Event join/chat/presence and safe local navigation. Convert handlers to `begin → execute → receipt → settle` and add idempotency.

### Upgrade 2 — Device and Media continuity

Finish TV pairing/reconnect/revoke, camera/micro capability, room session, Mixer persistence and job-backed render/export. Device ACK must be the source of Connected/LIVE state.

### Upgrade 3 — Flash/Pixel safety

Enforce source selection, Preview/Test Pattern, Validate, ARM expiry and user-confirmed TAKE LIVE. Preserve 720p safe fallback; never label reconstructed output as native 4K/8K.

### Upgrade 4 — Scene Purchase and AI economy

Implement `discover → evaluate → propose → approve → import/simulate → render → evidence`. Prefer deterministic/local/free resources; verify license and attribution. AI provider routing must honor quota and cost policy.

### Upgrade 5 — Product simplification

After at least 7–30 days of privacy-safe telemetry, let Connect Engine propose duplicate/low-use controls for Boss review. Merge controls only when they share outcome and rollback is documented.

### Upgrade 6 — Store release

Complete signing, privacy disclosures, screenshots, feature graphics, device matrices, crash monitoring, rollback and staged rollout. Submit only when all P0 action blockers are zero.

## Six-core completion criteria

| Core | Required proof before release |
| --- | --- |
| EventSpace | Role-safe event state, durable evidence and privacy-safe telemetry |
| Connection | Auth/pair/provider health receipts and revoke paths |
| Long Scene | Versioned scene/asset result and license evidence |
| Flash Flow | Workflow state and confirmation gates with rollback |
| Media | Preview/render/output artifacts and device ACK |
| Long AI | Provider/job receipts, tool boundaries, cost and consent policy |
