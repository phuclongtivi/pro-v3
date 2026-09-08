# R4B4 EventSpace Runtime · Flash Flow Pixel Governor

## Phạm vi

Bản này giữ nguyên cấu trúc và lớp hiển thị V3, chỉ bổ sung lớp điều hành tác vụ trong môi trường Runtime Lab. Runtime Lab là mô phỏng có trạng thái; không giả báo giao dịch, đăng nhập, upload, livestream hoặc kết quả AI đã thành công khi dịch vụ thật chưa được cấu hình.

## Sáu lõi liên kết

1. **EventSpace Core** — xác định sự kiện, đối tượng, vai trò, quyền và vòng đời tác vụ.
2. **Connection Core** — đo năng lực thiết bị, màn hình, mạng, quyền và adapter.
3. **Long AI Core** — áp dụng policy; chỉ chuẩn bị đề xuất AI có giới hạn khi tác vụ thật sự cần AI.
4. **Long Scene Core** — lập scene, identity và thứ tự ROI: người/khuôn mặt → chữ → sản phẩm → tiền cảnh.
5. **Flash Flow Core** — phát hành Pixel Execution Plan; điều phối chất lượng theo miền pixel.
6. **Media Engine Core** — preview/render/codec/transport. Frame và timestamp chỉ thuộc khâu media transport, không còn là miền điều phối của Flash Flow.

## Luồng Event Flash

`Sự kiện → lệnh EventSpace → Flash artifact → Pixel Execution Plan → Media preview/output → TV receiver`

- Tạo/đăng nội dung sự kiện tự chuẩn bị một Event Flash artifact.
- Xem Flash tạo preview runtime bốn scene.
- Thiết bị yếu hoặc mạng kém dùng 720p safe.
- Thiết bị phù hợp dùng 1200p.
- Yêu cầu 4K/8K chỉ được ghi là **Enhanced**, không gọi là nguồn 4K/8K gốc.
- Chưa có media thật thì chỉ hiển thị preview và không tạo file video giả.

## Nút và kết quả

- Mọi nút trong vùng tác vụ được dispatcher của EventSpace nhận lệnh.
- Nút có logic chuyên biệt tiếp tục chạy logic chuyên biệt.
- Nút cấu hình/chọn lựa chưa có backend vẫn trả trạng thái Runtime Lab và được đánh dấu đã nhận lệnh.
- Hành động nhạy cảm cần xác nhận lần hai.
- Nhãn nội bộ `END` không hiển thị cho user; kết quả được ghi nội bộ bằng result code.

## Đo lường

Mỗi lệnh ghi: thành công tác vụ, số thao tác, mức tự động hóa, latency, quality score, pixel efficiency và cost class. Log giữ giới hạn trên thiết bị để tránh tăng dung lượng vô hạn.

## Điều kiện để chuyển sang production

Cần adapter/backend thật tương ứng cho authentication, payment, event persistence, room/live session, object storage, media worker, AI provider và TV signaling. Khi adapter chưa sẵn sàng, UI phải trả `needs-input`, `needs-confirmation` hoặc `unavailable`; không được đổi thành success.

