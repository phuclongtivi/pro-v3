# FIXFLOW3-R4 — Runtime Content Registry

R4 khóa mô hình 6 lớp: NODE ID → CONTENT REGISTRY → SEMANTIC MATCH → GUARD → STATE MACHINE → COVERAGE TEST.

## Sửa trực tiếp từ audit production
- `Phòng Thu → Phát sóng → Tạo video → Từ mẫu` dùng `TemplateVideoBuilder`, có template, file picker, preview, render và `Đưa vào Phát sóng · END`.
- `Store → Bán hàng → Tạo sản phẩm → Mới/Từ mẫu` dùng `ProductCreateForm`, có media, tên, giá, SKU, tồn kho, danh mục, mô tả, preview, lưu nháp và `Lưu & Đăng sản phẩm · END`.
- Fallback `FunctionalTaskPanel` slider chung được thay bằng `RuntimeActionPanel`: runtime phải trả state hợp lệ thay vì slider không liên quan.
- Giữ các specialized component đã có: AI Flash, HDMI/Capture, Payment, Sticker, Appearance/Privacy/Security.
- Nhánh `Quản lý AI và Thu-Chi` tiếp tục bị loại bỏ.

## Runtime states
`loading | ready | empty | permission-required | error | unavailable`

Thiếu dữ liệu/quyền/config không được trả màn trắng.

## Audit
```bash
npm run audit:content
npm run build
```
