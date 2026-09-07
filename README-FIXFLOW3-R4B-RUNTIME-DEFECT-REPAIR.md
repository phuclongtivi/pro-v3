# FIXFLOW3-R4B - Runtime Defect Repair + Tree5 Visual Cleanup

Baseline: FIXFLOW3-R4A SPECIALIZED CONTENT ENFORCEMENT.

## Runtime defects addressed
- Event notices: specialized composer/preview/publish END.
- Gift flows: gift setup, quantity, claim rules, create/manage states.
- Live room flows: room setup, room name, preview, create END.
- Graphics overlays: Lower Third / Clock / Banner / Mascot content, preview, Apply Graphic END.
- Custom API: base URL/auth/config validation; secrets remain server-side env.
- Customer order lookup: Find Customer + Purchase History with runtime/empty states.
- Profile: real session-backed profile surface instead of blind generic content.
- Input/chat semantic guard: nodes with recognized intent no longer bypass specialized content just because kind=input/chat.
- My Stickers: removes hard-coded 1,250/demo inventory from wallet mode; uses `/api/me/stickers` if available, otherwise honest Empty/Unavailable state.
- Tree5 visual cleanup: removes the horizontal partition line between collapsed Tree3/4/5 breadcrumbs and Tree5 content.

## New audit
```bash
npm run audit:runtime-tree5
```
PRO/MOBI should run:
```bash
npm run audit:content
npm run audit:specialized
npm run audit:runtime-tree5
npm run build
```

## Runtime principles
Missing permission/config/data is not missing content. Tree5 must render one of:
`loading / ready / empty / permission-required / config-required / unavailable / error`.

No blind success. No fake seeded user inventory.
