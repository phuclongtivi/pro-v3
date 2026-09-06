"use client";
import {useEffect,useMemo,useState} from "react";
import type {Lang,NavChild} from "@/lib/navigation";
import {label} from "@/lib/navigation";
import {useEventSpace} from "@/components/EventSpaceProvider";
type Txt={vi:string;en:string;zh:string};
type Act={id:string;label:Txt;priority?:boolean;danger?:boolean};
const A=(id:string,vi:string,en?:string,zh?:string,priority=false,danger=false):Act=>({id,label:{vi,en:en||vi,zh:zh||en||vi},priority,danger});
const tx=(x:Txt,l:Lang)=>x[l]||x.vi;
const generic=[A("open","Mở","Open","打开"),A("preview","Xem trước","Preview","预览"),A("apply","Áp dụng","Apply","应用",true),A("save","Lưu","Save","保存")];
function actions(section:string,child:string):Act[]{
 const k=section+":"+child;
 const m:Record<string,Act[]>={
  "home.events:news":[A("latest","Mới nhất","Latest","最新"),A("highlight","Nổi bật","Highlights","重点",true),A("for-me","Theo tôi","For Me","为我推荐"),A("saved","Đã lưu","Saved","已保存")],
  "home.events:video":[A("intro","Giới thiệu","Intro","介绍"),A("clips","Clip sự kiện","Event Clips","活动片段"),A("livestream","Livestream","Livestream","直播",true),A("replay","Xem lại","Replay","回放")],
  "home.events:live":[A("join","Vào sự kiện","Join Event","进入活动",true),A("quick","Xem nhanh","Quick View","快速查看"),A("qr","Check-in QR","QR Check-in","二维码签到",true),A("follow","Theo dõi","Follow","关注")],
  "home.events:upcoming":[A("today","Hôm nay","Today","今天"),A("week","Tuần này","This Week","本周"),A("remind","Nhắc lịch","Reminder","提醒",true),A("save","Lưu","Save","保存")],
  "home.myai:personal-ai":[A("open","Mở AI","Open AI","打开AI",true),A("profile","Hồ sơ AI","AI Profile","AI档案"),A("personality","Tính cách","Personality","个性"),A("role","Vai trò","Role","角色"),A("upgrade","Nâng cấp","Upgrade","升级")],
  "home.myai:tasks":[A("today","Việc hôm nay","Today","今日任务"),A("progress","Đang làm","In Progress","进行中"),A("done","Hoàn thành","Done","已完成"),A("assign","Giao việc","Assign","分配",true)],
  "home.myai:memory":[A("history","Lịch sử kết nối","Connection History","连接历史"),A("option","Tùy chọn ghi nhớ","Memory Options","记忆选项"),A("delete","Xóa ghi nhớ","Delete Memory","删除记忆",false,true),A("sync","Đồng bộ","Sync","同步")],
  "home.myai:suggestions":[A("next","Việc nên làm","Next Best Action","下一步建议",true),A("style","Gợi ý phong cách","Style Suggestion","风格建议"),A("workflow","Gợi ý workflow","Workflow","工作流建议"),A("preview","Xem trước","Preview","预览")],
  "home.connect:devices":[A("phone","Điện thoại","Phone","手机"),A("laptop","Laptop","笔记本"),A("camera","Camera","摄像机"),A("mic","Micro","麦克风"),A("capture","Capture card","采集卡")],
  "home.connect:screen":[A("tv","TV thường","TV","电视"),A("led","Màn LED sự kiện","Event LED","活动LED屏",true),A("4k","4K Output","4K输出"),A("8k","8K Output","8K输出"),A("custom","Nhập kích thước màn","Custom Screen Size","自定义屏幕尺寸")],
  "home.connect:qr":[A("scan","Quét QR","Scan QR","扫描二维码",true),A("create","Tạo QR","Create QR","创建二维码"),A("checkin","Live check-in","Live Check-in","直播签到",true),A("save","Lưu QR","Save QR","保存二维码")],
  "home.connect:apps":[A("paste","Dán link","Paste Link","粘贴链接"),A("qr","Quét QR","Scan QR","扫描二维码"),A("auto","Tìm tự động","Auto Detect","自动查找"),A("test","Kiểm tra kết nối","Test Connection","测试连接",true)],
  "home.quickcreate:event":[A("new","Sự kiện mới","New Event","新活动",true),A("template","Từ mẫu","From Template","从模板"),A("history","Từ lịch sử","From History","从历史"),A("ai","AI gợi ý","AI Suggest","AI建议",true)],
  "home.quickcreate:live":[A("personal","Live cá nhân","Personal Live","个人直播"),A("event","Live sự kiện","Event Live","活动直播",true),A("test","Live thử","Test Live","测试直播"),A("preset","Live từ preset","From Preset","从预设")],
  "home.quickcreate:chat":[A("quick","Tạo nhanh","Quick Create","快速创建",true),A("event","Theo sự kiện","By Event","按活动"),A("private","Riêng tư","Private","私人"),A("qr","Tạo QR room","Create QR Room","创建房间二维码")],
  "studio.broadcast:create-live":[A("public","Room công khai","Public Room","公开房间",true),A("private","Room riêng tư","Private Room","私人房间"),A("event","Room sự kiện","Event Room","活动房间",true),A("test","Room thử","Test Room","测试房间"),A("qr","QR room","QR Room","房间二维码",true)],
  "studio.broadcast:quick-room":[A("scan","Quét QR phòng","Scan Room QR","扫描房间码",true),A("recent","Phòng gần đây","Recent Rooms","最近房间"),A("code","Nhập mã phòng","Enter Room Code","输入房间码"),A("join","Vào ngay","Join Now","立即进入",true)],
  "studio.broadcast:preview":[A("camera1","Camera 1","Camera 1","相机1"),A("camera2","Camera 2","相机2"),A("layout","Layout","Layout","布局"),A("test","Test audio-video","Test AV","测试音视频"),A("full","Preview full","Full Preview","全屏预览")],
  "studio.broadcast:video-output":[A("tv","TV / Màn thường","TV / Screen","电视/屏幕"),A("led","LED Event Screen","LED Event Screen","活动LED屏",true),A("4k","4K Output","4K输出"),A("8k","8K Output","8K输出"),A("pxp","PXP / Multi-view","多画面"),A("auto-fit","AI Auto Fit","AI Auto Fit","AI自动适配",true)],
  "studio.broadcast:flash-flow":[A("intro","Intro","Intro","片头"),A("transition","Chuyển cảnh","Transition","转场"),A("idle","Idle video","Idle Video","待机视频"),A("run","Chạy Flow","Run Flow","运行Flow",true)],
  "studio.broadcast:render-record":[A("record","Record","Record","录制",true),A("clip","Clip ngắn","Short Clip","短片"),A("replay","Replay","Replay","回放"),A("render","Render","Render","渲染")],
  "studio.broadcast:export-video":[A("device","Xuất về máy","Download to Device","下载到设备"),A("cloud","Xuất cloud","Export Cloud","导出云端"),A("short","Xuất clip ngắn","Export Short Clip","导出短片"),A("replay","Xuất replay","Export Replay","导出回放")],
  "studio.mixer:inputs":[A("mic","Mic 1–8","Mic 1–8","麦克风1-8"),A("music","Nhạc nền","Background Music","背景音乐"),A("usb","Audio USB","USB Audio","USB音频"),A("bluetooth","Bluetooth","Bluetooth","蓝牙"),A("camera-audio","Camera audio","Camera Audio","相机音频"),A("external","External apps","External Apps","外部应用")],
  "studio.mixer:audio":[A("gain","Gain / Trim","Gain / Trim","增益/微调"),A("eq","EQ","EQ","均衡",true),A("fx","FX1 / FX2","FX1 / FX2","效果1/2"),A("aux","AUX send","AUX Send","AUX发送"),A("pan","Pan","Pan","声像"),A("mute-solo","Mute / Solo","Mute / Solo","静音/独奏"),A("main","Main L/R","Main L/R","主左右",true)],
  "studio.mixer:lighting":[A("brightness","Độ sáng tổng","Master Brightness","总亮度"),A("temperature","Nhiệt màu","Color Temperature","色温"),A("stage","Ánh sáng sân khấu","Stage Light","舞台灯光",true),A("sync","Đồng bộ cảnh","Scene Sync","场景同步")],
  "studio.mixer:effects":[A("visual","Hiệu ứng hình","Visual FX","视觉效果"),A("audio","Hiệu ứng âm","Audio FX","音频效果"),A("overlay","Overlay","Overlay","叠加"),A("transition","Transition","Transition","转场")],
  "studio.mixer:outputs":[A("main","Main out","Main Out","主输出",true),A("monitor","Monitor out","Monitor Out","监听输出"),A("stream","Stream out","Stream Out","直播输出"),A("record","Record out","Record Out","录制输出"),A("hall","Event hall out","Event Hall Out","会场输出"),A("tv-led","TV / LED out","TV / LED Out","电视/LED输出",true)],
  "studio.mixer:preset":[A("voice","Voice","Voice","人声",true),A("music","Music","Music","音乐"),A("event","Event","Event","活动",true),A("safe","Safe","Safe","安全",true),A("custom","Custom","Custom","自定义")],
  "studio.chat:join":[A("qr","Quét QR room","Scan Room QR","扫描房间码",true),A("code","Nhập mã","Enter Code","输入代码"),A("recent","Phòng gần đây","Recent Room","最近房间"),A("join","Vào phòng","Join Room","进入房间",true)],
  "studio.chat:messages":[A("send","Gửi trong room","Send in Room","房间内发送"),A("pin","Ghim tin","Pin","置顶"),A("hide","Ẩn tin","Hide","隐藏"),A("delete","Xóa tin","Delete","删除",false,true),A("spam","Lọc spam","Spam Filter","垃圾过滤")],
  "studio.chat:members":[A("list","Danh sách","List","列表"),A("invite","Mời thêm","Invite","邀请",true),A("block","Chặn","Block","屏蔽",false,true),A("role","Giao quyền","Assign Role","分配权限")],
  "studio.chat:leave":[A("leave","Rời phòng","Leave Room","离开房间",false,true),A("end-chat","Kết thúc chat","End Chat","结束聊天",false,true),A("save-log","Lưu lịch sử nếu có quyền","Save Log If Allowed","有权限则保存记录")],
  "store.orders:pending":[A("today","Hôm nay","Today","今天"),A("customer","Theo khách","By Customer","按客户"),A("event","Theo sự kiện","By Event","按活动"),A("confirm","Xác nhận","Confirm","确认",true),A("update","Cập nhật trạng thái","Update Status","更新状态",true)],
  "store.sales:create-product":[A("new","Mới","New","新建",true),A("template","Từ mẫu","From Template","从模板"),A("ai","AI gợi ý","AI Suggest","AI建议",true),A("stock","Từ kho","From Inventory","从库存")],
  "store.inventory:audit":[A("sku","Theo SKU","By SKU","按SKU"),A("category","Theo loại","By Category","按类别"),A("low","Theo mức tồn","By Stock Level","按库存"),A("event","Theo sự kiện","By Event","按活动"),A("export","Xuất báo cáo","Export Report","导出报告",true)],
  "store.shopping:checkout":[A("cart","Giỏ hàng","Cart","购物车"),A("payment","Thanh toán","Payment","付款",true),A("address","Địa chỉ","Address","地址"),A("confirm","Xác nhận","Confirm","确认",true)],
  "me.profile:personal":[A("view","Xem","View","查看"),A("edit","Sửa","Edit","编辑"),A("security","Bảo mật","Security","安全",true),A("sync","Đồng bộ","Sync","同步")],
  "me.profile:finance":[A("overview","Tổng quan","Overview","总览"),A("transactions","Giao dịch","Transactions","交易"),A("category","Phân loại","Categories","分类"),A("export","Xuất báo cáo","Export Report","导出报告",true)],
  "me.settings:language":[A("vi","Tiếng Việt","Vietnamese","越南语",true),A("en","English","English","英语"),A("zh","中文","Chinese","中文")],
  "me.settings:appearance":[A("mobile","Mobile","Mobile","移动端"),A("web","Web","Web","网页"),A("tv","TV","TV","电视"),A("font","Cỡ chữ","Font Size","字体大小"),A("density","Mật độ hiển thị","Display Density","显示密度")],
  "me.notifications:security":[A("new","Mới","New","新",true),A("read","Đã đọc","Read","已读"),A("priority","Ưu tiên","Priority","优先",true),A("resolve","Xử lý","Resolve","处理",true)]
 };
 return m[k] || generic;
}
function results(section:string,child:string,action:string):Act[]{
 const k=section+":"+child+":"+action;
 const m:Record<string,Act[]>={
  "studio.broadcast:video-output:led":[A("6x3","LED 6 × 3 m","LED 6 × 3 m","LED 6×3米"),A("12x6","LED 12 × 6 m","LED 12 × 6 m","LED 12×6米"),A("20x10","LED 20 × 10 m","LED 20 × 10 m","LED 20×10米"),A("500","Sự kiện ~500 m²","Event ~500 m²","约500平方米活动",true),A("custom","Kích thước khác","Custom Size","自定义尺寸"),A("auto-fit","AUTO FIT","AUTO FIT","自动适配",true),A("ai-map","AI AUTO MAP","AI AUTO MAP","AI自动映射",true),A("test","TEST PATTERN","TEST PATTERN","测试图"),A("validate","VALIDATE","VALIDATE","验证"),A("arm","ARM","ARM","预备",true),A("take-live","TAKE LIVE","TAKE LIVE","切入直播",true,true)],
  "studio.broadcast:video-output:auto-fit":[A("fit","AUTO FIT","AUTO FIT","自动适配",true),A("ai-map","AI AUTO MAP","AI AUTO MAP","AI自动映射",true),A("preview","Preview Output","Preview Output","预览输出"),A("validate","Validate","Validate","验证"),A("save","Lưu preset","Save Preset","保存预设")],
  "studio.broadcast:create-live:event":[A("template","Mẫu sự kiện","Event Template","活动模板"),A("qr","Tạo QR room","Create QR Room","创建房间二维码",true),A("preview","Xem trước","Preview","预览"),A("create","Tạo ngay","Create Now","立即创建",true)],
  "studio.broadcast:quick-room:join":[A("scan","Quét QR","Scan QR","扫描二维码",true),A("recent","Phòng gần đây","Recent Room","最近房间"),A("code","Nhập mã","Enter Code","输入代码"),A("join","Vào ngay","Join Now","立即进入",true)],
  "studio.mixer:preset:voice":[A("soft","Voice Soft","Voice Soft","柔和人声"),A("clear","Voice Clear","Voice Clear","清晰人声",true),A("event","Voice Event","Voice Event","活动人声"),A("apply","Áp dụng","Apply","应用",true)],
  "studio.mixer:preset:event":[A("speech","Sự kiện nói","Speech Event","演讲活动"),A("music","Sự kiện nhạc","Music Event","音乐活动"),A("safe","Safe Event","Safe Event","安全活动",true),A("apply","Áp dụng","Apply","应用",true)],
  "studio.chat:join:join":[A("current","Room hiện tại","Current Room","当前房间"),A("qr","QR room","QR Room","房间二维码",true),A("ready","Đã vào phòng","Joined","已进入",true)],
  "studio.chat:leave:end-chat":[A("confirm","Xác nhận rời","Confirm Leave","确认离开",false,true),A("note","User out → không còn chat","User leaves → chat ends","用户离开→聊天结束"),A("save","Lưu lịch sử nếu có quyền","Save log if allowed","有权限则保存记录")]
 };
 return m[k] || [A("recommended","Khuyến nghị","Recommended","推荐",true),A("preview","Xem trước","Preview","预览"),A("apply","Áp dụng","Apply","应用",true),A("save","Lưu","Save","保存")];
}
export default function Nav3Navigator({section,items,activeId,onSelect,lang}:{section:string;items:NavChild[];activeId:string;onSelect:(id:string)=>void;lang:Lang}){
 const active=items.find(x=>x.id===activeId)||items[0];
 const [action,setAction]=useState<Act|null>(null);
 const [result,setResult]=useState<Act|null>(null);
 const {record}=useEventSpace();
 useEffect(()=>{setAction(null);setResult(null)},[activeId,section]);
 const childActs=useMemo(()=>actions(section,active.id),[section,active.id]);
 const endActs=useMemo(()=>action?results(section,active.id,action.id):[],[section,active.id,action]);
 function choose3(id:string){onSelect(id);setAction(null);setResult(null)}
 function choose4(a:Act){setAction(a);setResult(null);record({area:section,action:`${active.id}:${a.id}`,result:"tree4",costClass:"local",ok:true})}
 function choose5(a:Act){setResult(a);record({area:section,action:`${active.id}:${action?.id}:${a.id}`,result:"tree5-end",costClass:a.id.includes("ai")?"cloud-low":"local",ok:true})}
 if(action)return <section className="navGroupC"><div className="navHeader"><button onClick={()=>setAction(null)}>← Cây 3 + 4</button><div><b>{label(active.label,lang)} / {tx(action.label,lang)}</b><span>Cây 5 / END</span></div></div><div className="resultKeys">{endActs.map(x=><button key={x.id} className={(x.priority?"priority ":"")+(x.danger?"danger ":"")+(result?.id===x.id?"selected":"")} onClick={()=>choose5(x)}><b>{tx(x.label,lang)}</b></button>)}</div><div className="endResult"><b>{result?tx(result.label,lang):"END"}</b><span>{result?"Đã chọn kết quả. User có thể tiếp tục vòng lặp hoặc quay lại cây 3 + 4.":"Chọn một kết quả/preset ở trên. App chỉ yêu cầu nhập tay khi không có preset hoặc thông tin bắt buộc."}</span></div></section>;
 return <section className="navGroupB"><div className="navColumn"><div className="columnTitle"><span>03</span><b>{lang==="vi"?"Nút mẹ":lang==="zh"?"父级按钮":"Parent keys"}</b></div><div className="keyboardList">{items.map(x=><button key={x.id} className={(x.id===active.id?"selected ":"")+(x.priority?"priority ":"")+(x.danger?"danger":"")} onClick={()=>choose3(x.id)}><b>{label(x.label,lang)}</b></button>)}</div></div><div className="navColumn child"><div className="columnTitle"><span>04</span><b>{lang==="vi"?"Nút con":lang==="zh"?"子级按钮":"Child keys"}</b></div><div className="keyboardList">{childActs.map(x=><button key={x.id} className={(x.priority?"priority ":"")+(x.danger?"danger":"")} onClick={()=>choose4(x)}><b>{tx(x.label,lang)}</b></button>)}</div></div></section>
}
