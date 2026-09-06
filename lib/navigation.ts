export type Lang="vi"|"en"|"zh";
export type Localized={vi:string;en:string;zh:string};
export type NavChild={id:string;label:Localized;priority?:boolean;danger?:boolean;directToEnd?:boolean;skipTree4?:boolean;endType?:string};
export type CoreItem={id:string;label:Localized;children:NavChild[];directToEnd?:boolean;endType?:string};
export const L=(vi:string,en:string,zh:string):Localized=>({vi,en,zh});
export const C=(id:string,vi:string,en:string,zh:string,priority=false,danger=false,directToEnd=false,endType=""):NavChild=>({id,label:L(vi,en,zh),priority,danger,directToEnd,endType});
export const core={
 home:[
  {id:"home.events",label:L("Sự kiện","Events","活动"),children:[
   C("gift","Có Quà Tặng","Gift Available","有礼物",true,false,true,"eventGift"),
   C("no-ticket","Không Vé","No Ticket","无票",false,false,true,"eventNoTicket"),
   C("ticket","Có Vé","Ticket Available","有票",true,false,true,"eventTicket"),
   C("my-events","Sự kiện của tôi","My Events","我的活动",true,false,true,"myEvents")
  ]},
  {id:"home.myai",label:L("AI của tôi","My AI","我的AI"),children:[
   C("ai-flash","AI Flash","AI Flash","AI闪流",true,false,true,"aiFlash"),
   C("my-ai","AI của tôi","My AI","我的AI",true,false,true,"myAITools"),
   C("studio-ai","AI Phòng Thu","Studio AI","录制室AI",false,false,true,"studioAI"),
   C("ai-finance","Quản lý AI và Thu-Chi","AI & Finance Manager","AI与收支管理",true,false,true,"aiFinance")
  ]},
  {id:"home.connect",label:L("Kết Nối","Connect","连接"),children:[
   C("devices","Thiết bị","Devices","设备"),
   C("screen","TV / Màn hình","TV & Screen","电视与屏幕",true),
   C("qr","QR / Check-in","QR / Check-in","二维码签到",true),
   C("apps","Ứng dụng ngoài","External Apps","外部应用"),
   C("accounts","Tài khoản","Accounts","账户"),
   C("api","Custom API","Custom API","自定义API")
  ]},
  {id:"home.quickcreate",label:L("Tạo nhanh","Quick Create","快速创建"),children:[
   C("event","Tạo sự kiện","Create Event","创建活动",true),
   C("live","Tạo live","Go Live","创建直播",true),
   C("chat","Tạo phòng chat","Create Chat Room","创建聊天室",true),
   C("notice","Tạo thông báo","Create Notice","创建通知"),
   C("product","Tạo sản phẩm","Create Product","创建商品"),
   C("flash-idle","Flash Idle Video","Flash Idle Video","Flash待机视频")
  ]}
 ],
 studio:[
  {id:"studio.broadcast",label:L("Phát sóng","Broadcast","播出"),children:[
   C("create-live","Tạo room live","Create Live Room","创建直播间",true,false,true,"createLive"),
   C("quick-room","Vào phòng nhanh","Quick Room","快速进房",true,false,true,"quickRoom"),
   C("preview","Preview","Preview","预览"),
   C("video-output","Đầu ra video","Video Output","视频输出",true),
   C("flash-flow","Flash Flow","Flash Flow","闪流引擎"),
   C("render-record","Render / Record","Render / Record","渲染/录制"),
   C("export-video","Xuất video","Export Video","导出视频")
  ]},
  {id:"studio.mixer",label:L("Bàn Mix","Mixer Console","调音台"),children:[
   C("inputs","Nguồn vào","Inputs","输入"),
   C("audio","Âm thanh","Audio","音频",true),
   C("lighting","Ánh sáng","Lighting","灯光"),
   C("effects","Hiệu ứng","FX","效果"),
   C("outputs","Đầu ra","Outputs","输出",true),
   C("preset","Preset","Preset","场景预设",true)
  ]},
  {id:"studio.chat",label:L("Chat room","Chat Room","聊天室"),children:[
   C("join","Vào phòng","Join Room","进入房间",true,false,true,"chatJoin"),
   C("messages","Tin nhắn","Messages","消息"),
   C("members","Thành viên","Members","成员"),
   C("roles","Vai trò","Roles","角色"),
   C("notices","Thông báo","Notices","通知",true),
   C("media","Media / File","Media / File","媒体文件"),
   C("leave","Rời phòng","Leave Room","离开房间",false,true)
  ]}
 ],
 store:[
  {id:"store.orders",label:L("Đơn hàng","Orders","订单"),children:[
   C("all","Tất cả","All","全部",false,false,true,"ordersAll"),
   C("pending","Chờ xử lý","Pending","待处理",true),
   C("shipping","Đang giao","Shipping","配送中"),
   C("completed","Hoàn tất","Completed","已完成"),
   C("return","Đổi trả","Returns","退换"),
   C("search","Tra cứu","Search","查询")
  ]},
  {id:"store.sales",label:L("Bán hàng","Sell","销售"),children:[
   C("create-product","Tạo sản phẩm","Create Product","创建商品",true),
   C("price","Giá bán","Price","价格"),
   C("promo","Khuyến mãi","Promotion","促销"),
   C("media","Media sản phẩm","Product Media","商品媒体"),
   C("public-store","Public store","Public Store","公开商店",true,false,true,"publicStore")
  ]},
  {id:"store.inventory",label:L("Kho hàng","Inventory","库存"),children:[
   C("goods","Hàng hóa","Goods","货品",false,false,true,"inventoryGoods"),
   C("stock-in","Nhập kho","Stock In","入库"),
   C("stock-out","Xuất kho","Stock Out","出库"),
   C("audit","Kiểm kê","Stock Check","盘点",true),
   C("alert","Cảnh báo","Alerts","预警",true),
   C("history","Lịch sử","History","历史",false,false,true,"inventoryHistory")
  ]},
  {id:"store.shopping",label:L("Mua sắm","Shopping","购物"),directToEnd:true,endType:"shoppingAll",children:[
   C("all-products","Tất cả mặt hàng","All Products","全部商品",true,false,true,"shoppingAll"),
   C("category","Danh mục","Categories","分类"),
   C("recommend","Đề xuất","Recommended","推荐",true),
   C("combo","Combo","Combo","组合"),
   C("saved","Đã lưu","Saved","已保存"),
   C("cart","Giỏ hàng","Cart","购物车",true),
   C("checkout","Thanh toán","Checkout","结账",true)
  ]}
 ],
 me:[
  {id:"me.profile",label:L("Hồ sơ","Profile","资料"),children:[
   C("personal","Thông tin cá nhân","Personal Info","个人信息",true),
   C("avatar","Ảnh đại diện","Avatar","头像"),
   C("account","Tài khoản","Account","账户"),
   C("contact","Liên hệ","Contact","联系方式"),
   C("finance","Thu/Chi của tôi","My Income & Expense","我的收支",true,false,true,"personalFinance"),
   C("report","Báo cáo cá nhân","Personal Report","个人报告",false,false,true,"personalReport"),
   C("my-ai","AI của tôi","My AI","我的AI",true,false,true,"myAITools")
  ]},
  {id:"me.settings",label:L("Cài đặt","Settings","设置"),children:[
   C("language","Ngôn ngữ","Language","语言",true),
   C("appearance","Giao diện","Appearance","外观"),
   C("sound","Âm thanh","Sound","声音"),
   C("privacy","Quyền riêng tư","Privacy","隐私"),
   C("devices","Thiết bị","Devices","设备",true),
   C("ai-preference","AI preference","AI Preference","AI偏好")
  ]},
  {id:"me.notifications",label:L("Thông báo","Notifications","通知"),children:[
   C("system","Hệ thống","System","系统",false,false,true,"noticeSystem"),
   C("events","Sự kiện","Events","活动",false,false,true,"noticeEvents"),
   C("chat","Chat room","Chat Room","聊天室",false,false,true,"noticeChat"),
   C("store","Store","Store","商店",false,false,true,"noticeStore"),
   C("ai-jobs","AI jobs","AI Jobs","AI任务",false,false,true,"noticeAI"),
   C("security","Bảo mật","Security","安全",true,false,true,"noticeSecurity")
  ]}
 ]
} satisfies Record<string,CoreItem[]>;
export function label(x:Localized,lang:Lang){return x[lang]||x.vi}
