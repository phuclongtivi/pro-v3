# R4B6 Runtime Integrity — PRO

Build: PASS. Action source coverage: 155/155. Runtime list IDs are normalized and must pass browser uniqueness audit after deploy.

Implemented: receipt-only success policy; simulator/production executor separation; signed receipt contract; Connect discovery + explicit one-tap consent; no fake Connected; dynamic 60-second event QR routed to the highest-priority active activity; server-side Evolution metrics schema; quarterly evolution policy gate; Openverse free-resource search with license/source/attribution evidence; hydration-safe EventSpace state; restored A versus B+C brand divider.

Deployment requirements: run `db/005_runtime_integrity.sql`; configure `DATABASE_URL`, `LONG_RECEIPT_SECRET` (32+ chars), `LONG_QR_SECRET` (32+ chars); keep `LONG_RUNTIME_MODE=production`; configure provider credentials and real device/job adapters before enabling their actions.

Release rule: missing API/provider/device/job receipt means pending/gated, never success/LIVE/CONNECTED. Browser/device integration and real hardware tests remain mandatory after deployment.
