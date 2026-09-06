"use client";
import {useEffect,useMemo,useState} from "react";
import type {Lang,NavChild} from "@/lib/navigation";
import {label} from "@/lib/navigation";
import {useEventSpace} from "@/components/EventSpaceProvider";

type Txt={vi:string;en:string;zh:string};
type Act={id:string;label:Txt;priority?:boolean;danger?:boolean;kind?:"info"|"action"|"product"|"notice"|"preset"};
const T=(vi:string,en:string,zh:string):Txt=>({vi,en,zh});
type Kind="info"|"action"|"product"|"notice"|"preset";
const A=(id:string,vi:string,en?:string,zh?:string,priority=false,danger:boolean|Kind=false,kind:Kind="action"):Act=>{const isKind=typeof danger==="string";return {id,label:{vi,en:en||vi,zh:zh||en||vi},priority,danger:isKind?false:danger,kind:isKind?danger:kind};};
const tx=(x:Txt,l:Lang)=>x[l]||x.vi;

const genericActions=[A("open","Mở","Open","打开"),A("preview","Xem trước","Preview","预览"),A("apply","Áp dụng","Apply","应用",true),A("save","Lưu","Save","保存")];

function actions(section:string,child:string):Act[]{
 const k=section+":"+child;
 const m:Record<string,Act[]>={
  "home.connect:devices":[A("phone","Điện thoại","Phone","手机"),A("laptop","Laptop","Laptop","笔记本"),A("camera","Camera","Camera","摄像机"),A("mic","Micro","Microphone","麦克风"),A("capture","Capture card","Capture Card","采集卡")],
  "home.connect:screen":[A("tv","TV thường","TV","电视"),A("led","Màn LED sự kiện","Event LED","活动LED屏",true),A("4k","4K Output","4K Output","4K输出"),A("8k","8K Output","8K Output","8K输出"),A("custom","Nhập kích thước màn","Custom Screen Size","自定义屏幕尺寸")],
  "home.connect:qr":[A("scan","Quét QR","Scan QR","扫描二维码",true),A("create","Tạo QR","Create QR","创建二维码"),A("checkin","Live check-in","Live Check-in","直播签到",true),A("save","Lưu QR","Save QR","保存二维码")],
  "home.connect:apps":[A("paste","Dán link","Paste Link","粘贴链接"),A("qr","Quét QR","Scan QR","扫描二维码"),A("auto","Tìm tự động","Auto Detect","自动查找"),A("test","Kiểm tra kết nối","Test Connection","测试连接",true)],
  "home.quickcreate:event":[A("new","Sự kiện mới","New Event","新活动",true),A("template","Từ mẫu","From Template","从模板"),A("history","Từ lịch sử","From History","从历史"),A("ai","AI gợi ý","AI Suggest","AI建议",true)],
  "home.quickcreate:live":[A("personal","Live cá nhân","Personal Live","个人直播"),A("event","Live sự kiện","Event Live","活动直播",true),A("test","Live thử","Test Live","测试直播"),A("preset","Live từ preset","From Preset","从预设")],
  "home.quickcreate:chat":[A("quick","Tạo nhanh","Quick Create","快速创建",true),A("event","Theo sự kiện","By Event","按活动"),A("private","Riêng tư","Private","私人"),A("qr","Tạo QR room","Create QR Room","创建房间二维码")],
  "studio.broadcast:preview":[A("camera1","Camera 1","Camera 1","相机1"),A("camera2","Camera 2","Camera 2","相机2"),A("layout","Layout","Layout","布局"),A("test","Test audio-video","Test AV","测试音视频"),A("full","Preview full","Full Preview","全屏预览")],
  "studio.broadcast:video-output":[A("tv","TV / Màn thường","TV / Screen","电视/屏幕"),A("led","LED Event Screen","LED Event Screen","活动LED屏",true),A("4k","4K Output","4K Output","4K输出"),A("8k","8K Output","8K Output","8K输出"),A("pxp","PXP / Multi-view","PXP / Multi-view","多画面"),A("auto-fit","AI Auto Fit","AI Auto Fit","AI自动适配",true)],
  "studio.broadcast:flash-flow":[A("intro","Intro","Intro","片头"),A("transition","Chuyển cảnh","Transition","转场"),A("idle","Idle video","Idle Video","待机视频"),A("run","Chạy Flow","Run Flow","运行Flow",true)],
  "studio.broadcast:render-record":[A("record","Record","Record","录制",true),A("clip","Clip ngắn","Short Clip","短片"),A("replay","Replay","Replay","回放"),A("render","Render","Render","渲染")],
  "studio.broadcast:export-video":[A("device","Xuất về máy","Download to Device","下载到设备"),A("cloud","Xuất cloud","Export Cloud","导出云端"),A("short","Xuất clip ngắn","Export Short Clip","导出短片"),A("replay","Xuất replay","Export Replay","导出回放")],
  "studio.mixer:inputs":[A("mic","Mic 1–8","Mic 1–8","麦克风1-8"),A("music","Nhạc nền","Background Music","背景音乐"),A("usb","Audio USB","USB Audio","USB音频"),A("bluetooth","Bluetooth","Bluetooth","蓝牙"),A("camera-audio","Camera audio","Camera Audio","相机音频"),A("external","External apps","External Apps","外部应用")],
  "studio.mixer:audio":[A("gain","Gain / Trim","Gain / Trim","增益/微调"),A("eq","EQ","EQ","均衡",true),A("fx","FX1 / FX2","FX1 / FX2","效果1/2"),A("aux","AUX send","AUX Send","AUX发送"),A("pan","Pan","Pan","声像"),A("mute-solo","Mute / Solo","Mute / Solo","静音/独奏"),A("main","Main L/R","Main L/R","主左右",true)],
  "studio.mixer:lighting":[A("brightness","Độ sáng tổng","Master Brightness","总亮度"),A("temperature","Nhiệt màu","Color Temperature","色温"),A("stage","Ánh sáng sân khấu","Stage Light","舞台灯光",true),A("sync","Đồng bộ cảnh","Scene Sync","场景同步")],
  "studio.mixer:effects":[A("visual","Hiệu ứng hình","Visual FX","视觉效果"),A("audio","Hiệu ứng âm","Audio FX","音频效果"),A("overlay","Overlay","Overlay","叠加"),A("transition","Transition","Transition","转场")],
  "studio.mixer:outputs":[A("main","Main out","Main Out","主输出",true),A("monitor","Monitor out","Monitor Out","监听输出"),A("stream","Stream out","Stream Out","直播输出"),A("record","Record out","Record Out","录制输出"),A("hall","Event hall out","Event Hall Out","会场输出"),A("tv-led","TV / LED out","TV / LED Out","电视/LED输出",true)],
  "studio.mixer:preset":[A("voice","Voice","Voice","人声",true),A("music","Music","Music","音乐"),A("event","Event","Event","活动",true),A("safe","Safe","Safe","安全",true),A("custom","Custom","Custom","自定义")],
  "studio.chat:messages":[A("send","Gửi trong room","Send in Room","房间内发送"),A("pin","Ghim tin","Pin","置顶"),A("hide","Ẩn tin","Hide","隐藏"),A("delete","Xóa tin","Delete","删除",false,true),A("spam","Lọc spam","Spam Filter","垃圾过滤")],
  "studio.chat:members":[A("list","Danh sách","List","列表"),A("invite","Mời thêm","Invite","邀请",true),A("block","Chặn","Block","屏蔽",false,true),A("role","Giao quyền","Assign Role","分配权限")],
  "studio.chat:leave":[A("leave","Rời phòng","Leave Room","离开房间",false,true),A("end-chat","Kết thúc chat","End Chat","结束聊天",false,true),A("save-log","Lưu lịch sử nếu có quyền","Save Log If Allowed","有权限则保存记录")],
  "store.orders:pending":[A("today","Hôm nay","Today","今天"),A("customer","Theo khách","By Customer","按客户"),A("event","Theo sự kiện","By Event","按活动"),A("confirm","Xác nhận","Confirm","确认",true),A("update","Cập nhật trạng thái","Update Status","更新状态",true)],
  "store.sales:create-product":[A("new","Mới","New","新建",true),A("template","Từ mẫu","From Template","从模板"),A("ai","AI gợi ý","AI Suggest","AI建议",true),A("stock","Từ kho","From Inventory","从库存")],
  "store.inventory:audit":[A("sku","Theo SKU","By SKU","按SKU"),A("category","Theo loại","By Category","按类别"),A("low","Theo mức tồn","By Stock Level","按库存"),A("event","Theo sự kiện","By Event","按活动"),A("export","Xuất báo cáo","Export Report","导出报告",true)],
  "store.shopping:category":[A("event","Theo sự kiện","By Event","按活动"),A("type","Theo loại","By Type","按类型"),A("price","Theo giá","By Price","按价格"),A("promo","Khuyến mại","Promotion","促销",true)],
  "store.shopping:checkout":[A("cart","Giỏ hàng","Cart","购物车"),A("payment","Thanh toán","Payment","付款",true),A("address","Địa chỉ","Address","地址"),A("confirm","Xác nhận","Confirm","确认",true)],
  "me.profile:personal":[A("view","Xem","View","查看"),A("edit","Sửa","Edit","编辑"),A("security","Bảo mật","Security","安全",true),A("sync","Đồng bộ","Sync","同步")],
  "me.settings:language":[A("vi","Tiếng Việt","Vietnamese","越南语",true),A("en","English","English","英语"),A("zh","中文","Chinese","中文")],
  "me.settings:appearance":[A("mobile","Mobile","Mobile","移动端"),A("web","Web","Web","网页"),A("tv","TV","TV","电视"),A("font","Cỡ chữ","Font Size","字体大小"),A("density","Mật độ hiển thị","Display Density","显示密度")]
 };
 return m[k] || genericActions;
}

function endContent(type:string,section:string,child:string,action?:string):{title:Txt;items:Act[];note?:Txt}{
 const m:Record<string,{title:Txt;items:Act[];note?:Txt}>={
  eventGift:{title:T("Có Quà Tặng","Gift Available","有礼物"),items:[A("n1","Thông báo 1","Notice 1","通知1",true,false,"notice"),A("n2","Thông báo 2","Notice 2","通知2",false,false,"notice"),A("n3","Thông báo 3","Notice 3","通知3",false,false,"notice"),A("check","Check / Watch / Read","Check / Watch / Read","检查/观看/阅读",true),A("confirm","Confirm / Read / Add","Confirm / Read / Add","确认/阅读/添加",true)]},
  eventNoTicket:{title:T("Không Vé","No Ticket","无票"),items:[A("n1","Thông báo 1","Notice 1","通知1",true,false,"notice"),A("n2","Thông báo 2","Notice 2","通知2",false,false,"notice"),A("n3","Thông báo 3","Notice 3","通知3",false,false,"notice"),A("check","Check / Watch / Read","Check / Watch / Read","检查/观看/阅读",true),A("add","Confirm / Read / Add","Confirm / Read / Add","确认/阅读/添加")]},
  eventTicket:{title:T("Có Vé","Ticket Available","有票"),items:[A("n1","Thông báo 1","Notice 1","通知1",true,false,"notice"),A("n2","Thông báo 2","Notice 2","通知2",false,false,"notice"),A("n3","Thông báo 3","Notice 3","通知3",false,false,"notice"),A("watch","Check / Watch / Read","Check / Watch / Read","检查/观看/阅读",true),A("confirm","Confirm / Read / Add","Confirm / Read / Add","确认/阅读/添加",true)]},
  myEvents:{title:T("Sự kiện của tôi","My Events","我的活动"),items:[A("create-notice","Tạo thông báo","Create Notice","创建通知",true),A("manage-gift","Quản lý quà tặng","Manage Gifts","管理礼物"),A("init-gift","Khởi tạo quà tặng","Create Gift","创建礼物",true),A("read","Confirm / Read","Confirm / Read","确认/阅读")]},
  aiFlash:{title:T("AI Flash","AI Flash","AI闪流"),items:[A("sales","AI Bán Hàng","AI Sales","AI销售",true),A("bill","AI Soát Bill","AI Bill Check","AI账单检查"),A("ticket","AI Soát Vé","AI Ticket Check","AI验票"),A("oneclick","ONE CLICK AI ↔ APP","ONE CLICK AI ↔ APP","一键AI↔应用",true)]},
  myAITools:{title:T("AI của tôi","My AI","我的AI"),items:[A("open","Mở AI của tôi","Open My AI","打开我的AI",true),A("assign","Giao việc","Assign Task","分配任务",true),A("memory","Bộ nhớ","Memory","记忆"),A("role","Vai trò","Role","角色")]},
  studioAI:{title:T("AI Phòng Thu","Studio AI","录制室AI"),items:[A("camera","AI Camera","AI Camera","AI相机"),A("audio","AI Âm Thanh","AI Audio","AI音频",true),A("lighting","AI Ánh sáng","AI Lighting","AI灯光"),A("scene","AI Cảnh quay","AI Scene","AI场景")]},
  aiFinance:{title:T("Quản lý AI và Thu-Chi","AI & Finance Manager","AI与收支管理"),items:[A("ai","Quản lý AI","AI Manager","AI管理",true),A("finance","Thu - Chi","Income & Expense","收支",true),A("report","Báo cáo","Report","报告"),A("confirm","Confirm / Read / Add","Confirm / Read / Add","确认/阅读/添加")]},
  shoppingAll:{title:T("Tất cả mặt hàng","All Products","全部商品"),items:[A("p1","Sản phẩm 1","Product 1","商品1",true,false,"product"),A("p2","Sản phẩm 2","Product 2","商品2",false,false,"product"),A("p3","Sản phẩm 3","Product 3","商品3",false,false,"product"),A("category","Lọc danh mục","Filter Category","分类筛选"),A("price","Lọc giá","Price Filter","价格筛选"),A("cart","Giỏ hàng","Cart","购物车",true),A("checkout","Thanh toán","Checkout","结账",true)],note:T("Hiển thị tất cả mặt hàng trước, bộ lọc dùng sau khi user đã thấy nội dung.","Show all products first; filters are used after the content appears.","先显示全部商品，用户看到内容后再筛选。")},
  createLive:{title:T("Tạo room live","Create Live Room","创建直播间"),items:[A("public","Room công khai","Public Room","公开房间",true),A("private","Room riêng tư","Private Room","私人房间"),A("event","Room sự kiện","Event Room","活动房间",true),A("test","Room thử","Test Room","测试房间"),A("qr","QR room","QR Room","房间二维码",true),A("create","Tạo ngay","Create Now","立即创建",true)]},
  quickRoom:{title:T("Vào phòng nhanh","Quick Room","快速进房"),items:[A("scan","Quét QR phòng","Scan Room QR","扫描房间码",true),A("recent","Phòng gần đây","Recent Rooms","最近房间"),A("code","Nhập mã phòng","Enter Room Code","输入房间码"),A("join","Vào ngay","Join Now","立即进入",true)]},
  chatJoin:{title:T("Vào phòng chat","Join Chat Room","进入聊天室"),items:[A("qr","Quét QR room","Scan Room QR","扫描房间码",true),A("code","Nhập mã","Enter Code","输入代码"),A("recent","Phòng gần đây","Recent Room","最近房间"),A("join","Vào phòng","Join Room","进入房间",true)],note:T("Chat gắn với room. User rời room thì không còn chat.","Chat belongs to the room. When the user leaves, chat ends.","聊天绑定房间，用户离开后聊天结束。")},
  personalFinance:{title:T("Thu/Chi của tôi","My Income & Expense","我的收支"),items:[A("overview","Tổng quan","Overview","总览",true),A("transactions","Giao dịch","Transactions","交易"),A("category","Phân loại","Categories","分类"),A("export","Xuất báo cáo","Export Report","导出报告",true)]},
  personalReport:{title:T("Báo cáo cá nhân","Personal Report","个人报告"),items:[A("today","Hôm nay","Today","今天"),A("month","Tháng này","This Month","本月"),A("ai","AI tóm tắt","AI Summary","AI总结",true),A("export","Xuất báo cáo","Export Report","导出报告")]},
  noticeSystem:{title:T("Thông báo hệ thống","System Notifications","系统通知"),items:[A("new","Mới","New","新",true),A("read","Đã đọc","Read","已读"),A("priority","Ưu tiên","Priority","优先",true),A("history","Lịch sử","History","历史")]},
  noticeSecurity:{title:T("Bảo mật","Security","安全"),items:[A("new","Mới","New","新",true),A("priority","Ưu tiên","Priority","优先",true),A("resolve","Xử lý","Resolve","处理",true),A("history","Lịch sử","History","历史")]}
 };
 if(section==="studio.broadcast"&&child==="video-output"&&action==="led")return {title:T("LED Event Screen","LED Event Screen","活动LED屏"),items:[A("6x3","LED 6 × 3 m","LED 6 × 3 m","LED 6×3米"),A("12x6","LED 12 × 6 m","LED 12 × 6 m","LED 12×6米"),A("20x10","LED 20 × 10 m","LED 20 × 10 m","LED 20×10米"),A("500","Sự kiện ~500 m²","Event ~500 m²","约500平方米活动",true),A("custom","Kích thước khác","Custom Size","自定义尺寸"),A("auto-fit","AUTO FIT","AUTO FIT","自动适配",true),A("ai-map","AI AUTO MAP","AI AUTO MAP","AI自动映射",true),A("test","TEST PATTERN","TEST PATTERN","测试图"),A("validate","VALIDATE","VALIDATE","验证"),A("arm","ARM","ARM","预备",true),A("take-live","TAKE LIVE","TAKE LIVE","切入直播",true,true)]};
 if(section==="studio.mixer"&&child==="preset")return {title:T("Preset Bàn Mix","Mixer Preset","调音台预设"),items:[A("voice","Voice Clear","Voice Clear","清晰人声",true),A("music","Music","Music","音乐"),A("event","Event","Event","活动",true),A("safe","Safe","Safe","安全",true),A("apply","Áp dụng","Apply","应用",true),A("save","Lưu preset","Save Preset","保存预设")]};
 return m[type] || {title:T("Nội dung","Content","内容"),items:[A("view","Xem","View","查看",true),A("edit","Chỉnh sửa","Edit","编辑"),A("save","Lưu","Save","保存",true),A("confirm","Xác nhận","Confirm","确认",true)]};
}

function endTypeFor(section:string,child:NavChild,action?:Act|null){
 if(child.endType)return child.endType;
 if(section==="store.shopping")return "shoppingAll";
 if(section==="studio.broadcast"&&child.id==="video-output"&&action?.id==="led")return "outputLed";
 return "default";
}

export default function Nav3Navigator({section,items,activeId,onSelect,lang,groupDirect=false,groupEndType=""}:{section:string;items:NavChild[];activeId:string;onSelect:(id:string)=>void;lang:Lang;groupDirect?:boolean;groupEndType?:string}){
 const active=items.find(x=>x.id===activeId)||items[0];
 const [action,setAction]=useState<Act|null>(null);
 const [selected,setSelected]=useState<Act|null>(null);
 const {record}=useEventSpace();
 useEffect(()=>{setAction(null);setSelected(null)},[activeId,section]);
 const direct=groupDirect || !!active.directToEnd;
 const childActs=useMemo(()=>actions(section,active.id),[section,active.id]);
 const content=useMemo(()=>endContent(groupEndType||endTypeFor(section,active,action),section,active.id,action?.id),[groupEndType,section,active,action]);
 function choose3(id:string){onSelect(id);setAction(null);setSelected(null)}
 function choose4(a:Act){setAction(a);setSelected(null);record({area:section,action:`${active.id}:${a.id}`,result:"end",costClass:"local",ok:true})}
 function chooseEnd(a:Act){setSelected(a);record({area:section,action:`${active.id}:${action?.id||"direct"}:${a.id}`,result:"end-choice",costClass:a.id.includes("ai")?"cloud-low":"local",ok:true})}
 if(direct||action){
  return <section className="navGroupC contentSurface">
   <div className="contentHead"><button type="button" onClick={()=>{setAction(null); if(!direct){setSelected(null)}}}>← Quay lại</button><h2>{tx(content.title,lang)}</h2></div>
   {content.note&&<p className="contentNote">{tx(content.note,lang)}</p>}
   <div className="contentGrid">{content.items.map(x=><button key={x.id} className={(x.priority?"priority ":"")+(x.danger?"danger ":"")+(selected?.id===x.id?"selected ":"")+`kind-${x.kind||"action"}`} onClick={()=>chooseEnd(x)}><b>{tx(x.label,lang)}</b></button>)}</div>
   {selected&&<div className="contentResult"><b>{tx(selected.label,lang)}</b><span>{lang==="zh"?"已选择。请选择确认、保存或继续操作。":lang==="en"?"Selected. Choose confirm, save, or continue.":"Đã chọn. Tiếp tục xác nhận, lưu hoặc thao tác tiếp."}</span></div>}
  </section>
 }
 return <section className="navGroupB">
  <div className="navColumn">
   <div className="keyboardList">{items.map(x=><button key={x.id} className={(x.id===active.id?"selected ":"")+(x.priority?"priority ":"")+(x.danger?"danger":"")} onClick={()=>choose3(x.id)}><b>{label(x.label,lang)}</b></button>)}</div>
  </div>
  <div className="navColumn child">
   <div className="keyboardList">{childActs.map(x=><button key={x.id} className={(x.priority?"priority ":"")+(x.danger?"danger":"")} onClick={()=>choose4(x)}><b>{tx(x.label,lang)}</b></button>)}</div>
  </div>
 </section>
}
