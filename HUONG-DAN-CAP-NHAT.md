# HƯỚNG DẪN CẬP NHẬT LONG APP V3 — BUILD 1 CORE UI

Repo đích: phuclongtivi/mobi-v3

## File thay thế / thêm mới
- app/page.tsx
- app/studio/page.tsx
- app/store/page.tsx
- app/me/page.tsx
- app/event/[token]/page.tsx
- app/globals.css
- lib/navigation.ts

KHÔNG thay:
- package.json
- app/layout.tsx
- components/TopNav.tsx
- components/BrandFooter.tsx
- components/ThemePicker.tsx

## Cách làm an toàn
1) Trong Git Bash tại repo mobi-v3:
   git status
   git switch -c build1-core-ui-eventspace

2) Copy các file trong ZIP vào đúng vị trí, chọn Replace khi được hỏi.

3) Chạy:
   npm install
   npm run build

4) CHỈ nếu build thành công:
   git add app/page.tsx app/studio/page.tsx app/store/page.tsx app/me/page.tsx app/event lib/navigation.ts app/globals.css
   git commit -m "Build 1: Long V3 core UI and Event Space"
   git push -u origin build1-core-ui-eventspace

5) Vercel sẽ tạo Preview cho branch. Kiểm tra Preview trước khi merge main.

## Phạm vi Build 1
Đã có: 13 Core Key, Home Event Hub, Event Gate/Event Space, Guest Join UI, timeline PRE/LIVE/POST, cây Studio/Store/Me mới.
Chưa có backend production: DB event, realtime chat/presence, upload thật, scheduler +36h, AI Job, pairing TV.
