"use client";

import {useEffect,useState} from "react";
import ThemePicker from "@/components/ThemePicker";
import type {Lang} from "@/lib/navigation";

type Props={lang:Lang;onBack:()=>void};
type StickerItem={id?:string;name:string;emoji?:string};
const tr=(lang:Lang,vi:string,en:string,zh:string)=>lang==="en"?en:lang==="zh"?zh:vi;
const Crumbs=({onBack,title}:{onBack:()=>void;title:string})=><div className="workspaceCrumbs"><button data-action-id="pro.content.back" type="button" className="backKey" onClick={onBack}>← Back</button><span className="crumbKey selected">{title}</span></div>;

export function AppearanceCenter({lang,onBack}:Props){
 const[viewport,setViewport]=useState("auto");
 return <section className="navWorkspace contentSurface" data-runtime-area="me.appearance"><Crumbs onBack={onBack} title={tr(lang,"Giao diện","Appearance","外观")}/><div className="completionPanel"><h3>{tr(lang,"Theme & hiển thị","Theme & display","主题与显示")}</h3><ThemePicker/><div className="completionGrid">{[["auto","Tự động"],["mobile","Mobile"],["desktop","Web · 1920×1080"],["tv","TV · Safe area"]].map(([id,name])=><button data-action-id={`pro.appearance.viewport.${id}`} key={id} type="button" className={viewport===id?"priority":""} onClick={()=>setViewport(id)}>{name}</button>)}</div><div className="endStatus"><b>✓</b><span>{tr(lang,"Thiết lập hiển thị được lưu trên thiết bị.","Display settings are saved on this device.","显示设置保存在此设备上。")}</span></div></div></section>
}

export function SoundCenter({lang,onBack}:Props){
 const[status,setStatus]=useState("");
 async function requestMic(){try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});stream.getTracks().forEach(track=>track.stop());setStatus(tr(lang,"Đã xác minh quyền micro.","Microphone permission verified.","麦克风权限已验证。"))}catch{setStatus(tr(lang,"Không có quyền micro hoặc thiết bị không hỗ trợ.","Microphone permission denied or unsupported.","麦克风权限被拒绝或不受支持。"))}}
 return <section className="navWorkspace contentSurface" data-runtime-area="me.sound"><Crumbs onBack={onBack} title={tr(lang,"Âm thanh","Sound","声音")}/><div className="completionPanel"><p className="muted">{tr(lang,"Nhạc nền sản xuất được quản lý như một input của Bàn Mix; màn này quản lý quyền và thiết bị mặc định.","Production music is a Mixer input; this screen manages permissions and defaults.","制作音乐作为调音台输入；此页管理权限和默认设备。")}</p><button data-action-id="pro.sound.microphone.permission" type="button" className="endCommit" onClick={requestMic}>{tr(lang,"Kiểm tra quyền Micro","Check microphone permission","检查麦克风权限")}</button>{status&&<div className="notice">{status}</div>}</div></section>
}

export function PrivacyCenter({lang,onBack}:Props){
 const[localFirst,setLocalFirst]=useState(false);const[message,setMessage]=useState("");
 useEffect(()=>{try{setLocalFirst(localStorage.getItem("long-privacy-local-first")==="1")}catch{}},[]);
 function save(){try{localStorage.setItem("long-privacy-local-first",localFirst?"1":"0");setMessage(tr(lang,"Đã lưu trên thiết bị.","Saved on device.","已保存在设备上。"))}catch{setMessage(tr(lang,"Không thể lưu.","Could not save.","无法保存。"))}}
 return <section className="navWorkspace contentSurface" data-runtime-area="me.privacy"><Crumbs onBack={onBack} title={tr(lang,"Quyền riêng tư","Privacy","隐私")}/><div className="completionPanel"><button data-action-id="pro.privacy.local-first.toggle" type="button" onClick={()=>setLocalFirst(value=>!value)} className={localFirst?"priority":""}>{tr(lang,"Ưu tiên xử lý local","Prefer local processing","优先本地处理")}: {localFirst?"ON":"OFF"}</button><button data-action-id="pro.privacy.save" type="button" className="endCommit" onClick={save}>{tr(lang,"Lưu quyền riêng tư","Save privacy","保存隐私设置")}</button>{message&&<div className="notice">{message}</div>}</div></section>
}

export function SecurityCenter({lang,onBack}:Props){return <section className="navWorkspace contentSurface" data-runtime-area="me.security"><Crumbs onBack={onBack} title={tr(lang,"Đăng nhập & bảo mật","Login & Security","登录与安全")}/></section>}

export function StickerStore({lang,onBack,mode}:{lang:Lang;onBack:()=>void;mode:"store"|"wallet"}){
 const[count,setCount]=useState(0);const[wallet,setWallet]=useState<{points?:number;items?:StickerItem[]}|null>(null);const[loading,setLoading]=useState(mode==="wallet");const[error,setError]=useState("");
 useEffect(()=>{if(mode!=="wallet")return;let live=true;fetch("/api/me/stickers",{cache:"no-store"}).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error||`HTTP ${response.status}`);if(live)setWallet({points:data.points,items:Array.isArray(data.items)?data.items:[]})}).catch(()=>{if(live){setWallet({items:[]});setError(tr(lang,"Kho sticker chưa được kết nối.","Sticker inventory is not connected.","贴纸库存尚未连接。"))}}).finally(()=>{if(live)setLoading(false)});return()=>{live=false}},[mode,lang]);
 const items=mode==="store"?[]:(wallet?.items||[]);
 return <section className="navWorkspace contentSurface" data-runtime-area="me.stickers"><Crumbs onBack={onBack} title={mode==="store"?"Sticker Store":tr(lang,"Sticker của tôi","My Stickers","我的贴纸")}/><div className="completionPanel"><div className="stickerSummary"><b>{tr(lang,"Điểm Sticker","Sticker Points","贴纸积分")}</b><span>{wallet?.points??"—"}</span></div>{loading?<div className="semanticEmpty">{tr(lang,"Đang tải…","Loading…","加载中…")}</div>:items.length?<div className="stickerGrid">{items.map((item:StickerItem,index:number)=><button data-action-id={`pro.sticker.${mode}.${item.id||index}.select`} type="button" key={item.id||item.name} onClick={()=>setCount(value=>value+1)}><span className="stickerEmoji">{item.emoji||"✨"}</span><b>{item.name}</b></button>)}</div>:<div className="semanticEmpty">{error||tr(lang,"Chưa có sticker trong kho.","No stickers are available.","暂无贴纸。")}</div>}<div className="endStatus"><b>{count}</b><span>{tr(lang,"Giao dịch chỉ hoàn tất sau receipt Store/Points.","Transactions complete only after a Store/Points receipt.","交易仅在收到商店/积分凭证后完成。")}</span></div></div></section>
}

export function PaymentCenter({lang,onBack}:Props){
 const[method,setMethod]=useState("vietqr");
 const methods=[["vietqr","VietQR / Chuyển khoản"],["momo","MoMo"],["zalopay","ZaloPay"],["card","Visa / Mastercard"],["apple","Apple Pay"],["google","Google Pay"],["cod","COD"]];
 return <section className="navWorkspace contentSurface mode-pay" data-runtime-area="store.payment"><Crumbs onBack={onBack} title={tr(lang,"Phương thức thanh toán","Payment Methods","支付方式")}/><div className="completionPanel"><div className="paymentMethods">{methods.map(([id,name])=><button data-action-id={`pro.payment.method.${id}.select`} type="button" key={id} className={method===id?"selected priority":""} onClick={()=>setMethod(id)}>{name}</button>)}</div><div className="paymentDetail"><b>{tr(lang,"Đã chọn","Selected","已选择")}: {method}</b><p>{tr(lang,"Chưa tạo giao dịch. Thanh toán chỉ bật khi có giỏ hàng, provider và receipt backend.","No transaction has been created. Payment requires a cart, provider and backend receipt.","尚未创建交易；支付需要购物车、服务商和后端凭证。")}</p></div><button data-action-id={`pro.payment.method.${method}.checkout`} data-runtime-ignore="gated-until-cart-provider" type="button" className="endCommit" disabled>{tr(lang,"Chưa có provider/giỏ hàng","Provider/cart unavailable","服务商/购物车不可用")}</button></div></section>
}
