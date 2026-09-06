# Long V3 — FIXFLOW3-R2 CONTENT COMPLETE

R2 keeps the FIXFLOW3 navigation/state model and fills high-priority content that existed in design but was not exposed in the UI.

## Completed / wired
- Store → Mua sắm → Thanh toán: VietQR/bank transfer, MoMo, ZaloPay, Visa/Mastercard, Apple Pay, Google Pay, COD UI + END.
- Store → Mua sắm → Sticker Store: sticker packs, points, gift/use/send flows.
- Me → Hồ sơ → Sticker của tôi: owned packs, points history, send/gift actions.
- Me → Cài đặt → Giao diện: existing ThemePicker is exposed in navigation.
- Me → Cài đặt → Âm thanh: existing Long Audio Engine is exposed in navigation.
- Me → Cài đặt → Quyền riêng tư: local-first, permissions, AI/history/data controls.
- Me → Cài đặt → Đăng nhập & bảo mật: Face ID → social → email/phone/OTP priority and Boss Login link.
- Boss login: separate `/boss/login` route using server-side TOTP verification with `BOSS_TOTP_SECRET`; successful login opens `/boss` Control Center.

## Important production boundary
Payment R2 completes navigation/UI/END coverage. It does **not** charge real money by itself. Real payments require merchant credentials and provider APIs for each enabled method. Hide unsupported methods until their provider is configured.

Boss Authenticator requires a Base32 TOTP secret in Vercel Environment Variables:
`BOSS_TOTP_SECRET=...`
Do not use `NEXT_PUBLIC_` for this secret.

## END rule
Every route must terminate in a meaningful END. Chat/media/control operations may use repeatable END and remain in their workspace; commit operations return to Group B after completion.
