# FIXFLOW2B — Báo cáo rà soát Tree 5 / END

## Mục tiêu
1. Rà toàn bộ tuyến tab còn thiếu END.
2. Liệt kê nhánh đã có END riêng và nhánh dùng fallback theo ngữ cảnh.
3. Chuẩn hóa để không còn END trống hoặc END chung kiểu “Nội dung / Xem / Chỉnh sửa / Lưu / Xác nhận”.

## Kết luận
- 100% tuyến direct-to-END có nội dung END.
- 100% tuyến Cây 3 → Cây 4 nếu chưa có END riêng sẽ nhận fallback theo đúng khu vực: Phòng Thu, Home, Store, Me.
- Phòng Thu được ưu tiên sâu nhất vì đây là console điều khiển chính.

## Nhánh có END riêng — Phòng Thu / Bàn Mix
### Bàn Mix → Nguồn vào
- Mic 1–8
- Nhạc nền
- Audio USB
- Bluetooth
- Camera audio
- External apps

### Bàn Mix → Âm thanh
- Gain / Trim
- EQ
- FX1 / FX2
- AUX send
- Pan
- Mute / Solo
- Main L/R

### Bàn Mix → Ánh sáng
- Độ sáng tổng
- Nhiệt màu
- Ánh sáng sân khấu
- Đồng bộ cảnh

### Bàn Mix → Hiệu ứng
- Hiệu ứng hình
- Hiệu ứng âm
- Overlay
- Transition

### Bàn Mix → Đầu ra
- Main out
- Monitor out
- Stream out
- Record out
- Event hall out
- TV / LED out

### Bàn Mix → Preset
- Voice
- Music
- Event
- Safe
- Custom

## Nhánh có END riêng — Phòng Thu / Phát sóng
- Tạo room live
- Vào phòng nhanh
- Preview
- Đặt tên phòng
- Tạo video
- Đầu ra video → TV / LED / 4K / 8K / PXP / AI Auto Fit
- Flash Flow → Intro / Transition / Idle video / Chạy Flow
- Render / Record → Record / Clip ngắn / Replay / Render
- Export video → Xuất về máy / Cloud / Clip ngắn / Replay

## Nhánh có END riêng — Phòng Thu / Chat room
- Vào phòng
- Tin nhắn
- Thành viên → Danh sách / Mời thêm / Chặn / Giao quyền
- Vai trò → Chủ phòng / Host / Moderator / Guest
- Thông báo
- Media / File → Upload / Ảnh / Video / Ghim file
- Rời phòng

## Nhánh Home đã chuẩn hóa
- Sự kiện: Có Quà Tặng / Không Có Quà Tặng / Có Vé / Không Vé / Tạo Quà Tặng / Sự kiện của tôi
- Kết Nối: Thiết bị / TV-Màn hình / QR-Check-in / App ngoài / Tài khoản / Custom API
- Tạo nhanh: Tạo sự kiện / Tạo live / Tạo phòng chat / Tạo thông báo / Tạo sản phẩm / Flash Idle Video

## Nhánh Store đã chuẩn hóa
- Đơn hàng
- Bán hàng
- Kho hàng
- Mua sắm
- Thanh toán có logic: Cây 5 chọn phương thức, END xác nhận.

## Nhánh Me đã chuẩn hóa
- Hồ sơ
- Cài đặt
- Thông báo
- Không lặp nội dung AI của Home.
- Các tuyến chưa có nội dung riêng dùng fallback Me theo đúng loại: Profile / Settings / Notifications.

## Nguyên tắc fallback mới
Không còn fallback thô “Nội dung”. Nếu thiếu rule riêng, END tự sinh theo ngữ cảnh:
- Studio Mixer: Xem cấu hình / Mức thông số / Gắn app ngoài / Monitor / Áp dụng / Lưu cấu hình
- Studio Broadcast: Mở / Cấu hình / Preview / Gắn thiết bị hoặc app ngoài / Áp dụng / Lưu
- Studio Chat: Mở trong room / Ô nhập / Gửi / Ghim / Lưu nếu có quyền
- Store: danh sách, trạng thái, bộ lọc, giỏ hàng, thanh toán, xuất/gửi
- Me: trạng thái, tùy chọn, preview, áp dụng, lưu
