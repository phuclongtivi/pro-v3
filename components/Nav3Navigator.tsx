"use client";
import { useEffect, useMemo, useState } from "react";
import type { Lang, NavChild } from "@/lib/navigation";
import { label } from "@/lib/navigation";
import { useEventSpace } from "@/components/EventSpaceProvider";
import {AppearanceCenter,SoundCenter,PrivacyCenter,SecurityCenter,StickerStore,PaymentCenter} from "@/components/ContentCompletePanels";
import MediaConnectionPanel from "@/components/MediaConnectionPanel";
import FunctionalTaskPanel from "@/components/FunctionalTaskPanel";

type Txt = { vi: string; en: string; zh: string };
type Kind = "action" | "product" | "notice" | "input" | "chat" | "pay";
type Act = { id: string; label: Txt; priority?: boolean; danger?: boolean; kind?: Kind };
type EndBlock = { title: Txt; items: Act[]; note?: Txt; mode?: "grid" | "chat" | "pay" | "list" };

const T = (vi: string, en: string, zh: string): Txt => ({ vi, en, zh });
const A = (
  id: string,
  vi: string,
  en?: string,
  zh?: string,
  priority = false,
  danger: boolean | Kind = false,
  kind: Kind = "action"
): Act => {
  const isKind = typeof danger === "string";
  return {
    id,
    label: { vi, en: en || vi, zh: zh || en || vi },
    priority,
    danger: isKind ? false : danger,
    kind: isKind ? danger : kind,
  };
};
const tx = (x: Txt, l: Lang) => x[l] || x.vi;

function actions(section: string, child: string): Act[] {
  const m: Record<string, Act[]> = {
    "home.connect:devices": [
      A("phone", "Điện thoại", "Phone", "手机"),
      A("laptop", "Laptop", "Laptop", "笔记本"),
      A("camera", "Camera", "Camera", "摄像机"),
      A("mic", "Micro", "Microphone", "麦克风"),
      A("capture", "Capture card", "Capture Card", "采集卡"),
    ],
    "home.connect:screen": [
      A("tv", "TV thường", "TV", "电视"),
      A("led", "Màn LED sự kiện", "Event LED", "活动LED屏", true),
      A("4k", "4K Output", "4K Output", "4K输出"),
      A("8k", "8K Output", "8K Output", "8K输出"),
      A("custom", "Nhập kích thước màn", "Custom Screen Size", "自定义屏幕尺寸"),
    ],
    "home.quickcreate:event": [
      A("new", "Sự kiện mới", "New Event", "新活动", true),
      A("template", "Từ mẫu", "From Template", "从模板"),
      A("history", "Từ lịch sử", "From History", "从历史"),
      A("ai", "AI gợi ý", "AI Suggest", "AI建议", true),
    ],
    "studio.broadcast:video-output": [
      A("tv", "TV / Màn thường", "TV / Screen", "电视/屏幕"),
      A("led", "LED Event Screen", "LED Event Screen", "活动LED屏", true),
      A("4k", "4K Output", "4K Output", "4K输出"),
      A("8k", "8K Output", "8K Output", "8K输出"),
      A("pxp", "PXP / Multi-view", "PXP / Multi-view", "多画面"),
      A("auto-fit", "AI Auto Fit", "AI Auto Fit", "AI自动适配", true),
    ],
    "studio.broadcast:flash-flow": [
      A("intro", "Intro", "Intro", "片头"),
      A("transition", "Chuyển cảnh", "Transition", "转场"),
      A("idle", "Idle video", "Idle Video", "待机视频"),
      A("run", "Chạy Flow", "Run Flow", "运行Flow", true),
    ],
    "studio.broadcast:render-record": [
      A("record", "Record", "Record", "录制", true),
      A("clip", "Clip ngắn", "Short Clip", "短片"),
      A("replay", "Replay", "Replay", "回放"),
      A("render", "Render", "Render", "渲染"),
    ],
    "studio.broadcast:export-video": [
      A("device", "Xuất về máy", "Download to Device", "下载到设备"),
      A("cloud", "Xuất cloud", "Export Cloud", "导出云端"),
      A("short", "Xuất clip ngắn", "Export Short Clip", "导出短片"),
      A("replay", "Xuất replay", "Export Replay", "导出回放"),
    ],
    "studio.mixer:inputs": [
      A("mic", "Mic 1–8", "Mic 1–8", "麦克风1-8"),
      A("music", "Nhạc nền", "Background Music", "背景音乐"),
      A("usb", "Audio USB", "USB Audio", "USB音频"),
      A("bluetooth", "Bluetooth", "Bluetooth", "蓝牙"),
      A("camera-audio", "Camera audio", "Camera Audio", "相机音频"),
      A("external", "External apps", "External Apps", "外部应用"),
    ],
    "studio.mixer:audio": [
      A("gain", "Gain / Trim", "Gain / Trim", "增益/微调", true),
      A("eq", "EQ", "EQ", "均衡", true),
      A("fx", "FX1 / FX2", "FX1 / FX2", "效果1/2"),
      A("aux", "AUX send", "AUX Send", "AUX发送"),
      A("pan", "Pan", "Pan", "声像"),
      A("mute-solo", "Mute / Solo", "Mute / Solo", "静音/独奏"),
      A("main", "Main L/R", "Main L/R", "主左右", true),
    ],
    "studio.mixer:lighting": [
      A("brightness", "Độ sáng tổng", "Master Brightness", "总亮度"),
      A("temperature", "Nhiệt màu", "Color Temperature", "色温"),
      A("stage", "Ánh sáng sân khấu", "Stage Light", "舞台灯光", true),
      A("sync", "Đồng bộ cảnh", "Scene Sync", "场景同步"),
    ],
    "studio.mixer:effects": [
      A("visual", "Hiệu ứng hình", "Visual FX", "视觉效果"),
      A("audio", "Hiệu ứng âm", "Audio FX", "音频效果"),
      A("overlay", "Overlay", "Overlay", "叠加"),
      A("transition", "Transition", "Transition", "转场"),
    ],
    "studio.mixer:outputs": [
      A("main", "Main out", "Main Out", "主输出", true),
      A("monitor", "Monitor out", "Monitor Out", "监听输出"),
      A("stream", "Stream out", "Stream Out", "直播输出"),
      A("record", "Record out", "Record Out", "录制输出"),
      A("hall", "Event hall out", "Event Hall Out", "会场输出"),
      A("tv-led", "TV / LED out", "TV / LED Out", "电视/LED输出", true),
    ],
    "studio.mixer:preset": [
      A("voice", "Voice", "Voice", "人声", true),
      A("music", "Music", "Music", "音乐"),
      A("event", "Event", "Event", "活动", true),
      A("safe", "Safe", "Safe", "安全", true),
      A("custom", "Custom", "Custom", "自定义"),
    ],
    "studio.chat:members": [
      A("list", "Danh sách", "List", "列表"),
      A("invite", "Mời thêm", "Invite", "邀请", true),
      A("block", "Chặn", "Block", "屏蔽", false, true),
      A("role", "Giao quyền", "Assign Role", "分配权限"),
    ],
    "studio.chat:roles": [
      A("owner", "Chủ phòng", "Owner", "房主", true),
      A("host", "Host", "Host", "主持"),
      A("mod", "Kiểm duyệt", "Moderator", "管理员"),
      A("guest", "Khách", "Guest", "访客"),
    ],
    "studio.chat:media": [
      A("upload", "Tải file", "Upload File", "上传文件", true),
      A("image", "Ảnh", "Images", "图片"),
      A("video", "Video", "Videos", "视频"),
      A("pin", "Ghim file", "Pin File", "置顶文件"),
    ],
    "store.orders:pending": [
      A("today", "Hôm nay", "Today", "今天"),
      A("customer", "Theo khách", "By Customer", "按客户"),
      A("event", "Theo sự kiện", "By Event", "按活动"),
      A("confirm", "Xác nhận", "Confirm", "确认", true),
      A("update", "Cập nhật trạng thái", "Update Status", "更新状态", true),
    ],
    "store.sales:price": [
      A("normal", "Giá thường", "Normal Price", "常规价"),
      A("event", "Giá sự kiện", "Event Price", "活动价"),
      A("combo", "Combo", "Combo", "组合"),
      A("discount", "Giảm giá", "Discount", "折扣"),
    ],
    "store.inventory:audit": [
      A("sku", "Theo SKU", "By SKU", "按SKU"),
      A("category", "Theo loại", "By Category", "按类别"),
      A("low", "Theo mức tồn", "By Stock Level", "按库存"),
      A("event", "Theo sự kiện", "By Event", "按活动"),
      A("export", "Xuất báo cáo", "Export Report", "导出报告", true),
    ],
    "store.shopping:category": [
      A("event", "Theo sự kiện", "By Event", "按活动"),
      A("type", "Theo loại", "By Type", "按类型"),
      A("price", "Theo giá", "By Price", "按价格"),
      A("promo", "Khuyến mại", "Promotion", "促销", true),
    ],
    "store.shopping:checkout": [
      A("vietqr", "VietQR / Chuyển khoản", "VietQR / Bank Transfer", "VietQR / 银行转账", true),
      A("momo", "MoMo", "MoMo", "MoMo", true),
      A("zalopay", "ZaloPay", "ZaloPay", "ZaloPay"),
      A("card", "Visa / Mastercard", "Visa / Mastercard", "Visa / Mastercard"),
      A("apple", "Apple Pay", "Apple Pay", "Apple Pay"),
      A("google", "Google Pay", "Google Pay", "Google Pay"),
      A("cod", "COD", "COD", "货到付款"),
    ],
    "me.profile:personal": [
      A("view", "Xem", "View", "查看"),
      A("edit", "Sửa", "Edit", "编辑"),
      A("security", "Bảo mật", "Security", "安全", true),
      A("sync", "Đồng bộ", "Sync", "同步"),
    ],
    "me.profile:account": [
      A("login", "Đăng nhập", "Login", "登录"),
      A("email", "Email", "Email", "邮箱"),
      A("phone", "Số điện thoại", "Phone", "电话"),
      A("delete", "Xóa tài khoản", "Delete Account", "删除账户", false, true),
    ],
    "me.settings:language": [
      A("vi", "Tiếng Việt", "Vietnamese", "越南语", true),
      A("en", "English", "English", "英语"),
      A("zh", "中文", "Chinese", "中文"),
    ],
    "me.settings:appearance": [
      A("mobile", "Mobile", "Mobile", "移动端"),
      A("web", "Web", "Web", "网页"),
      A("tv", "TV", "TV", "电视"),
      A("font", "Cỡ chữ", "Font Size", "字体大小"),
      A("density", "Mật độ hiển thị", "Display Density", "显示密度"),
    ],
    "me.settings:devices": [
      A("camera", "Camera", "Camera", "摄像头"),
      A("micro", "Micro", "Microphone", "麦克风"),
      A("notice", "Thông báo", "Notifications", "通知"),
      A("login", "Đăng nhập", "Login", "登录"),
      A("permissions", "Quyền thiết bị", "Device Permissions", "设备权限", true),
    ],
  };
  return m[section + ":" + child] || [
    A("view", "Xem", "View", "查看", true),
    A("edit", "Chỉnh sửa", "Edit", "编辑"),
    A("save", "Lưu", "Save", "保存", true),
    A("confirm", "Xác nhận", "Confirm", "确认", true),
  ];
}

function directEnd(key: string): EndBlock | null {
  const m: Record<string, EndBlock> = {
    eventGift: { title: T("Có Quà Tặng", "Gift Available", "有礼物"), mode: "list", items: [A("n1", "Thông báo 1", "Notice 1", "通知1", true, "notice"), A("n2", "Thông báo 2", "Notice 2", "通知2", false, "notice"), A("n3", "Thông báo 3", "Notice 3", "通知3", false, "notice"), A("check", "Check / Watch / Read", "Check / Watch / Read", "检查/观看/阅读", true), A("confirm", "Confirm / Read / Add", "Confirm / Read / Add", "确认/阅读/添加", true)] },
    eventNoGift: { title: T("Không Có Quà Tặng", "No Gift", "无礼物"), mode: "list", items: [A("n1", "Thông báo 1", "Notice 1", "通知1", true, "notice"), A("n2", "Thông báo 2", "Notice 2", "通知2", false, "notice"), A("watch", "Check / Watch / Read", "Check / Watch / Read", "检查/观看/阅读", true), A("add", "Confirm / Read / Add", "Confirm / Read / Add", "确认/阅读/添加")] },
    eventTicket: { title: T("Có Vé", "Ticket Available", "有票"), items: [A("ticket1", "Vé 1", "Ticket 1", "票1", true), A("ticket2", "Vé 2", "Ticket 2", "票2"), A("qr", "QR Vé", "Ticket QR", "票二维码", true), A("checkin", "Check-in", "Check-in", "签到", true)] },
    eventNoTicket: { title: T("Không Vé", "No Ticket", "无票"), items: [A("notice", "Thông báo không vé", "No-ticket Notice", "无票通知", true, "notice"), A("request", "Yêu cầu vé", "Request Ticket", "申请票"), A("watch", "Theo dõi", "Follow", "关注"), A("read", "Đọc", "Read", "阅读")] },
    createGift: { title: T("Tạo Quà Tặng", "Create Gift", "创建礼物"), items: [A("template", "Chọn mẫu quà", "Gift Template", "礼物模板"), A("quantity", "Số lượng", "Quantity", "数量", false, "input"), A("rule", "Điều kiện nhận", "Claim Rule", "领取条件"), A("qr", "Tạo QR quà", "Create Gift QR", "创建礼物二维码", true), A("create", "Khởi tạo", "Create", "创建", true)] },
    myEvents: { title: T("Sự kiện của tôi", "My Events", "我的活动"), items: [A("create-notice", "Tạo thông báo", "Create Notice", "创建通知", true), A("manage-gift", "Quản lý quà tặng", "Manage Gifts", "管理礼物"), A("init-gift", "Khởi tạo quà tặng", "Create Gift", "创建礼物", true), A("read", "Confirm / Read", "Confirm / Read", "确认/阅读")] },

    aiFlashChat: { title: T("AI Flash", "AI Flash", "AI闪流"), mode: "chat", items: [A("chat", "Chat với AI Flash", "Chat with AI Flash", "与AI Flash聊天", true, "chat"), A("task", "Giao việc nhanh", "Quick Task", "快速任务", true), A("template", "Mẫu tác vụ", "Task Templates", "任务模板"), A("send", "Gửi yêu cầu", "Send Request", "发送请求", true), A("save", "Lưu kết quả", "Save Result", "保存结果")] },
    salesAI: { title: T("AI Bán Hàng", "AI Sales", "AI销售"), mode: "chat", items: [A("chat", "Chat bán hàng", "Sales Chat", "销售聊天", true, "chat"), A("product", "Gợi ý sản phẩm", "Product Suggest", "商品建议"), A("price", "Gợi ý giá", "Price Suggest", "价格建议"), A("post", "Tạo bài bán", "Create Sales Post", "创建销售文案", true)] },
    billAI: { title: T("AI Soát Bill", "AI Bill Check", "AI账单检查"), items: [A("scan", "Quét bill", "Scan Bill", "扫描账单", true), A("upload", "Tải ảnh bill", "Upload Bill", "上传账单"), A("check", "Soát lỗi", "Check Errors", "检查错误", true), A("save", "Lưu kết quả", "Save Result", "保存结果")] },
    ticketAI: { title: T("AI Soát Vé", "AI Ticket Check", "AI验票"), items: [A("scan", "Quét vé", "Scan Ticket", "扫描票", true), A("qr", "Check QR", "Check QR", "检查二维码"), A("duplicate", "Soát trùng", "Duplicate Check", "重复检查"), A("confirm", "Xác nhận", "Confirm", "确认", true)] },
    oneClickAI: { title: T("ONE CLICK AI ↔ APP", "ONE CLICK AI ↔ APP", "一键AI↔应用"), items: [A("sales", "AI Bán Hàng", "AI Sales", "AI销售", true), A("bill", "AI Soát Bill", "AI Bill Check", "AI账单检查"), A("ticket", "AI Soát Vé", "AI Ticket Check", "AI验票"), A("run", "Chạy một chạm", "Run One Click", "一键运行", true)] },
    aiFinance: { title: T("Quản lý AI và Thu-Chi", "AI & Finance Manager", "AI与收支管理"), items: [A("ai", "Quản lý AI", "AI Manager", "AI管理", true), A("finance", "Thu - Chi", "Income & Expense", "收支", true), A("report", "Báo cáo", "Report", "报告"), A("confirm", "Confirm / Read / Add", "Confirm / Read / Add", "确认/阅读/添加")] },

    qrCheckin: { title: T("QR / Check-in", "QR / Check-in", "二维码签到"), items: [A("scan", "Quét QR", "Scan QR", "扫描二维码", true), A("create", "Tạo QR", "Create QR", "创建二维码"), A("live", "Live check-in", "Live Check-in", "直播签到", true), A("save", "Lưu QR", "Save QR", "保存二维码")] },
    createLive: { title: T("Tạo room live", "Create Live Room", "创建直播间"), items: [A("public", "Room công khai", "Public Room", "公开房间", true), A("private", "Room riêng tư", "Private Room", "私人房间"), A("event", "Room sự kiện", "Event Room", "活动房间", true), A("test", "Room thử", "Test Room", "测试房间"), A("qr", "QR room", "QR Room", "房间二维码", true), A("create", "Tạo ngay", "Create Now", "立即创建", true)] },
    quickRoom: { title: T("Vào phòng nhanh", "Quick Room", "快速进房"), items: [A("scan", "Quét QR phòng", "Scan Room QR", "扫描房间码", true), A("recent", "Phòng gần đây", "Recent Rooms", "最近房间"), A("code", "Nhập mã phòng", "Enter Room Code", "输入房间码", false, "input"), A("join", "Vào ngay", "Join Now", "立即进入", true)] },
    previewStudio: { title: T("Preview", "Preview", "预览"), items: [A("camera", "Xem camera", "View Camera", "查看相机"), A("layout", "Xem layout", "View Layout", "查看布局"), A("av", "Test audio-video", "Test AV", "测试音视频", true), A("full", "Preview full", "Full Preview", "全屏预览")] },
    nameRoom: { title: T("Đặt tên phòng", "Name Room", "命名房间"), items: [A("name", "Tên phòng", "Room Name", "房间名称", false, "input"), A("event", "Gắn sự kiện", "Attach Event", "绑定活动"), A("qr", "Tạo QR", "Create QR", "创建二维码"), A("save", "Lưu", "Save", "保存", true)] },
    createVideo: { title: T("Tạo video", "Create Video", "创建视频"), items: [A("template", "Từ mẫu", "From Template", "从模板"), A("record", "Ghi nhanh", "Quick Record", "快速录制", true), A("ai", "AI dựng nhanh", "AI Quick Edit", "AI快速剪辑", true), A("save", "Lưu video", "Save Video", "保存视频")] },
    flashIdle: { title: T("Flash Idle Video", "Flash Idle Video", "Flash待机视频"), items: [A("banner", "Từ banner", "From Banner", "从横幅"), A("mascot", "Thêm mascot", "Add Mascot", "添加吉祥物"), A("preview", "Xem trước", "Preview", "预览"), A("create", "Tạo video", "Create Video", "创建视频", true)] },

    chatRoomLive: { title: T("Phòng chat sự kiện", "Event Chat Room", "活动聊天室"), mode: "chat", note: T("User rời room thì chat kết thúc. Tin nhắn gửi tại đây là END, không cần xác nhận thêm.", "When the user leaves the room, chat ends. Sending a message here is the final action.", "用户离开房间后聊天结束。在此发送即为最终操作。"), items: [A("message", "Ô nhập tin nhắn", "Message Input", "消息输入", true, "chat"), A("send", "Gửi", "Send", "发送", true), A("pin", "Ghim", "Pin", "置顶"), A("invite", "Mời thêm", "Invite", "邀请", true), A("leave", "Rời phòng", "Leave Room", "离开房间", false, true)] },
    chatMessages: { title: T("Tin nhắn", "Messages", "消息"), mode: "chat", items: [A("message", "Ô nhập tin nhắn", "Message Input", "消息输入", true, "chat"), A("send", "Gửi trong room", "Send in Room", "房间内发送", true), A("pin", "Ghim tin", "Pin", "置顶"), A("hide", "Ẩn tin", "Hide", "隐藏"), A("delete", "Xóa tin", "Delete", "删除", false, true)] },
    chatNotice: { title: T("Thông báo phòng", "Room Notice", "房间通知"), items: [A("quick", "Thông báo nhanh", "Quick Notice", "快速通知", true), A("template", "Mẫu thông báo", "Notice Template", "通知模板"), A("all", "Gửi toàn phòng", "Send to Room", "发送全房间", true), A("qr", "QR room", "QR Room", "房间二维码")] },
    chatLeave: { title: T("Rời phòng", "Leave Room", "离开房间"), items: [A("confirm", "Xác nhận rời", "Confirm Leave", "确认离开", false, true), A("save", "Lưu lịch sử nếu có quyền", "Save Log If Allowed", "有权限则保存记录"), A("cancel", "Ở lại phòng", "Stay", "留在房间", true)] },

    shoppingAll: { title: T("Tất cả mặt hàng", "All Products", "全部商品"), mode: "grid", note: T("Hiển thị tất cả mặt hàng trước; bộ lọc dùng sau khi user đã thấy nội dung.", "Show all products first; filters are used after the content appears.", "先显示全部商品，用户看到内容后再筛选。"), items: [A("p1", "Sản phẩm 1", "Product 1", "商品1", true, "product"), A("p2", "Sản phẩm 2", "Product 2", "商品2", false, "product"), A("p3", "Sản phẩm 3", "Product 3", "商品3", false, "product"), A("category", "Lọc danh mục", "Filter Category", "分类筛选"), A("price", "Lọc giá", "Price Filter", "价格筛选"), A("cart", "Giỏ hàng", "Cart", "购物车"), A("checkout", "Thanh toán", "Checkout", "结账", true)] },
    shoppingRecommend: { title: T("Đề xuất", "Recommended", "推荐"), items: [A("ai", "AI đề xuất", "AI Recommended", "AI推荐", true), A("event", "Theo sự kiện", "By Event", "按活动"), A("saved", "Đã lưu", "Saved", "已保存"), A("cart", "Thêm giỏ", "Add to Cart", "加入购物车", true)] },
    shoppingCart: { title: T("Giỏ hàng", "Cart", "购物车"), items: [A("items", "Sản phẩm trong giỏ", "Cart Items", "购物车商品"), A("qty", "Số lượng", "Quantity", "数量"), A("voucher", "Mã giảm giá", "Voucher", "优惠券"), A("checkout", "Thanh toán", "Checkout", "结账", true)] },
    shoppingCombo: { title: T("Combo", "Combo", "组合"), items: [A("event", "Combo sự kiện", "Event Combo", "活动组合", true), A("family", "Combo nhóm", "Group Combo", "组合套餐"), A("discount", "Giảm giá", "Discount", "折扣"), A("cart", "Thêm giỏ", "Add to Cart", "加入购物车", true)] },
    shoppingSaved: { title: T("Đã lưu", "Saved", "已保存"), items: [A("view", "Xem đã lưu", "View Saved", "查看已保存"), A("cart", "Thêm giỏ", "Add to Cart", "加入购物车", true), A("remove", "Bỏ lưu", "Remove", "移除")] },
    ordersAll: { title: T("Tất cả đơn hàng", "All Orders", "全部订单"), items: [A("order1", "Đơn hàng 1", "Order 1", "订单1"), A("order2", "Đơn hàng 2", "Order 2", "订单2"), A("status", "Trạng thái", "Status", "状态"), A("export", "Xuất", "Export", "导出")] },
    ordersShipping: { title: T("Đang giao", "Shipping", "配送中"), items: [A("track", "Theo dõi", "Track", "跟踪", true), A("update", "Cập nhật trạng thái", "Update Status", "更新状态"), A("contact", "Liên hệ khách", "Contact Customer", "联系客户")] },
    ordersCompleted: { title: T("Hoàn tất", "Completed", "已完成"), items: [A("view", "Xem đơn", "View Order", "查看订单"), A("review", "Đánh giá", "Review", "评价"), A("export", "Xuất hóa đơn", "Export Invoice", "导出发票")] },
    ordersReturn: { title: T("Đổi trả", "Returns", "退换"), items: [A("request", "Yêu cầu đổi trả", "Return Request", "退换申请"), A("approve", "Duyệt", "Approve", "批准", true), A("refund", "Hoàn tiền", "Refund", "退款", false, true)] },
    ordersSearch: { title: T("Tra cứu đơn", "Search Orders", "查询订单"), items: [A("code", "Mã đơn", "Order Code", "订单号", false, "input"), A("customer", "Tên khách", "Customer", "客户"), A("date", "Ngày", "Date", "日期"), A("search", "Tìm", "Search", "搜索", true)] },
    createProduct: { title: T("Tạo sản phẩm", "Create Product", "创建商品"), items: [A("new", "Mới", "New", "新建", true), A("template", "Từ mẫu", "From Template", "从模板"), A("ai", "AI gợi ý", "AI Suggest", "AI建议", true), A("stock", "Từ kho", "From Inventory", "从库存"), A("publish", "Xuất bản", "Publish", "发布", true)] },
    promo: { title: T("Khuyến mãi", "Promotion", "促销"), items: [A("percent", "Giảm %", "Percent Off", "百分比折扣"), A("combo", "Combo", "Combo", "组合"), A("event", "Theo sự kiện", "By Event", "按活动"), A("publish", "Áp dụng", "Apply", "应用", true)] },
    productMedia: { title: T("Media sản phẩm", "Product Media", "商品媒体"), items: [A("photo", "Ảnh", "Photos", "图片"), A("video", "Video", "Video", "视频"), A("ai", "AI làm đẹp", "AI Enhance", "AI增强", true), A("save", "Lưu", "Save", "保存")] },
    publicStore: { title: T("Public store", "Public Store", "公开商店"), items: [A("preview", "Xem trước", "Preview", "预览"), A("publish", "Mở bán", "Publish", "发布", true), A("link", "Link store", "Store Link", "商店链接"), A("share", "Chia sẻ", "Share", "分享")] },
    inventoryGoods: { title: T("Hàng hóa", "Goods", "货品"), items: [A("sku", "SKU", "SKU", "SKU"), A("list", "Danh sách hàng", "Goods List", "货品列表"), A("low", "Sắp hết", "Low Stock", "低库存", true), A("report", "Báo cáo", "Report", "报告")] },
    stockIn: { title: T("Nhập kho", "Stock In", "入库"), items: [A("scan", "Quét mã", "Scan Code", "扫码", true), A("qty", "Số lượng", "Quantity", "数量", false, "input"), A("supplier", "Nhà cung cấp", "Supplier", "供应商"), A("confirm", "Xác nhận nhập", "Confirm Stock In", "确认入库", true)] },
    stockOut: { title: T("Xuất kho", "Stock Out", "出库"), items: [A("scan", "Quét mã", "Scan Code", "扫码", true), A("qty", "Số lượng", "Quantity", "数量", false, "input"), A("event", "Theo sự kiện", "By Event", "按活动"), A("confirm", "Xác nhận xuất", "Confirm Stock Out", "确认出库", true)] },
    inventoryAlert: { title: T("Cảnh báo kho", "Inventory Alerts", "库存预警"), items: [A("low", "Sắp hết", "Low Stock", "低库存", true), A("expired", "Hết hạn", "Expired", "过期"), A("ai", "AI đề xuất nhập thêm", "AI Restock Suggest", "AI补货建议", true), A("notify", "Bật cảnh báo", "Enable Alert", "启用提醒")] },
    inventoryHistory: { title: T("Lịch sử tồn kho", "Inventory History", "库存历史"), items: [A("today", "Hôm nay", "Today", "今天"), A("month", "Tháng này", "This Month", "本月"), A("export", "Xuất báo cáo", "Export Report", "导出报告", true)] },
    avatar: { title: T("Ảnh đại diện", "Avatar", "头像"), items: [A("upload", "Tải ảnh", "Upload", "上传"), A("camera", "Chụp ảnh", "Camera", "拍照"), A("ai", "AI làm đẹp", "AI Enhance", "AI增强", true), A("save", "Lưu", "Save", "保存", true)] },
    contact: { title: T("Liên hệ", "Contact", "联系方式"), items: [A("phone", "Số điện thoại", "Phone", "电话"), A("email", "Email", "Email", "邮箱"), A("address", "Địa chỉ", "Address", "地址"), A("save", "Lưu", "Save", "保存", true)] },
    personalFinance: { title: T("Thu/Chi của tôi", "My Income & Expense", "我的收支"), items: [A("overview", "Tổng quan", "Overview", "总览", true), A("transactions", "Giao dịch", "Transactions", "交易"), A("category", "Phân loại", "Categories", "分类"), A("export", "Xuất báo cáo", "Export Report", "导出报告", true)] },
    personalReport: { title: T("Báo cáo cá nhân", "Personal Report", "个人报告"), items: [A("today", "Hôm nay", "Today", "今天"), A("month", "Tháng này", "This Month", "本月"), A("ai", "AI tóm tắt", "AI Summary", "AI总结", true), A("export", "Xuất báo cáo", "Export Report", "导出报告")] },
    noticeSystem: { title: T("Thông báo hệ thống", "System Notifications", "系统通知"), items: [A("new", "Mới", "New", "新", true), A("read", "Đã đọc", "Read", "已读"), A("priority", "Ưu tiên", "Priority", "优先", true), A("history", "Lịch sử", "History", "历史")] },
    noticeEvents: { title: T("Thông báo sự kiện", "Event Notifications", "活动通知"), items: [A("new", "Mới", "New", "新", true), A("calendar", "Lịch sự kiện", "Event Calendar", "活动日历"), A("qr", "QR check-in", "QR Check-in", "二维码签到"), A("read", "Đã đọc", "Read", "已读")] },
    noticeChat: { title: T("Thông báo chat", "Chat Notifications", "聊天通知"), items: [A("mention", "Mention", "Mention", "提及", true), A("room", "Theo phòng", "By Room", "按房间"), A("mute", "Tắt thông báo", "Mute", "静音")] },
    noticeStore: { title: T("Thông báo Store", "Store Notifications", "商店通知"), items: [A("order", "Đơn hàng", "Orders", "订单", true), A("stock", "Kho hàng", "Inventory", "库存"), A("payment", "Thanh toán", "Payment", "付款")] },
    noticeAI: { title: T("AI jobs", "AI Jobs", "AI任务"), items: [A("done", "Hoàn thành", "Done", "已完成", true), A("confirm", "Cần xác nhận", "Needs Confirmation", "需要确认", true), A("report", "Báo cáo AI", "AI Report", "AI报告")] },
    noticeSecurity: { title: T("Bảo mật", "Security", "安全"), items: [A("new", "Mới", "New", "新", true), A("priority", "Ưu tiên", "Priority", "优先", true), A("resolve", "Xử lý", "Resolve", "处理", true), A("history", "Lịch sử", "History", "历史")] },
  };
  return m[key] || null;
}

function comboEnd(section: string, child: string, action: string): EndBlock | null {
  const m: Record<string, EndBlock> = {
    "home.connect:devices:phone": { title: T("Kết nối điện thoại", "Phone Connection", "手机连接"), items: [A("scan", "Quét QR", "Scan QR", "扫描二维码", true), A("usb", "Kết nối cáp", "USB Cable", "USB连接"), A("mirror", "Phản chiếu màn hình", "Screen Mirror", "投屏"), A("files", "Chia sẻ file", "File Share", "文件共享"), A("save", "Lưu cấu hình", "Save Profile", "保存配置", true)] },
    "home.connect:devices:laptop": { title: T("Kết nối laptop", "Laptop Connection", "笔记本连接"), items: [A("wifi", "Cùng mạng Wi‑Fi", "Same Wi‑Fi", "同一Wi‑Fi", true), A("hdmi", "HDMI / Capture", "HDMI / Capture", "HDMI/采集"), A("remote", "Điều khiển từ xa", "Remote Control", "远程控制"), A("share", "Chia sẻ màn hình", "Screen Share", "屏幕共享"), A("save", "Lưu cấu hình", "Save Profile", "保存配置", true)] },
    "home.connect:devices:camera": { title: T("Kết nối camera", "Camera Connection", "相机连接"), items: [A("usb", "USB", "USB", "USB"), A("capture", "Capture card", "Capture Card", "采集卡", true), A("wireless", "Wireless", "Wireless", "无线"), A("audio", "Gắn audio theo camera", "Camera Audio", "相机音频"), A("save", "Lưu cấu hình", "Save", "保存", true)] },
    "home.connect:devices:mic": { title: T("Kết nối micro", "Microphone Connection", "麦克风连接"), items: [A("wired", "Mic có dây", "Wired Mic", "有线麦克风"), A("wireless", "Mic không dây", "Wireless Mic", "无线麦克风", true), A("gain", "Gain nhanh", "Quick Gain", "快速增益"), A("monitor", "Monitor", "Monitor", "监听"), A("save", "Lưu", "Save", "保存", true)] },
    "home.connect:devices:capture": { title: T("Capture card", "Capture Card", "采集卡"), items: [A("usb3", "USB 3.0", "USB 3.0", "USB3.0", true), A("hdmi", "Nguồn HDMI", "HDMI Source", "HDMI源"), A("preview", "Preview", "Preview", "预览"), A("sync", "Đồng bộ AV", "AV Sync", "音视频同步"), A("save", "Lưu", "Save", "保存", true)] },

    "home.connect:screen:tv": { title: T("TV / Màn thường", "TV / Screen", "电视/屏幕"), items: [A("720", "720p", "720p", "720p"), A("1080", "1080p", "1080p", "1080p", true), A("mirror", "Mirror", "Mirror", "镜像"), A("extend", "Extend", "Extend", "扩展"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "home.connect:screen:led": { title: T("Màn LED sự kiện", "Event LED", "活动LED屏"), items: [A("small", "LED nhỏ", "Small LED", "小型LED"), A("large", "LED lớn", "Large LED", "大型LED", true), A("map", "Map điểm ảnh", "Pixel Map", "像素映射"), A("fit", "Auto fit", "Auto Fit", "自动适配", true), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "home.connect:screen:4k": { title: T("4K Output", "4K Output", "4K输出"), items: [A("30", "4K 30fps", "4K 30fps", "4K 30fps"), A("60", "4K 60fps", "4K 60fps", "4K 60fps", true), A("hdr", "HDR", "HDR", "HDR"), A("test", "Test pattern", "Test Pattern", "测试图"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "home.connect:screen:8k": { title: T("8K Output", "8K Output", "8K输出"), items: [A("30", "8K 30fps", "8K 30fps", "8K 30fps"), A("60", "8K 60fps", "8K 60fps", "8K 60fps", true), A("test", "Test pattern", "Test Pattern", "测试图"), A("bandwidth", "Kiểm tra băng thông", "Bandwidth Test", "带宽测试"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "home.connect:screen:custom": { title: T("Kích thước màn tùy chỉnh", "Custom Screen Size", "自定义屏幕尺寸"), items: [A("width", "Chiều rộng", "Width", "宽度", false, "input"), A("height", "Chiều cao", "Height", "高度", false, "input"), A("ratio", "Tỉ lệ", "Ratio", "比例"), A("save", "Lưu", "Save", "保存", true), A("apply", "Áp dụng", "Apply", "应用", true)] },

    "home.quickcreate:event:new": { title: T("Sự kiện mới", "New Event", "新活动"), items: [A("title", "Tên sự kiện", "Event Name", "活动名称", false, "input"), A("time", "Thời gian", "Time", "时间"), A("type", "Loại sự kiện", "Event Type", "活动类型"), A("save", "Lưu nháp", "Save Draft", "保存草稿"), A("create", "Tạo ngay", "Create Now", "立即创建", true)] },
    "home.quickcreate:event:template": { title: T("Tạo từ mẫu", "From Template", "从模板"), items: [A("conference", "Mẫu hội nghị", "Conference Template", "会议模板"), A("show", "Mẫu sân khấu", "Show Template", "舞台模板"), A("sale", "Mẫu bán hàng", "Sales Template", "销售模板"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "home.quickcreate:event:history": { title: T("Từ lịch sử", "From History", "从历史"), items: [A("event1", "Sự kiện gần đây 1", "Recent Event 1", "最近活动1"), A("event2", "Sự kiện gần đây 2", "Recent Event 2", "最近活动2"), A("clone", "Nhân bản", "Clone", "复制", true), A("create", "Tạo từ lịch sử", "Create from History", "从历史创建", true)] },
    "home.quickcreate:event:ai": { title: T("AI gợi ý sự kiện", "AI Event Suggest", "AI活动建议"), items: [A("theme", "Gợi ý chủ đề", "Theme Suggest", "主题建议", true), A("script", "Gợi ý kịch bản", "Script Suggest", "脚本建议"), A("budget", "Gợi ý ngân sách", "Budget Suggest", "预算建议"), A("create", "Dựng khung sự kiện", "Create Outline", "生成活动框架", true)] },

    "studio.broadcast:video-output:tv": { title: T("Đầu ra video • TV / Màn thường", "Video Output • TV / Screen", "视频输出 • 电视/屏幕"), items: [A("720", "720p", "720p", "720p"), A("1080", "1080p", "1080p", "1080p", true), A("mirror", "Mirror", "Mirror", "镜像"), A("extend", "Extend", "Extend", "扩展"), A("test", "Test pattern", "Test Pattern", "测试图"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.broadcast:video-output:led": { title: T("LED Event Screen", "LED Event Screen", "活动LED屏"), items: [A("6x3", "LED 6 × 3 m", "LED 6 × 3 m", "LED 6×3米"), A("12x6", "LED 12 × 6 m", "LED 12 × 6 m", "LED 12×6米"), A("20x10", "LED 20 × 10 m", "LED 20 × 10 m", "LED 20×10米"), A("500", "Sự kiện ~500 m²", "Event ~500 m²", "约500平方米活动", true), A("custom", "Kích thước khác", "Custom Size", "自定义尺寸", false, "input"), A("auto-fit", "AUTO FIT", "AUTO FIT", "自动适配", true), A("ai-map", "AI AUTO MAP", "AI AUTO MAP", "AI自动映射", true), A("test", "TEST PATTERN", "TEST PATTERN", "测试图"), A("validate", "VALIDATE", "VALIDATE", "验证"), A("arm", "ARM", "ARM", "预备", true), A("take-live", "TAKE LIVE", "TAKE LIVE", "切入直播", true, true)] },
    "studio.broadcast:video-output:4k": { title: T("Đầu ra 4K", "4K Output", "4K输出"), items: [A("30", "4K 30fps", "4K 30fps", "4K 30fps"), A("60", "4K 60fps", "4K 60fps", "4K 60fps", true), A("hdr", "HDR", "HDR", "HDR"), A("stream", "Gửi sang stream out", "Send to Stream Out", "发送到直播输出"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.broadcast:video-output:8k": { title: T("Đầu ra 8K", "8K Output", "8K输出"), items: [A("30", "8K 30fps", "8K 30fps", "8K 30fps"), A("60", "8K 60fps", "8K 60fps", "8K 60fps", true), A("test", "Kiểm tra băng thông", "Bandwidth Test", "带宽测试"), A("preview", "Preview 8K", "8K Preview", "8K预览"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.broadcast:video-output:pxp": { title: T("PXP / Multi-view", "PXP / Multi-view", "多画面"), items: [A("2up", "2 ô", "2-up", "2画面"), A("4up", "4 ô", "4-up", "4画面", true), A("grid", "9 ô", "9-up", "9画面"), A("pip", "Picture in Picture", "Picture in Picture", "画中画"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.broadcast:video-output:auto-fit": { title: T("AI Auto Fit", "AI Auto Fit", "AI自动适配"), items: [A("detect", "Nhận diện màn", "Detect Screen", "识别屏幕", true), A("crop", "Crop thông minh", "Smart Crop", "智能裁切"), A("safe", "Vùng an toàn", "Safe Area", "安全区"), A("apply", "Áp dụng", "Apply", "应用", true)] },

    "studio.broadcast:flash-flow:intro": { title: T("Flash Flow • Intro", "Flash Flow • Intro", "闪流引擎 • 片头"), items: [A("logo", "Logo intro", "Logo Intro", "Logo片头"), A("countdown", "Countdown", "Countdown", "倒计时", true), A("sound", "Nhạc intro", "Intro Music", "片头音乐"), A("play", "Phát intro", "Play Intro", "播放片头", true)] },
    "studio.broadcast:flash-flow:transition": { title: T("Flash Flow • Chuyển cảnh", "Flash Flow • Transition", "闪流引擎 • 转场"), items: [A("cut", "Cut", "Cut", "切换"), A("fade", "Fade", "Fade", "淡入淡出", true), A("wipe", "Wipe", "Wipe", "擦除"), A("save", "Lưu preset", "Save Preset", "保存预设", true)] },
    "studio.broadcast:flash-flow:idle": { title: T("Flash Flow • Idle Video", "Flash Flow • Idle Video", "闪流引擎 • 待机视频"), items: [A("banner", "Banner", "Banner", "横幅"), A("mascot", "Mascot", "Mascot", "吉祥物", true), A("clock", "Đồng hồ", "Clock", "时钟"), A("play", "Chạy idle", "Run Idle", "运行待机", true)] },
    "studio.broadcast:flash-flow:run": { title: T("Flash Flow • Chạy Flow", "Flash Flow • Run", "闪流引擎 • 运行"), items: [A("start", "Bắt đầu", "Start", "开始", true), A("pause", "Tạm dừng", "Pause", "暂停"), A("next", "Cảnh kế", "Next Scene", "下一场景"), A("stop", "Dừng", "Stop", "停止", false, true)] },

    "studio.broadcast:render-record:record": { title: T("Record", "Record", "录制"), items: [A("local", "Ghi máy", "Local Record", "本机录制", true), A("cloud", "Ghi cloud", "Cloud Record", "云录制"), A("format", "Định dạng", "Format", "格式"), A("start", "Bắt đầu ghi", "Start Recording", "开始录制", true)] },
    "studio.broadcast:render-record:clip": { title: T("Clip ngắn", "Short Clip", "短片"), items: [A("15s", "15 giây", "15 seconds", "15秒"), A("30s", "30 giây", "30 seconds", "30秒"), A("60s", "60 giây", "60 seconds", "60秒", true), A("render", "Tạo clip", "Create Clip", "创建短片", true)] },
    "studio.broadcast:render-record:replay": { title: T("Replay", "Replay", "回放"), items: [A("instant", "Replay ngay", "Instant Replay", "即时回放", true), A("mark", "Đánh dấu đoạn", "Mark Segment", "标记片段"), A("slow", "Slow motion", "Slow Motion", "慢动作"), A("save", "Lưu replay", "Save Replay", "保存回放", true)] },
    "studio.broadcast:render-record:render": { title: T("Render", "Render", "渲染"), items: [A("draft", "Render nháp", "Draft Render", "草稿渲染"), A("final", "Render final", "Final Render", "最终渲染", true), A("social", "Xuất social", "Social Export", "社交导出"), A("start", "Bắt đầu render", "Start Render", "开始渲染", true)] },

    "studio.broadcast:export-video:device": { title: T("Xuất về máy", "Download to Device", "下载到设备"), items: [A("mp4", "MP4", "MP4", "MP4", true), A("mov", "MOV", "MOV", "MOV"), A("short", "Clip ngắn", "Short Clip", "短片"), A("download", "Tải về", "Download", "下载", true)] },
    "studio.broadcast:export-video:cloud": { title: T("Xuất cloud", "Export Cloud", "导出云端"), items: [A("drive", "Google Drive", "Google Drive", "Google Drive"), A("dropbox", "Dropbox", "Dropbox", "Dropbox"), A("long", "Long Cloud", "Long Cloud", "Long Cloud", true), A("upload", "Tải lên", "Upload", "上传", true)] },
    "studio.broadcast:export-video:short": { title: T("Xuất clip ngắn", "Export Short Clip", "导出短片"), items: [A("9x16", "9:16", "9:16", "9:16", true), A("1x1", "1:1", "1:1", "1:1"), A("16x9", "16:9", "16:9", "16:9"), A("export", "Xuất clip", "Export Clip", "导出短片", true)] },
    "studio.broadcast:export-video:replay": { title: T("Xuất replay", "Export Replay", "导出回放"), items: [A("full", "Toàn bộ replay", "Full Replay", "完整回放", true), A("segment", "Đoạn đã chọn", "Selected Segment", "已选片段"), A("annotate", "Gắn chú thích", "Add Note", "添加说明"), A("export", "Xuất replay", "Export Replay", "导出回放", true)] },

    "studio.mixer:inputs:mic": { title: T("Nguồn vào • Mic 1–8", "Inputs • Mic 1–8", "输入 • 麦克风1-8"), items: [A("mic1", "Mic 1", "Mic 1", "麦克风1", true), A("mic2", "Mic 2", "Mic 2", "麦克风2"), A("mic3", "Mic 3", "Mic 3", "麦克风3"), A("mic4", "Mic 4", "Mic 4", "麦克风4"), A("gain", "Gain nhanh", "Quick Gain", "快速增益"), A("monitor", "Monitor", "Monitor", "监听"), A("mute", "Mute", "Mute", "静音"), A("save", "Lưu cấu hình", "Save Preset", "保存预设", true)] },
    "studio.mixer:inputs:music": { title: T("Nguồn vào • Nhạc nền", "Inputs • Background Music", "输入 • 背景音乐"), items: [A("playlist", "Playlist", "Playlist", "播放列表", true), A("music1", "Track 1", "Track 1", "曲目1"), A("music2", "Track 2", "Track 2", "曲目2"), A("duck", "Auto ducking", "Auto Ducking", "自动压低"), A("app", "App ngoài", "External App", "外部应用"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.mixer:inputs:usb": { title: T("Nguồn vào • Audio USB", "Inputs • USB Audio", "输入 • USB音频"), items: [A("usb1", "USB 1", "USB 1", "USB 1", true), A("usb2", "USB 2", "USB 2", "USB 2"), A("source", "Chọn nguồn", "Select Source", "选择来源"), A("latency", "Độ trễ", "Latency", "延迟"), A("monitor", "Monitor", "Monitor", "监听"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.mixer:inputs:bluetooth": { title: T("Nguồn vào • Bluetooth", "Inputs • Bluetooth", "输入 • 蓝牙"), items: [A("pair", "Ghép thiết bị", "Pair Device", "配对设备", true), A("saved", "Thiết bị đã lưu", "Saved Devices", "已保存设备"), A("level", "Âm lượng", "Level", "音量"), A("latency", "Độ trễ", "Latency", "延迟"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.mixer:inputs:camera-audio": { title: T("Nguồn vào • Audio từ camera", "Inputs • Camera Audio", "输入 • 相机音频"), items: [A("cam1", "Camera 1", "Camera 1", "相机1", true), A("cam2", "Camera 2", "Camera 2", "相机2"), A("sync", "Đồng bộ AV", "AV Sync", "音视频同步"), A("monitor", "Monitor", "Monitor", "监听"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.mixer:inputs:external": { title: T("Nguồn vào • App ngoài", "Inputs • External Apps", "输入 • 外部应用"), items: [A("obs", "OBS", "OBS", "OBS", true), A("zoom", "Zoom", "Zoom", "Zoom"), A("meet", "Meet", "Meet", "Meet"), A("vlc", "VLC", "VLC", "VLC"), A("custom", "App tùy chỉnh", "Custom App", "自定义应用"), A("attach", "Gắn app", "Attach App", "关联应用", true)] },

    "studio.mixer:audio:gain": { title: T("Âm thanh • Gain / Trim", "Audio • Gain / Trim", "音频 • 增益/微调"), items: [A("trim", "Trim input", "Input Trim", "输入微调", true), A("gain", "Gain input", "Input Gain", "输入增益", true), A("gate", "Noise gate", "Noise Gate", "噪声门"), A("compressor", "Compressor", "Compressor", "压缩器"), A("limiter", "Limiter", "Limiter", "限制器"), A("ext", "App ngoài / audio host", "External App / Host", "外部应用/主机"), A("apply", "Áp dụng", "Apply", "应用", true), A("save", "Lưu cấu hình", "Save Preset", "保存预设", true)] },
    "studio.mixer:audio:eq": { title: T("Âm thanh • EQ", "Audio • EQ", "音频 • 均衡"), items: [A("low", "Low", "Low", "低频"), A("mid", "Mid", "Mid", "中频"), A("high", "High", "High", "高频"), A("parametric", "Parametric EQ", "Parametric EQ", "参数均衡", true), A("analyze", "AI phân tích", "AI Analyze", "AI分析", true), A("apply", "Áp dụng", "Apply", "应用", true), A("save", "Lưu EQ", "Save EQ", "保存EQ")] },
    "studio.mixer:audio:fx": { title: T("Âm thanh • FX1 / FX2", "Audio • FX1 / FX2", "音频 • 效果1/2"), items: [A("reverb", "Reverb", "Reverb", "混响", true), A("delay", "Delay", "Delay", "延迟"), A("echo", "Echo", "Echo", "回声"), A("chorus", "Chorus", "Chorus", "合唱"), A("mix", "Tỉ lệ wet/dry", "Wet/Dry Mix", "湿干比"), A("apply", "Áp dụng", "Apply", "应用", true), A("save", "Lưu FX", "Save FX", "保存效果")] },
    "studio.mixer:audio:aux": { title: T("Âm thanh • AUX send", "Audio • AUX Send", "音频 • AUX发送"), items: [A("aux1", "AUX 1", "AUX 1", "AUX 1", true), A("aux2", "AUX 2", "AUX 2", "AUX 2"), A("monitor", "Monitor send", "Monitor Send", "监听发送"), A("stream", "Stream send", "Stream Send", "直播发送"), A("prepost", "Pre / Post", "Pre / Post", "前/后"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:audio:pan": { title: T("Âm thanh • Pan", "Audio • Pan", "音频 • 声像"), items: [A("left", "Lệch trái", "Left", "左"), A("center", "Giữa", "Center", "中"), A("right", "Lệch phải", "Right", "右"), A("width", "Stereo width", "Stereo Width", "立体声宽度"), A("mono", "Mono", "Mono", "单声道"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:audio:mute-solo": { title: T("Âm thanh • Mute / Solo", "Audio • Mute / Solo", "音频 • 静音/独奏"), items: [A("mute", "Mute", "Mute", "静音", true), A("solo", "Solo", "Solo", "独奏", true), A("group", "Mute group", "Mute Group", "编组静音"), A("safe", "Solo safe", "Solo Safe", "独奏安全"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:audio:main": { title: T("Âm thanh • Main L/R", "Audio • Main L/R", "音频 • 主左右"), items: [A("left", "Main Left", "Main Left", "主左"), A("right", "Main Right", "Main Right", "主右"), A("mastereq", "Master EQ", "Master EQ", "主均衡", true), A("loudness", "Loudness", "Loudness", "响度"), A("record", "Feed sang Record out", "Feed to Record Out", "送到录制输出"), A("apply", "Áp dụng", "Apply", "应用", true)] },

    "studio.mixer:lighting:brightness": { title: T("Ánh sáng • Độ sáng tổng", "Lighting • Master Brightness", "灯光 • 总亮度"), items: [A("all", "Tổng thể", "Master", "总体", true), A("stage", "Sân khấu", "Stage", "舞台"), A("audience", "Khán giả", "Audience", "观众区"), A("apply", "Áp dụng", "Apply", "应用", true), A("save", "Lưu", "Save", "保存")] },
    "studio.mixer:lighting:temperature": { title: T("Ánh sáng • Nhiệt màu", "Lighting • Color Temperature", "灯光 • 色温"), items: [A("warm", "Ấm", "Warm", "暖色"), A("neutral", "Trung tính", "Neutral", "中性", true), A("cool", "Lạnh", "Cool", "冷色"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:lighting:stage": { title: T("Ánh sáng • Sân khấu", "Lighting • Stage", "灯光 • 舞台"), items: [A("front", "Front light", "Front Light", "前灯"), A("back", "Back light", "Back Light", "背灯"), A("spot", "Spotlight", "Spotlight", "追光", true), A("scene", "Scene preset", "Scene Preset", "场景预设"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:lighting:sync": { title: T("Ánh sáng • Đồng bộ cảnh", "Lighting • Scene Sync", "灯光 • 场景同步"), items: [A("broadcast", "Theo phát sóng", "Sync Broadcast", "随播出同步", true), A("music", "Theo nhạc", "Sync Music", "随音乐同步"), A("manual", "Thủ công", "Manual", "手动"), A("apply", "Áp dụng", "Apply", "应用", true)] },

    "studio.mixer:effects:visual": { title: T("Hiệu ứng • Hình ảnh", "FX • Visual", "效果 • 视觉"), items: [A("overlay", "Overlay", "Overlay", "叠加"), A("lower3", "Lower third", "Lower Third", "下三分之一"), A("logo", "Logo bug", "Logo Bug", "台标"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:effects:audio": { title: T("Hiệu ứng • Âm thanh", "FX • Audio", "效果 • 音频"), items: [A("stinger", "Stinger", "Stinger", "音效提示"), A("fx1", "FX 1", "FX 1", "效果1"), A("fx2", "FX 2", "FX 2", "效果2"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:effects:overlay": { title: T("Hiệu ứng • Overlay", "FX • Overlay", "效果 • 叠加"), items: [A("title", "Tiêu đề", "Title", "标题"), A("score", "Bảng điểm", "Scoreboard", "记分板"), A("sponsor", "Nhà tài trợ", "Sponsor", "赞助商"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:effects:transition": { title: T("Hiệu ứng • Transition", "FX • Transition", "效果 • 转场"), items: [A("cut", "Cut", "Cut", "切换"), A("fade", "Fade", "Fade", "淡入淡出", true), A("wipe", "Wipe", "Wipe", "擦除"), A("save", "Lưu preset", "Save Preset", "保存预设", true)] },

    "studio.mixer:outputs:main": { title: T("Đầu ra • Main out", "Outputs • Main Out", "输出 • 主输出"), items: [A("lr", "Main L/R", "Main L/R", "主左右", true), A("speaker", "Ra loa chính", "Main Speakers", "主音箱"), A("compressor", "Compressor cuối", "Final Compressor", "最终压缩"), A("limiter", "Limiter", "Limiter", "限制器"), A("save", "Lưu cấu hình", "Save Profile", "保存配置", true)] },
    "studio.mixer:outputs:monitor": { title: T("Đầu ra • Monitor out", "Outputs • Monitor Out", "输出 • 监听输出"), items: [A("control", "Control room", "Control Room", "控制室", true), A("headphone", "Tai nghe", "Headphones", "耳机"), A("artist", "Monitor sân khấu", "Stage Monitor", "舞台返送"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.mixer:outputs:stream": { title: T("Đầu ra • Stream out", "Outputs • Stream Out", "输出 • 直播输出"), items: [A("stereo", "Stereo stream", "Stereo Stream", "立体声直播", true), A("mono", "Mono backup", "Mono Backup", "单声道备份"), A("level", "Mức stream", "Stream Level", "直播电平"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.mixer:outputs:record": { title: T("Đầu ra • Record out", "Outputs • Record Out", "输出 • 录制输出"), items: [A("master", "Master record", "Master Record", "主录制", true), A("iso", "ISO channels", "ISO Channels", "单独声道"), A("level", "Mức record", "Record Level", "录制电平"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.mixer:outputs:hall": { title: T("Đầu ra • Event hall out", "Outputs • Event Hall Out", "输出 • 会场输出"), items: [A("zoneA", "Zone A", "Zone A", "区域A", true), A("zoneB", "Zone B", "Zone B", "区域B"), A("delay", "Delay line", "Delay Line", "延时线"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.mixer:outputs:tv-led": { title: T("Đầu ra • TV / LED out", "Outputs • TV / LED Out", "输出 • 电视/LED输出"), items: [A("tv", "TV thường", "TV", "电视"), A("led", "LED wall", "LED Wall", "LED墙", true), A("sync", "Đồng bộ video", "Video Sync", "视频同步"), A("fit", "Auto fit", "Auto Fit", "自动适配", true), A("save", "Lưu", "Save", "保存", true)] },

    "studio.mixer:preset:voice": { title: T("Preset • Voice", "Preset • Voice", "预设 • 人声"), items: [A("podcast", "Podcast", "Podcast", "播客", true), A("speech", "Speech", "Speech", "演讲"), A("mc", "MC / Host", "MC / Host", "主持人"), A("apply", "Áp dụng", "Apply", "应用", true), A("save", "Lưu preset", "Save Preset", "保存预设")] },
    "studio.mixer:preset:music": { title: T("Preset • Music", "Preset • Music", "预设 • 音乐"), items: [A("acoustic", "Acoustic", "Acoustic", "原声", true), A("band", "Band", "Band", "乐队"), A("dj", "DJ", "DJ", "DJ"), A("apply", "Áp dụng", "Apply", "应用", true), A("save", "Lưu preset", "Save Preset", "保存预设")] },
    "studio.mixer:preset:event": { title: T("Preset • Event", "Preset • Event", "预设 • 活动"), items: [A("conference", "Hội nghị", "Conference", "会议", true), A("show", "Show", "Show", "演出"), A("outdoor", "Ngoài trời", "Outdoor", "户外"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:preset:safe": { title: T("Preset • Safe", "Preset • Safe", "预设 • 安全"), items: [A("backup", "Backup safe", "Backup Safe", "备份安全", true), A("lowload", "Low load", "Low Load", "低负载"), A("muteall", "Mute all", "Mute All", "全部静音"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.mixer:preset:custom": { title: T("Preset • Custom", "Preset • Custom", "预设 • 自定义"), items: [A("new", "Preset mới", "New Preset", "新预设", true), A("rename", "Đổi tên", "Rename", "重命名"), A("save", "Lưu preset", "Save Preset", "保存预设", true), A("load", "Nạp preset", "Load Preset", "加载预设", true)] },

    "studio.chat:members:list": { title: T("Thành viên • Danh sách", "Members • List", "成员 • 列表"), items: [A("online", "Đang online", "Online", "在线", true), A("all", "Tất cả", "All", "全部"), A("search", "Tìm thành viên", "Find Member", "查找成员"), A("view", "Xem hồ sơ", "View Profile", "查看资料")] },
    "studio.chat:members:invite": { title: T("Thành viên • Mời thêm", "Members • Invite", "成员 • 邀请"), items: [A("qr", "Mời bằng QR", "Invite by QR", "二维码邀请", true), A("link", "Mời bằng link", "Invite by Link", "链接邀请"), A("user", "Chọn user", "Pick User", "选择用户"), A("send", "Gửi lời mời", "Send Invite", "发送邀请", true)] },
    "studio.chat:members:block": { title: T("Thành viên • Chặn", "Members • Block", "成员 • 屏蔽"), items: [A("mute", "Tắt chat", "Mute User", "禁言"), A("block", "Chặn khỏi room", "Block from Room", "从房间屏蔽", true, true), A("history", "Xem lịch sử", "View History", "查看历史"), A("confirm", "Xác nhận", "Confirm", "确认", true)] },
    "studio.chat:members:role": { title: T("Thành viên • Giao quyền", "Members • Assign Role", "成员 • 分配权限"), items: [A("host", "Host", "Host", "主持"), A("mod", "Moderator", "Moderator", "管理员", true), A("guest", "Guest", "Guest", "访客"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "studio.chat:roles:owner": { title: T("Vai trò • Chủ phòng", "Roles • Owner", "角色 • 房主"), items: [A("grant", "Toàn quyền", "Full Access", "完全权限", true), A("transfer", "Chuyển quyền", "Transfer Ownership", "转移房主"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.chat:roles:host": { title: T("Vai trò • Host", "Roles • Host", "角色 • 主持"), items: [A("pin", "Ghim thông báo", "Pin Notice", "置顶通知"), A("speak", "Mở quyền nói", "Open Speaking", "开启发言"), A("invite", "Mời thêm", "Invite", "邀请", true), A("save", "Lưu", "Save", "保存", true)] },
    "studio.chat:roles:mod": { title: T("Vai trò • Moderator", "Roles • Moderator", "角色 • 管理员"), items: [A("mute", "Mute user", "Mute User", "禁言用户"), A("approve", "Duyệt tin", "Approve Messages", "审核消息", true), A("block", "Chặn user", "Block User", "屏蔽用户"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.chat:roles:guest": { title: T("Vai trò • Guest", "Roles • Guest", "角色 • 访客"), items: [A("read", "Chỉ đọc", "Read Only", "只读"), A("chat", "Cho phép chat", "Allow Chat", "允许聊天", true), A("upload", "Cho phép upload", "Allow Upload", "允许上传"), A("save", "Lưu", "Save", "保存", true)] },
    "studio.chat:media:upload": { title: T("Media / File • Tải file", "Media / File • Upload", "媒体文件 • 上传"), items: [A("image", "Ảnh", "Image", "图片", true), A("video", "Video", "Video", "视频"), A("doc", "Tài liệu", "Document", "文档"), A("upload", "Tải lên", "Upload", "上传", true)] },
    "studio.chat:media:image": { title: T("Media / File • Ảnh", "Media / File • Images", "媒体文件 • 图片"), items: [A("recent", "Ảnh gần đây", "Recent Images", "最近图片", true), A("camera", "Chụp ảnh", "Camera", "拍照"), A("send", "Gửi vào room", "Send to Room", "发送到房间", true)] },
    "studio.chat:media:video": { title: T("Media / File • Video", "Media / File • Videos", "媒体文件 • 视频"), items: [A("recent", "Video gần đây", "Recent Videos", "最近视频", true), A("record", "Quay nhanh", "Quick Record", "快速录制"), A("send", "Gửi vào room", "Send to Room", "发送到房间", true)] },
    "studio.chat:media:pin": { title: T("Media / File • Ghim file", "Media / File • Pin File", "媒体文件 • 置顶文件"), items: [A("file1", "File 1", "File 1", "文件1"), A("file2", "File 2", "File 2", "文件2"), A("pin", "Ghim", "Pin", "置顶", true), A("save", "Lưu", "Save", "保存", true)] },

    "store.orders:pending:today": { title: T("Đơn chờ • Hôm nay", "Pending Orders • Today", "待处理订单 • 今天"), items: [A("order1", "Đơn 1", "Order 1", "订单1"), A("order2", "Đơn 2", "Order 2", "订单2"), A("confirm", "Xác nhận", "Confirm", "确认", true), A("update", "Cập nhật", "Update", "更新", true)] },
    "store.orders:pending:customer": { title: T("Đơn chờ • Theo khách", "Pending Orders • By Customer", "待处理订单 • 按客户"), items: [A("find", "Tìm khách", "Find Customer", "查找客户", false, "input"), A("history", "Lịch sử mua", "Purchase History", "购买历史"), A("confirm", "Xác nhận", "Confirm", "确认", true)] },
    "store.orders:pending:event": { title: T("Đơn chờ • Theo sự kiện", "Pending Orders • By Event", "待处理订单 • 按活动"), items: [A("event1", "Sự kiện 1", "Event 1", "活动1"), A("event2", "Sự kiện 2", "Event 2", "活动2"), A("confirm", "Xác nhận", "Confirm", "确认", true)] },
    "store.orders:pending:confirm": { title: T("Đơn chờ • Xác nhận", "Pending Orders • Confirm", "待处理订单 • 确认"), items: [A("approve", "Duyệt đơn", "Approve", "批准", true), A("print", "In", "Print", "打印"), A("notify", "Báo khách", "Notify Customer", "通知客户"), A("done", "Hoàn tất", "Done", "完成", true)] },
    "store.orders:pending:update": { title: T("Đơn chờ • Cập nhật trạng thái", "Pending Orders • Update Status", "待处理订单 • 更新状态"), items: [A("pending", "Pending", "Pending", "待处理"), A("shipping", "Shipping", "Shipping", "配送中"), A("completed", "Completed", "Completed", "已完成"), A("save", "Lưu", "Save", "保存", true)] },

    "store.sales:price:normal": { title: T("Giá bán • Giá thường", "Price • Normal", "价格 • 常规价"), items: [A("view", "Xem giá", "View Price", "查看价格"), A("edit", "Sửa giá", "Edit Price", "编辑价格"), A("save", "Lưu", "Save", "保存", true)] },
    "store.sales:price:event": { title: T("Giá bán • Giá sự kiện", "Price • Event", "价格 • 活动价"), items: [A("event1", "Sự kiện 1", "Event 1", "活动1"), A("event2", "Sự kiện 2", "Event 2", "活动2"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "store.sales:price:combo": { title: T("Giá bán • Combo", "Price • Combo", "价格 • 组合"), items: [A("pair", "Combo đôi", "Pair Combo", "双人组合"), A("group", "Combo nhóm", "Group Combo", "团体组合", true), A("save", "Lưu", "Save", "保存", true)] },
    "store.sales:price:discount": { title: T("Giá bán • Giảm giá", "Price • Discount", "价格 • 折扣"), items: [A("percent", "%", "%", "%"), A("amount", "Số tiền", "Amount", "金额"), A("apply", "Áp dụng", "Apply", "应用", true)] },

    "store.inventory:audit:sku": { title: T("Kiểm kê • Theo SKU", "Audit • By SKU", "盘点 • 按SKU"), items: [A("scan", "Quét SKU", "Scan SKU", "扫描SKU", true), A("count", "Đếm tồn", "Count Stock", "盘点"), A("save", "Lưu", "Save", "保存", true)] },
    "store.inventory:audit:category": { title: T("Kiểm kê • Theo loại", "Audit • By Category", "盘点 • 按类别"), items: [A("drink", "Đồ uống", "Drink", "饮品"), A("food", "Đồ ăn", "Food", "食品"), A("other", "Khác", "Other", "其他"), A("save", "Lưu", "Save", "保存", true)] },
    "store.inventory:audit:low": { title: T("Kiểm kê • Theo mức tồn", "Audit • By Stock Level", "盘点 • 按库存"), items: [A("low", "Sắp hết", "Low", "低库存", true), A("normal", "Bình thường", "Normal", "正常"), A("over", "Dư thừa", "Overstock", "超量"), A("save", "Lưu", "Save", "保存", true)] },
    "store.inventory:audit:event": { title: T("Kiểm kê • Theo sự kiện", "Audit • By Event", "盘点 • 按活动"), items: [A("event1", "Sự kiện 1", "Event 1", "活动1"), A("event2", "Sự kiện 2", "Event 2", "活动2"), A("save", "Lưu", "Save", "保存", true)] },
    "store.inventory:audit:export": { title: T("Kiểm kê • Xuất báo cáo", "Audit • Export Report", "盘点 • 导出报告"), items: [A("pdf", "PDF", "PDF", "PDF", true), A("xlsx", "Excel", "Excel", "Excel"), A("send", "Gửi báo cáo", "Send Report", "发送报告"), A("export", "Xuất", "Export", "导出", true)] },

    "store.shopping:category:event": { title: T("Lọc danh mục • Theo sự kiện", "Category Filter • By Event", "分类筛选 • 按活动"), items: [A("event1", "Sự kiện 1", "Event 1", "活动1"), A("event2", "Sự kiện 2", "Event 2", "活动2"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "store.shopping:category:type": { title: T("Lọc danh mục • Theo loại", "Category Filter • By Type", "分类筛选 • 按类型"), items: [A("drink", "Đồ uống", "Drink", "饮品"), A("food", "Đồ ăn", "Food", "食品"), A("gift", "Quà tặng", "Gift", "礼物"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "store.shopping:category:price": { title: T("Lọc danh mục • Theo giá", "Category Filter • By Price", "分类筛选 • 按价格"), items: [A("low", "Giá thấp", "Low Price", "低价"), A("mid", "Giá vừa", "Mid Price", "中价"), A("high", "Giá cao", "High Price", "高价"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "store.shopping:category:promo": { title: T("Lọc danh mục • Khuyến mại", "Category Filter • Promotion", "分类筛选 • 促销"), items: [A("hot", "Hot deal", "Hot Deal", "热卖"), A("combo", "Combo", "Combo", "组合"), A("event", "Theo sự kiện", "By Event", "按活动"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "store.shopping:checkout:cod": { title: T("Thanh toán • COD", "Checkout • COD", "结账 • 货到付款"), mode: "pay", items: [A("address", "Xác nhận địa chỉ", "Confirm Address", "确认地址"), A("phone", "Số điện thoại", "Phone", "电话"), A("confirm", "Xác nhận thanh toán", "Confirm Payment", "确认付款", true)] },
    "store.shopping:checkout:bank": { title: T("Thanh toán • Chuyển khoản", "Checkout • Bank Transfer", "结账 • 银行转账"), mode: "pay", items: [A("bank", "Chọn ngân hàng", "Select Bank", "选择银行"), A("qr", "Mã QR", "QR Code", "二维码", true), A("confirm", "Xác nhận thanh toán", "Confirm Payment", "确认付款", true)] },
    "store.shopping:checkout:wallet": { title: T("Thanh toán • Ví điện tử", "Checkout • Wallet", "结账 • 电子钱包"), mode: "pay", items: [A("momo", "Ví 1", "Wallet 1", "钱包1"), A("zalo", "Ví 2", "Wallet 2", "钱包2"), A("confirm", "Xác nhận thanh toán", "Confirm Payment", "确认付款", true)] },
    "store.shopping:checkout:qr": { title: T("Thanh toán • QR Pay", "Checkout • QR Pay", "结账 • 二维码支付"), mode: "pay", items: [A("show", "Hiển thị QR", "Show QR", "显示二维码", true), A("scan", "Quét để thanh toán", "Scan to Pay", "扫码支付"), A("confirm", "Xác nhận thanh toán", "Confirm Payment", "确认付款", true)] },

    "me.profile:personal:view": { title: T("Thông tin cá nhân • Xem", "Personal Info • View", "个人信息 • 查看"), items: [A("name", "Tên", "Name", "姓名"), A("phone", "Số điện thoại", "Phone", "电话"), A("email", "Email", "Email", "邮箱"), A("edit", "Chỉnh sửa", "Edit", "编辑", true)] },
    "me.profile:personal:edit": { title: T("Thông tin cá nhân • Sửa", "Personal Info • Edit", "个人信息 • 编辑"), items: [A("name", "Tên", "Name", "姓名", false, "input"), A("phone", "Số điện thoại", "Phone", "电话", false, "input"), A("email", "Email", "Email", "邮箱", false, "input"), A("save", "Lưu", "Save", "保存", true)] },
    "me.profile:personal:security": { title: T("Thông tin cá nhân • Bảo mật", "Personal Info • Security", "个人信息 • 安全"), items: [A("faceid", "Face ID", "Face ID", "Face ID", true), A("social", "Đăng nhập nhanh", "Quick Login", "快速登录"), A("password", "Mật khẩu", "Password", "密码"), A("save", "Lưu", "Save", "保存", true)] },
    "me.profile:personal:sync": { title: T("Thông tin cá nhân • Đồng bộ", "Personal Info • Sync", "个人信息 • 同步"), items: [A("cloud", "Cloud", "Cloud", "云端", true), A("phone", "Điện thoại", "Phone", "手机"), A("laptop", "Laptop", "Laptop", "笔记本"), A("run", "Đồng bộ ngay", "Sync Now", "立即同步", true)] },

    "me.profile:account:login": { title: T("Tài khoản • Đăng nhập", "Account • Login", "账户 • 登录"), items: [A("faceid", "Face ID", "Face ID", "Face ID", true), A("google", "Google", "Google", "Google"), A("apple", "Apple", "Apple", "Apple"), A("save", "Lưu", "Save", "保存", true)] },
    "me.profile:account:email": { title: T("Tài khoản • Email", "Account • Email", "账户 • 邮箱"), items: [A("view", "Xem email", "View Email", "查看邮箱"), A("edit", "Đổi email", "Change Email", "更改邮箱"), A("save", "Lưu", "Save", "保存", true)] },
    "me.profile:account:phone": { title: T("Tài khoản • Số điện thoại", "Account • Phone", "账户 • 电话"), items: [A("view", "Xem số", "View Phone", "查看电话"), A("edit", "Đổi số", "Change Phone", "更改电话"), A("otp", "Xác minh OTP", "Verify OTP", "OTP验证", true), A("save", "Lưu", "Save", "保存", true)] },
    "me.profile:account:delete": { title: T("Tài khoản • Xóa", "Account • Delete", "账户 • 删除"), items: [A("archive", "Lưu dữ liệu", "Archive Data", "归档数据"), A("confirm", "Xác nhận xóa", "Confirm Delete", "确认删除", true, true)] },

    "me.settings:language:vi": { title: T("Ngôn ngữ • Tiếng Việt", "Language • Vietnamese", "语言 • 越南语"), items: [A("preview", "Xem trước", "Preview", "预览"), A("apply", "Áp dụng", "Apply", "应用", true), A("save", "Lưu", "Save", "保存", true)] },
    "me.settings:language:en": { title: T("Ngôn ngữ • English", "Language • English", "语言 • 英语"), items: [A("preview", "Preview", "Preview", "预览"), A("apply", "Apply", "Apply", "应用", true), A("save", "Save", "Save", "保存", true)] },
    "me.settings:language:zh": { title: T("Ngôn ngữ • 中文", "Language • Chinese", "语言 • 中文"), items: [A("preview", "Preview", "Preview", "预览"), A("apply", "Apply", "Apply", "应用", true), A("save", "Save", "Save", "保存", true)] },
    "me.settings:appearance:mobile": { title: T("Giao diện • Mobile", "Appearance • Mobile", "外观 • 移动端"), items: [A("light", "Sáng", "Light", "亮色", true), A("density", "Mật độ", "Density", "密度"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "me.settings:appearance:web": { title: T("Giao diện • Web", "Appearance • Web", "外观 • 网页"), items: [A("light", "Sáng", "Light", "亮色", true), A("1920", "1920 × 1080", "1920 × 1080", "1920 × 1080"), A("fit", "Auto fit", "Auto Fit", "自动适配", true), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "me.settings:appearance:tv": { title: T("Giao diện • TV", "Appearance • TV", "外观 • 电视"), items: [A("720", "720p", "720p", "720p", true), A("1080", "1080p", "1080p", "1080p"), A("safe", "Safe area", "Safe Area", "安全区"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "me.settings:appearance:font": { title: T("Giao diện • Cỡ chữ", "Appearance • Font Size", "外观 • 字体大小"), items: [A("small", "Nhỏ", "Small", "小"), A("medium", "Vừa", "Medium", "中", true), A("large", "Lớn", "Large", "大"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "me.settings:appearance:density": { title: T("Giao diện • Mật độ hiển thị", "Appearance • Display Density", "外观 • 显示密度"), items: [A("compact", "Gọn", "Compact", "紧凑"), A("normal", "Chuẩn", "Normal", "标准", true), A("wide", "Thoáng", "Comfortable", "舒适"), A("apply", "Áp dụng", "Apply", "应用", true)] },
    "me.settings:devices:camera": { title: T("Thiết bị • Camera", "Devices • Camera", "设备 • 摄像头"), items: [A("allow", "Cho phép", "Allow", "允许", true), A("deny", "Không cho phép", "Deny", "拒绝"), A("test", "Test camera", "Test Camera", "测试摄像头"), A("save", "Lưu", "Save", "保存", true)] },
    "me.settings:devices:micro": { title: T("Thiết bị • Micro", "Devices • Microphone", "设备 • 麦克风"), items: [A("allow", "Cho phép", "Allow", "允许", true), A("test", "Test micro", "Test Microphone", "测试麦克风"), A("level", "Mức âm", "Input Level", "输入电平"), A("save", "Lưu", "Save", "保存", true)] },
    "me.settings:devices:notice": { title: T("Thiết bị • Thông báo", "Devices • Notifications", "设备 • 通知"), items: [A("allow", "Cho phép", "Allow", "允许", true), A("mute", "Tắt", "Mute", "静音"), A("priority", "Ưu tiên", "Priority", "优先"), A("save", "Lưu", "Save", "保存", true)] },
    "me.settings:devices:login": { title: T("Thiết bị • Đăng nhập", "Devices • Login", "设备 • 登录"), items: [A("faceid", "Face ID", "Face ID", "Face ID", true), A("social", "Social login", "Social Login", "社交登录"), A("logout", "Đăng xuất tất cả", "Logout All", "全部登出"), A("save", "Lưu", "Save", "保存", true)] },
    "me.settings:devices:permissions": { title: T("Thiết bị • Quyền thiết bị", "Devices • Permissions", "设备 • 权限"), items: [A("camera", "Camera", "Camera", "摄像头"), A("micro", "Micro", "Microphone", "麦克风"), A("storage", "Bộ nhớ", "Storage", "存储"), A("apply", "Áp dụng", "Apply", "应用", true)] },
  };
  const key = `${section}:${child}:${action}`;
  return m[key] || null;
}

function fallbackEnd(section: string, child: NavChild, action?: Act | null): EndBlock {
  const childName = tx(child.label, "vi");
  const actionName = action ? tx(action.label, "vi") : childName;
  const title = action ? `${childName} • ${actionName}` : childName;

  if (section.startsWith("studio.mixer")) {
    return {
      title: T(title, title, title),
      items: [
        A("view", "Xem cấu hình", "View Config", "查看配置", true),
        A("level", "Mức / thông số", "Level / Parameters", "电平/参数"),
        A("attach", "Gắn app ngoài", "Attach External App", "关联外部应用"),
        A("monitor", "Monitor", "Monitor", "监听"),
        A("apply", "Áp dụng", "Apply", "应用", true),
        A("save", "Lưu cấu hình", "Save Profile", "保存配置", true),
      ],
    };
  }

  if (section.startsWith("studio.broadcast")) {
    return {
      title: T(title, title, title),
      items: [
        A("open", "Mở", "Open", "打开", true),
        A("config", "Cấu hình", "Configure", "配置"),
        A("preview", "Preview", "Preview", "预览", true),
        A("device", "Gắn thiết bị / app ngoài", "Attach Device / App", "关联设备/应用"),
        A("apply", "Áp dụng", "Apply", "应用", true),
        A("save", "Lưu", "Save", "保存", true),
      ],
    };
  }

  if (section.startsWith("studio.chat")) {
    return {
      title: T(title, title, title),
      mode: "chat",
      items: [
        A("open", "Mở trong room", "Open in Room", "在房间打开", true),
        A("message", "Ô nhập / nội dung", "Input / Content", "输入/内容", true, "chat"),
        A("send", "Gửi / áp dụng", "Send / Apply", "发送/应用", true),
        A("pin", "Ghim", "Pin", "置顶"),
        A("save", "Lưu nếu có quyền", "Save if Allowed", "有权限则保存"),
      ],
    };
  }

  if (section.startsWith("home.events")) {
    return {
      title: T(title, title, title),
      mode: "list",
      items: [
        A("notice1", "Thông báo 1", "Notice 1", "通知1", true, "notice"),
        A("notice2", "Thông báo 2", "Notice 2", "通知2", false, "notice"),
        A("watch", "Check / Watch / Read", "Check / Watch / Read", "检查/观看/阅读", true),
        A("confirm", "Confirm / Read / Add", "Confirm / Read / Add", "确认/阅读/添加", true),
      ],
    };
  }

  if (section.startsWith("home.myai")) {
    return {
      title: T(title, title, title),
      mode: "chat",
      items: [
        A("chat", "Chat / giao việc", "Chat / Assign Task", "聊天/分配任务", true, "chat"),
        A("template", "Mẫu tác vụ", "Task Templates", "任务模板"),
        A("run", "Chạy tác vụ", "Run Task", "运行任务", true),
        A("save", "Lưu kết quả", "Save Result", "保存结果", true),
      ],
    };
  }

  if (section.startsWith("home.connect")) {
    return {
      title: T(title, title, title),
      items: [
        A("scan", "Quét / tìm tự động", "Scan / Auto Detect", "扫描/自动查找", true),
        A("connect", "Kết nối", "Connect", "连接", true),
        A("config", "Cấu hình", "Configure", "配置"),
        A("test", "Kiểm tra", "Test", "测试", true),
        A("save", "Lưu kết nối", "Save Connection", "保存连接", true),
      ],
    };
  }

  if (section.startsWith("home.quickcreate")) {
    return {
      title: T(title, title, title),
      items: [
        A("template", "Chọn mẫu", "Choose Template", "选择模板"),
        A("input", "Nhập nhanh", "Quick Input", "快速输入", false, "input"),
        A("ai", "AI gợi ý", "AI Suggest", "AI建议", true),
        A("preview", "Xem trước", "Preview", "预览"),
        A("create", "Tạo ngay", "Create Now", "立即创建", true),
      ],
    };
  }

  if (section.startsWith("store.orders")) {
    return {
      title: T(title, title, title),
      mode: "list",
      items: [
        A("list", "Danh sách đơn", "Order List", "订单列表", true),
        A("status", "Trạng thái", "Status", "状态"),
        A("customer", "Khách hàng", "Customer", "客户"),
        A("update", "Cập nhật", "Update", "更新", true),
        A("export", "Xuất / gửi", "Export / Send", "导出/发送"),
      ],
    };
  }

  if (section.startsWith("store.sales")) {
    return {
      title: T(title, title, title),
      items: [
        A("view", "Xem nội dung bán", "View Sales Content", "查看销售内容", true),
        A("edit", "Chỉnh sửa", "Edit", "编辑"),
        A("ai", "AI tối ưu", "AI Optimize", "AI优化", true),
        A("publish", "Mở bán / áp dụng", "Publish / Apply", "发布/应用", true),
        A("save", "Lưu", "Save", "保存"),
      ],
    };
  }

  if (section.startsWith("store.inventory")) {
    return {
      title: T(title, title, title),
      items: [
        A("scan", "Quét mã", "Scan Code", "扫码", true),
        A("quantity", "Số lượng", "Quantity", "数量", false, "input"),
        A("status", "Tình trạng", "Status", "状态"),
        A("alert", "Cảnh báo", "Alert", "预警", true),
        A("save", "Lưu kho", "Save Inventory", "保存库存", true),
      ],
    };
  }

  if (section.startsWith("store.shopping")) {
    return {
      title: T(title, title, title),
      mode: "grid",
      items: [
        A("items", "Hiển thị sản phẩm", "Show Products", "显示商品", true, "product"),
        A("filter", "Bộ lọc", "Filters", "筛选"),
        A("cart", "Giỏ hàng", "Cart", "购物车", true),
        A("checkout", "Thanh toán", "Checkout", "结账", true),
        A("save", "Lưu lựa chọn", "Save Selection", "保存选择"),
      ],
    };
  }

  if (section.startsWith("me.profile")) {
    return {
      title: T(title, title, title),
      items: [
        A("view", "Xem thông tin", "View Info", "查看信息", true),
        A("edit", "Chỉnh sửa", "Edit", "编辑"),
        A("verify", "Xác minh", "Verify", "验证", true),
        A("sync", "Đồng bộ", "Sync", "同步"),
        A("save", "Lưu", "Save", "保存", true),
      ],
    };
  }

  if (section.startsWith("me.settings")) {
    return {
      title: T(title, title, title),
      items: [
        A("current", "Trạng thái hiện tại", "Current State", "当前状态", true),
        A("choose", "Chọn tùy chọn", "Choose Option", "选择选项"),
        A("preview", "Xem trước", "Preview", "预览"),
        A("apply", "Áp dụng", "Apply", "应用", true),
        A("save", "Lưu", "Save", "保存", true),
      ],
    };
  }

  if (section.startsWith("me.notifications")) {
    return {
      title: T(title, title, title),
      mode: "list",
      items: [
        A("new", "Mới", "New", "新", true),
        A("priority", "Ưu tiên", "Priority", "优先", true),
        A("read", "Đã đọc", "Read", "已读"),
        A("mute", "Tắt nhắc", "Mute", "静音"),
        A("save", "Lưu", "Save", "保存"),
      ],
    };
  }

  return {
    title: T(title, title, title),
    items: [
      A("open", "Mở nội dung", "Open Content", "打开内容", true),
      A("option", "Tùy chọn", "Options", "选项"),
      A("apply", "Áp dụng", "Apply", "应用", true),
      A("save", "Lưu", "Save", "保存", true),
    ],
  };
}

function getEndContent(section: string, active: NavChild, action?: Act | null): EndBlock {
  if (active.endType) {
    return directEnd(active.endType) || fallbackEnd(section, active, action);
  }
  if (action) {
    return comboEnd(section, active.id, action.id) || fallbackEnd(section, active, action);
  }
  return fallbackEnd(section, active, action);
}

function isTerminalAction(a: Act) {
  return /^(save|apply|confirm|create|publish|checkout|upload|download|start|stop|take-live|leave|resolve|send|connect|checkin|arm|run)$/i.test(a.id);
}

function endLabel(section: string, active: NavChild, selected: Act | null, lang: Lang) {
  const id = active.endType || "";
  if (id === "createNotice") return lang === "en" ? "Save & Publish Notice" : lang === "zh" ? "保存并发布通知" : "Lưu & Đăng Thông Báo";
  if (id === "createLive") return lang === "en" ? "Create Live Room" : lang === "zh" ? "创建直播间" : "Tạo room live";
  if (id === "createProduct") return lang === "en" ? "Save & Publish Product" : lang === "zh" ? "保存并发布商品" : "Lưu & Đăng Sản Phẩm";
  if (section.startsWith("studio.mixer")) return lang === "en" ? "Apply & Save" : lang === "zh" ? "应用并保存" : "Áp dụng & Lưu";
  if (section.startsWith("studio.broadcast")) return lang === "en" ? "Apply / TAKE LIVE" : lang === "zh" ? "应用 / 切入直播" : "Áp dụng / TAKE LIVE";
  if (selected?.id === "send") return lang === "en" ? "Send" : lang === "zh" ? "发送" : "Gửi";
  return lang === "en" ? "Complete" : lang === "zh" ? "完成" : "Hoàn tất";
}

function AIFlashWorkspace({ lang, onBack, record }: { lang: Lang; onBack: () => void; record: ReturnType<typeof useEventSpace>["record"] }) {
  type Msg = { role: "user" | "ai"; body: string };
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const storageKey = "long-ai-flash-chat-v1";

  useEffect(() => {
    try { setMessages(JSON.parse(localStorage.getItem(storageKey) || "[]")); } catch { setMessages([]); }
  }, []);

  function persist(next: Msg[]) {
    setMessages(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next.slice(-80))); } catch {}
  }

  const [thinking, setThinking] = useState(false);
  const [aiError, setAiError] = useState("");

  async function send(body = text) {
    const clean = body.trim();
    if (!clean || thinking) return;
    const next: Msg[] = [...messages, { role: "user", body: clean }];
    persist(next); setText(""); setSaved(false); setThinking(true); setAiError("");
    try {
      const r = await fetch("/api/ai/flash", {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:next})});
      const j = await r.json().catch(()=>null);
      if(!r.ok || !j?.ok) throw new Error(j?.message || `AI Flash ${r.status}`);
      persist([...next,{role:"ai",body:String(j.text||"")}]);
      record({ area: "home.myai", action: "ai-flash:send", result: "end-repeat-live", costClass: "cloud-low", ok: true });
    } catch(e:any) {
      const message=e?.message || (lang==="vi"?"AI Flash chưa kết nối.":"AI Flash is not connected.");
      setAiError(message);
      persist([...next,{role:"ai",body:message}]);
      record({ area: "home.myai", action: "ai-flash:send", result: "provider-error", costClass: "cloud-low", ok: false });
    } finally { setThinking(false); }
  }

  function save() {
    try { localStorage.setItem("long-ai-flash-saved-result", JSON.stringify({ savedAt: new Date().toISOString(), messages })); } catch {}
    setSaved(true);
    record({ area: "home.myai", action: "ai-flash:save", result: "end-repeat", costClass: "local", ok: true });
  }

  const quick = lang === "en" ? ["Create event outline", "Summarize current work", "Prepare announcement"] : lang === "zh" ? ["创建活动框架", "总结当前工作", "准备通知"] : ["Dựng khung sự kiện", "Tóm tắt công việc hiện tại", "Soạn thông báo"];

  return <section className="navWorkspace aiFlashWorkspace">
    <div className="workspaceCrumbs">
      <button type="button" className="backKey" onClick={onBack}>← Back</button>
      <button type="button" className="crumbKey selected">AI Flash</button>
    </div>
    <div className="aiFlashBody">
      <div className="aiFlashHead"><b>AI Flash</b><span>{lang === "en" ? "Chat • tasks • reusable END" : lang === "zh" ? "聊天 • 任务 • 可重复 END" : "Chat • giao việc • END lặp trong workspace"}</span></div>
      <div className="aiFlashLog" aria-live="polite">
        {thinking && <div className="aiThinking">AI Flash · {lang === "vi" ? "Đang suy nghĩ…" : lang === "zh" ? "正在思考…" : "Thinking…"}</div>}{aiError && <div className="aiError">{aiError}</div>}{messages.length === 0 ? <div className="aiEmpty">{lang === "en" ? "Start a conversation with AI Flash." : lang === "zh" ? "开始与 AI Flash 对话。" : "Bắt đầu trò chuyện với AI Flash."}</div> : messages.map((m, i) => <div key={i} className={`aiMsg ${m.role}`}><b>{m.role === "user" ? (lang === "vi" ? "Bạn" : lang === "zh" ? "你" : "You") : "AI Flash"}</b><span>{m.body}</span></div>)}
      </div>
      <div className="aiQuickRow">{quick.map(q => <button type="button" key={q} onClick={() => send(q)}>{q}</button>)}</div>
      <div className="aiComposer">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder={lang === "en" ? "Message AI Flash…" : lang === "zh" ? "向 AI Flash 输入消息…" : "Nhập yêu cầu cho AI Flash…"} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button type="button" className="endCommit" disabled={thinking} onClick={() => send()}>{lang === "en" ? "Send · END" : lang === "zh" ? "发送 · END" : "Gửi · END"}</button>
      </div>
      <div className="aiToolRow">
        <button type="button" onClick={() => setText(quick[0])}>{lang === "vi" ? "Giao việc nhanh" : lang === "zh" ? "快速任务" : "Quick Task"}</button>
        <button type="button" onClick={() => setText(quick[2])}>{lang === "vi" ? "Mẫu tác vụ" : lang === "zh" ? "任务模板" : "Task Template"}</button>
        <button type="button" onClick={save}>{saved ? "✓ " : ""}{lang === "vi" ? "Lưu kết quả" : lang === "zh" ? "保存结果" : "Save Result"}</button>
      </div>
    </div>
  </section>;
}

export default function Nav3Navigator({ section, items, activeId, onSelect, lang }: { section: string; items: NavChild[]; activeId: string; onSelect: (id: string) => void; lang: Lang }) {
  const active = items.find((x) => x.id === activeId) || items[0];
  const [action, setAction] = useState<Act | null>(null);
  const [selected, setSelected] = useState<Act | null>(null);
  const [openedDirectId, setOpenedDirectId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [done, setDone] = useState(false);
  const { record } = useEventSpace();

  useEffect(() => {
    setAction(null);
    setSelected(null);
    setOpenedDirectId(null);
    setDraft("");
    setDone(false);
  }, [section]);

  const childActs = useMemo(() => actions(section, active.id), [section, active.id]);
  const direct = !!active.directToEnd;
  const contentOpen = !!action || (direct && openedDirectId === active.id);
  const content = useMemo(() => getEndContent(section, active, action), [section, active, action]);

  function resetToB() {
    setAction(null); setSelected(null); setOpenedDirectId(null); setDraft(""); setDone(false);
  }

  function choose3(id: string) {
    const target = items.find((x) => x.id === id);
    onSelect(id);
    setAction(null); setSelected(null); setDraft(""); setDone(false);
    setOpenedDirectId(target?.directToEnd ? id : null);
  }

  function choose4(a: Act) {
    setAction(a); setSelected(null); setDraft(""); setDone(false); setOpenedDirectId(null);
    record({ area: section, action: `${active.id}:${a.id}`, result: "tree4-selected", costClass: "local", ok: true });
  }

  function choose5(a: Act) {
    setSelected(a); setDraft(""); setDone(false);
    record({ area: section, action: `${active.id}:${action?.id || "direct"}:${a.id}`, result: "tree5-selected", costClass: a.id.includes("ai") ? "cloud-low" : "local", ok: true });
    if (isTerminalAction(a) && a.kind !== "input" && a.kind !== "chat") finishEnd(a, true);
  }

  function finishEnd(a = selected, immediate = false) {
    if (!a && !selected) return;
    const target = a || selected!;
    setDone(true);
    record({ area: section, action: `${active.id}:${action?.id || "direct"}:${target.id}`, result: "END", costClass: target.id.includes("ai") ? "cloud-low" : "local", ok: true });
    window.setTimeout(resetToB, immediate ? 700 : 900);
  }

  function backOne() {
    if (selected) { setSelected(null); setDraft(""); setDone(false); return; }
    resetToB();
  }

  if (contentOpen && active.endType === "aiFlashChat") {
    return <AIFlashWorkspace lang={lang} onBack={resetToB} record={record} />;
  }
  if (contentOpen && active.endType === "appearanceCenter") return <AppearanceCenter lang={lang} onBack={resetToB}/>;
  if (contentOpen && active.endType === "soundCenter") return <SoundCenter lang={lang} onBack={resetToB}/>;
  if (contentOpen && active.endType === "privacyCenter") return <PrivacyCenter lang={lang} onBack={resetToB}/>;
  if (contentOpen && active.endType === "securityCenter") return <SecurityCenter lang={lang} onBack={resetToB}/>;
  if (contentOpen && active.endType === "stickerStore") return <StickerStore lang={lang} onBack={resetToB} mode="store"/>;
  if (contentOpen && active.endType === "stickerWallet") return <StickerStore lang={lang} onBack={resetToB} mode="wallet"/>;
  if (contentOpen && active.id === "checkout") return <PaymentCenter lang={lang} onBack={resetToB}/>;
  if (contentOpen && section === "home.connect" && active.id === "devices" && action?.id === "laptop" && selected?.id === "hdmi") return <MediaConnectionPanel lang={lang} onBack={backOne} onDone={()=>finishEnd(selected,false)}/>;

  if (contentOpen) {
    return <section className={`navWorkspace contentSurface mode-${content.mode || "grid"}`}>
      <div className="workspaceCrumbs">
        <button type="button" className="backKey" onClick={backOne}>← Back</button>
        <button type="button" className="crumbKey selected" onClick={() => { setSelected(null); setDone(false); }}>{label(active.label, lang)}</button>
        {action && <button type="button" className="crumbKey selected" onClick={() => { setSelected(null); setDone(false); }}>{tx(action.label, lang)}</button>}
        {selected && <button type="button" className="crumbKey selected tree5Crumb">{tx(selected.label, lang)}</button>}
      </div>

      {content.note && !selected && <p className="contentNote">{tx(content.note, lang)}</p>}

      {!selected ? <div className="contentGrid">
        {content.items.map((x) => <button type="button" key={x.id} className={(x.priority ? "priority " : "") + (x.danger ? "danger " : "") + `kind-${x.kind || "action"}`} onClick={() => choose5(x)}>
          <b>{tx(x.label, lang)}</b>{x.kind === "input" && <small>Input → END</small>}{x.kind === "chat" && <small>Chat → END</small>}
        </button>)}
      </div> : (selected.kind === "input" || selected.kind === "chat" || active.endType === "createNotice") ? <div className="endWorkPanel">
        <div className="endWorkCopy"><b>{tx(selected.label, lang)}</b><span>{lang === "en" ? "Enter the required content, then commit END." : lang === "zh" ? "输入所需内容，然后提交 END。" : "Nhập nội dung cần thiết, sau đó xác nhận END."}</span></div>
        <label className="endInput"><span>{active.endType === "createNotice" ? (lang === "en" ? "Notice title / content" : lang === "zh" ? "通知标题 / 内容" : "Tiêu đề / nội dung thông báo") : selected.kind === "chat" ? (lang === "vi"?"Tin nhắn":"Message") : (lang === "vi"?"Nội dung":"Input")}</span><textarea value={draft} onChange={e => setDraft(e.target.value)} /></label>
        <div className="endCommitRow"><button type="button" className="secondaryEnd" onClick={() => { setSelected(null); setDraft(""); }}>{lang === "en" ? "Choose again" : lang === "zh" ? "重新选择" : "Chọn lại"}</button><button type="button" className="endCommit" disabled={!draft.trim()} onClick={() => finishEnd()}>{done ? "✓ END" : endLabel(section, active, selected, lang)}</button></div>
      </div> : <FunctionalTaskPanel lang={lang} title={tx(selected.label,lang)} onCancel={()=>{setSelected(null);setDraft("");}} onComplete={()=>finishEnd(selected,false)}/>}
    </section>;
  }

  return <section className="navWorkspace navGroupB">
    <div className="navColumn"><div className="keyboardList">{items.map((x) => <button type="button" key={x.id} className={(x.id === active.id ? "selected " : "") + (x.priority ? "priority " : "") + (x.danger ? "danger" : "")} onClick={() => choose3(x.id)}><b>{label(x.label, lang)}</b></button>)}</div></div>
    <div className="navColumn child"><div className="keyboardList">
      {direct ? <button type="button" className="priority" onClick={() => setOpenedDirectId(active.id)}><b>{lang === "en" ? `Open ${label(active.label, lang)}` : lang === "zh" ? `打开 ${label(active.label, lang)}` : `Mở ${label(active.label, lang)}`}</b></button> : childActs.map((x) => <button type="button" key={x.id} className={(x.priority ? "priority " : "") + (x.danger ? "danger" : "")} onClick={() => choose4(x)}><b>{tx(x.label, lang)}</b></button>)}
    </div></div>
  </section>;
}
