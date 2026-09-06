# FIXFLOW3-R4A — SPECIALIZED CONTENT ENFORCEMENT

Patch after production screenshots showed widespread fallback to the old generic slider panel.

## Fixed classes
- QR create / scan / check-in
- External app discovery
- TV / screen / 1080p / 4K / 8K output validation
- AI Sales / Bill Check / Ticket Check / One Click AI
- device/camera/micro/capture runtime states
- mixer audio/lighting controls
- media upload/render/export
- inventory/order lookup
- all remaining actions now use semantic runtime content rather than blind slider fallback

## Existing specialized content retained
- TemplateVideoBuilder
- ProductCreateForm
- AIFlashWorkspace
- MediaConnectionPanel
- PaymentCenter / Sticker / Appearance / Security / Privacy

Rule: no recognized intent may fall back to the blind FunctionalTaskPanel/slider pattern.
