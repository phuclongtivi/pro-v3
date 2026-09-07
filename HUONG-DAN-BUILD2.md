# LONG APP V3 — BUILD 2 EVENT BACKEND / QR / CHAT / PRESENCE

Build 2 includes Build 1 plus:
- Event DB (Neon/Postgres)
- Create Event Space
- Public event token / QR
- Guest Join
- Role resolution (owner/organizer/moderator/host/artist/guest/audience)
- Presence heartbeat and online list
- Event-scoped chat
- Real file upload with Vercel Blob
- Server-side 3MB limit
- Chat read-only after event end
- Permanent message/member/blob cleanup at eventEndAt + 36h
- Hourly Vercel Cron cleanup

## Required services
1. Neon Postgres
2. Vercel Blob

## Install locally
Copy this Build 2 over the Build 1 branch/repo, then:
npm install

## Neon
Run:
db/002_event_space.sql

## Vercel Environment Variables
DATABASE_URL = Neon connection string
BLOB_READ_WRITE_TOKEN = Vercel Blob token
CRON_SECRET = long random secret

Apply to Preview and Production as appropriate.

## Safe branch
git switch -c build2-event-backend
# Copy files
npm install
npm run build

Only if build succeeds:
git add .
git commit -m "Build 2: Event backend QR chat and presence"
git push -u origin build2-event-backend

## Test order
1. /event/create → create event
2. Event page loads → Guest Join
3. Open same event in second browser/device → both appear online
4. Chat text in both directions
5. Upload a file under 3MB
6. Upload a file over 3MB → must be rejected
7. Assign role through API only after owner/organizer auth data exists
8. Post-event chat is read-only
9. Cleanup API is protected by CRON_SECRET

## Security note
Build 2 provides event role storage and basic permission checks, but full user authentication/account
claiming is intentionally deferred to Build 3. For production use, connect accountId to your actual auth provider
before allowing privileged organizer actions.

## Vercel Cron
Vercel invokes cron GET requests. The cleanup route requires:
Authorization: Bearer $CRON_SECRET
Configure the same secret in Vercel.
