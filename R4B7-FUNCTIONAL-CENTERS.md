# LONG R4B7 — Functional Centers and Per-Control Integrity

## Delivered

- Store opens the full API-backed warehouse by default, with query, category and priority/newest/price sorting.
- Events expose the five horizontal controls requested by Boss; Gift is the default filter and results render below the filter row.
- Event creation uses structured time/type/status/location/gift/ticket fields instead of one free-text field.
- Each AI has a configuration workspace for identity, appearance, tone, greeting, advisory rules, knowledge sources, handoff and channels.
- Mixer is an integrated console with microphone permission, input selection, level meter, gain/pan/fader, mute/solo, presets and authenticated persistence.
- Chat Room is an integrated chat window with room entry, timeline, attachment and send controls.
- Google/Facebook/Zalo/Apple login buttons now enter server-side OAuth flows and persist signed sessions.
- Decorative breadcrumbs were changed from dead buttons to text labels.
- Source and SSR runtime audits reject duplicate IDs, list controls with static IDs, missing IDs and dead buttons.

## Required migrations

Run in order: `006_event_filter_fields.sql`, `007_user_oauth_accounts.sql`, `008_functional_centers.sql` after the earlier R4B6 migrations.

## Required external inputs

`DATABASE_URL`, `AUTH_SESSION_SECRET`, and the chosen provider credentials are required. Facebook Messenger/Zalo OA advisory delivery, payment, production media rendering and physical-device output remain gated until their provider applications, webhooks, tokens or hardware adapters return a verified receipt. The UI must not report success before that receipt exists.
