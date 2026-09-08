# FIXFLOW3-R4B2 ROLE-AWARE CONTENT ROUTING

Mục tiêu: không chỉ map content theo nghĩa của node, mà còn theo object + vai trò/quyền runtime.

## Core pipeline
NODE -> OBJECT -> ROLE/OWNERSHIP -> PERMISSION -> RUNTIME STATE -> SPECIALIZED COMPONENT -> ACTION -> END

## Thay đổi chính
- Public event notice mặc định READ-ONLY viewer.
- Event viewer có: Xem Flash, Chia sẻ, Tham gia · END.
- Event editor chỉ mở khi canEdit=true.
- My Events mutation yêu cầu runtime ownership/editor proof.
- Chat member/role management yêu cầu runtime room role.
- Buyer/Seller/Self/Operator/Participant routing matrix.
- Không còn nested Semantic workspace breadcrumb, tránh duplicate crumbs/vạch chia Tree5.
- Public event list bỏ forced labels `Check / Watch / Read` và `Confirm / Read / Add`.
- Thêm `npm run audit:role-aware`.

## Lưu ý runtime
Placeholder `Thông báo 1/2/3` chưa phải eventId thật. Viewer cho phép đọc/preview UI; JOIN thật phải có eventId runtime/API. Không tạo dữ liệu giả.
