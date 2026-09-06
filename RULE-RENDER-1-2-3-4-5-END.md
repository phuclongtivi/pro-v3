# FIXFLOW2C — RULE RENDER CHUẨN 1-2-3-4-5/END

## Nguyên tắc chung
Node nào thuộc Cây 1/2/3/4/5 thì phải được render như nút ở đúng cấp của nó. Không lấy tên node đang chọn để biến thành text title cạnh nút “Quay lại”.

## Cây 1
- Luôn là 4 tab chính: Home / Phòng Thu / Store / Me.
- Luôn là nút ngang hàng.
- Active = highlight.
- Không biến tab active thành tiêu đề text.

## Cây 2
- Là nhóm chính bên dưới Cây 1.
- Các nút cùng cấp phải ngang hàng.
- Active = highlight.
- Không đưa tên Cây 2 xuống vùng nội dung làm heading.

## Cây 3
- Là các nút chức năng con trực tiếp của Cây 2.
- Khi user chọn một nút Cây 3:
  - vẫn giữ toàn bộ sibling Cây 3 ở dạng nút ngang hàng;
  - nút đang chọn được highlight;
  - nếu đi tắt thì mở Cây 5/END bên dưới;
  - nếu không đi tắt thì hiển thị Cây 4.

## Cây 4
- Là hành động/cấu hình con của Cây 3.
- Khi user chọn một nút Cây 4:
  - vẫn giữ toàn bộ sibling Cây 4 ở dạng nút ngang hàng;
  - nút đang chọn được highlight;
  - Cây 5/END hiển thị bên dưới.
- Không dùng tên Cây 4 làm heading text.

## Cây 5 / END
- Là kết quả hoặc bước gần cuối/cuối.
- Được phép là:
  - text/chat;
  - video/preview;
  - danh sách/nội dung;
  - chọn/preset;
  - nhập bắt buộc;
  - lưu;
  - xác nhận.
- Nếu thao tác đã kết thúc ở Cây 5 (ví dụ gửi chat) thì Cây 5 = END, không thêm xác nhận giả.
- Nội dung Cây 5/END không thay thế các nút Cây 3/4 phía trên.

## SKIP
- Chỉ skip khi một cây trung gian không tạo thêm giá trị.
- Ví dụ: Cây 2 → Cây 3 (AI Flash) → SKIP Cây 4 → Cây 5/END chat AI Flash.
- Dù skip, node Cây 3 vẫn phải còn là nút ở hàng sibling của Cây 3.
