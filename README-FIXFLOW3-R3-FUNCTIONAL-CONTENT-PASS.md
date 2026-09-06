# Long PRO V3 — FIXFLOW3-R3 FUNCTIONAL CONTENT PASS

R3 focuses on real functional content and store-preparation hygiene without redesigning the FIXFLOW3 navigation.

## Main changes
- AI Flash now calls a server-side provider route `/api/ai/flash` and no longer returns a fake success sentence.
- Supports OpenAI / Gemini / Anthropic by server environment variables. If none is configured, UI reports the provider is not configured.
- Home Music Engine now has Play / Stop / Next / Like, weekly playlist refresh, authorized SoundCloud/Zing candidate adapters, and 5 new original Long Ambient local fallbacks.
- Removed the previous 10 local theme tracks from the active local music library.
- HDMI/Capture path now uses browser MediaDevices: permission → scan → source select → preview/test → Connect · END.
- Generic Tree 5 action content now renders an interactive functional panel (state, parameter, notes, Test/Preview, Apply · END) instead of the placeholder sentence “Hoàn tất thao tác này để đạt END.”
- Welcome video layering hardened for mobile/fullscreen so the movie stays above the language gate/background layers.

## Important deployment configuration
Configure AI provider secrets in Vercel server Environment Variables. Do not expose keys in client code.

R3A supersedes the R3 Home-music feature: background music, online playlist sources, and local fallback tracks are removed from the app.

## Build status
Source was syntax/type-parsed for the changed TypeScript files. Full `npm install && npm run build` could not be completed in the generation environment because dependency installation timed out. Run the normal local build before Git push.
