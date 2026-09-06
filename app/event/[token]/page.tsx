"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import QRCode from "qrcode";
import BrandFooter from "@/components/BrandFooter";

type EventData={id:string;title:string;description:string;starts_at:string;ends_at:string;delete_chat_at:string;phase:"PRE_EVENT"|"LIVE"|"POST_EVENT";chat_enabled:boolean;pre_event_chat_enabled:boolean};
type Msg={id:string;member_id:string;display_name:string;role:string;kind:string;body?:string;attachment_url?:string;attachment_name?:string;attachment_size?:number;created_at:string};

export default function EventSpace(){
 const {token}=useParams<{token:string}>();
 const[event,setEvent]=useState<EventData|null>(null);
 const[memberId,setMemberId]=useState("");
 const[role,setRole]=useState("audience");
 const[name,setName]=useState("");
 const[joined,setJoined]=useState(false);
 const[online,setOnline]=useState<any[]>([]);
 const[messages,setMessages]=useState<Msg[]>([]);
 const[text,setText]=useState("");
 const[qr,setQr]=useState("");
 const[fileBusy,setFileBusy]=useState(false);
 const[fileRef]=useState(()=>({current:null as HTMLInputElement|null}));
 const heartbeatRef=useRef<number|null>(null);

 useEffect(()=>{fetch(`/api/event/${token}`,{cache:"no-store"}).then(r=>r.json()).then(d=>d.ok&&setEvent(d.event));},[token]);
 useEffect(()=>{QRCode.toDataURL(`${location.origin}/event/${token}`,{width:260,margin:1}).then(setQr).catch(()=>{});},[token]);

 async function join(){
  const id=localStorage.getItem(`long-event-member-${token}`)||crypto.randomUUID();
  localStorage.setItem(`long-event-member-${token}`,id);
  const accountId=localStorage.getItem("long-user-id")||null;
  const res=await fetch(`/api/event/${token}/join`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({displayName:name||"Guest",memberId:id,accountId})});
  const d=await res.json();
  if(d.ok){setMemberId(d.memberId);setRole(d.role);setJoined(true);}
 }

 useEffect(()=>{
  if(!joined||!memberId)return;
  let alive=true;
  const poll=async()=>{
   const [p,c]=await Promise.all([
    fetch(`/api/event/${token}/presence`,{cache:"no-store"}).then(r=>r.json()),
    fetch(`/api/event/${token}/chat`,{cache:"no-store"}).then(r=>r.json())
   ]);
   if(!alive)return;
   if(p.ok)setOnline(p.online||[]);
   if(c.ok)setMessages(c.messages||[]);
   await fetch(`/api/event/${token}/presence`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberId,action:"heartbeat"})});
  };
  poll();
  heartbeatRef.current=window.setInterval(poll,3000);
  const leave=()=>navigator.sendBeacon?.(`/api/event/${token}/presence`,new Blob([JSON.stringify({memberId,action:"leave"})],{type:"application/json"}));
  window.addEventListener("pagehide",leave);
  return()=>{alive=false;if(heartbeatRef.current)window.clearInterval(heartbeatRef.current);window.removeEventListener("pagehide",leave)}
 },[joined,memberId,token]);

 async function sendText(){
  const body=text.trim(); if(!body)return;
  const res=await fetch(`/api/event/${token}/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberId,body})});
  const d=await res.json(); if(d.ok)setText(""); else alert(d.error||"Không gửi được");
 }

 async function upload(file:File){
  if(file.size>3*1024*1024){alert("Mỗi file tối đa 3MB");return}
  setFileBusy(true);
  const fd=new FormData();fd.append("file",file);fd.append("memberId",memberId);
  const res=await fetch(`/api/event/${token}/chat/upload`,{method:"POST",body:fd});const d=await res.json();
  setFileBusy(false); if(!d.ok)alert(d.error||"Upload thất bại");
 }

 const phase=event?.phase||"PRE_EVENT";
 const services=useMemo(()=>phase==="PRE_EVENT"?["Check-in","Vé / Quà","Lịch trình","Khách mời","Chia sẻ"]:phase==="LIVE"?["Sân khấu","Chat room","Q&A","Reaction","Shopping"]:["Replay","Ảnh / Video","Quà của tôi","Đơn hàng","Đánh giá"],[phase]);
 const[service,setService]=useState("Sân khấu");
 useEffect(()=>setService(phase==="LIVE"?"Sân khấu":phase==="PRE_EVENT"?"Check-in":"Replay"),[phase]);

 if(!event)return <main className="page"><section className="eventGate"><h1>Đang tải Event Space…</h1></section></main>;
 if(!joined)return <main className="page"><section className="eventGate"><span className="eyebrow">EVENT GATE</span><h1>{event.title}</h1><p>Join first, install later.</p><div className="guestJoin"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Tên hiển thị"/><button className="action" onClick={join}>Tiếp tục vào sự kiện</button><span>Không bắt buộc cài app hoặc đăng nhập. Có thể liên kết tài khoản sau.</span></div>{qr&&<img src={qr} alt="Event QR" style={{width:220,borderRadius:16}}/>}</section></main>;

 return <main className="page eventSpace">
  <section className="eventContext"><div><span className="liveDot">{phase==="LIVE"?"● LIVE":phase==="PRE_EVENT"?"SẮP DIỄN RA":"ĐÃ KẾT THÚC"}</span><h1>{event.title}</h1><p>{name||"Guest"} · {role} · {online.length} online</p></div>{qr&&<img src={qr} alt="Event QR" style={{width:108,borderRadius:12}}/>}</section>
  <section className="eventStage"><span className="eyebrow">EVENT TIMELINE</span><h2>{phase==="LIVE"?"Đang diễn ra • Main Stage":phase==="PRE_EVENT"?"Sự kiện sắp bắt đầu":"Post Event"}</h2><p>{new Date(event.starts_at).toLocaleString()} → {new Date(event.ends_at).toLocaleString()}</p></section>
  <div className="serviceDock">{services.map(x=><button key={x} className={service===x?"active":""} onClick={()=>setService(x)}>{x}</button>)}</div>
  {service==="Chat room"?<section className="panel"><div className="kpi">Event Chat • {online.length} online</div>
    <div className="chatLog">{messages.map(m=><div key={m.id} className="chatMsg"><strong>{m.display_name} <small>{m.role}</small></strong>{m.kind==="file"?<a href={m.attachment_url} target="_blank">📎 {m.attachment_name} ({Math.ceil((m.attachment_size||0)/1024)} KB)</a>:<span>{m.body}</span>}</div>)}</div>
    <div className="chatComposer"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendText()} placeholder="Nhắn trong sự kiện…"/><button className="action" onClick={sendText}>Gửi</button><input ref={el=>{fileRef.current=el}} type="file" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0])}/></div>
    {fileBusy&&<div className="small">Đang gửi file…</div>}
    <div className="small">File ≤ 3MB/lần. Chat kết thúc theo event và xóa vĩnh viễn tại {new Date(event.delete_chat_at).toLocaleString()}.</div>
  </section>:<section className="grid"><div className="card"><h3>{service}</h3><p>Dịch vụ một chạm được Event Space ưu tiên theo tiến trình sự kiện.</p></div><div className="card"><h3>AI Event Assistant</h3><p>Build 2 đã cấp dữ liệu event/role/presence/chat để Build 3 AI Orchestrator sử dụng.</p></div></section>}
  <div style={{marginTop:12}}><Link className="action secondary" href="/">← Home / Sự kiện</Link></div><BrandFooter/>
 </main>
}