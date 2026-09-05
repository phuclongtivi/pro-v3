"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import BrandFooter from "@/components/BrandFooter";

export default function CreateEvent(){
 const r=useRouter();
 const[title,setTitle]=useState("");
 const[start,setStart]=useState("");
 const[end,setEnd]=useState("");
 const[preChat,setPreChat]=useState(false);
 const[busy,setBusy]=useState(false);
 const[error,setError]=useState("");
 async function create(){
  setBusy(true);setError("");
  try{
   const creatorId=localStorage.getItem("long-user-id")||"local-owner";
   localStorage.setItem("long-user-id",creatorId);
   const res=await fetch("/api/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,startsAt:start,endsAt:end,creatorId,preEventChatEnabled:preChat,chatEnabled:true})});
   const data=await res.json();
   if(!data.ok) throw new Error(data.error||"Create failed");
   r.push(data.eventUrl);
  }catch(e){setError(e instanceof Error?e.message:"Create failed")}finally{setBusy(false)}
 }
 return <main className="page"><section className="hero"><h1>Tạo sự kiện</h1><p>Event Definition → Event Space → Public Token → QR</p></section>
 <section className="panel form" style={{marginTop:12}}>
  <div className="field"><label>Tiêu đề</label><input value={title} onChange={e=>setTitle(e.target.value)}/></div>
  <div className="field"><label>Bắt đầu</label><input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)}/></div>
  <div className="field"><label>Kết thúc</label><input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)}/></div>
  <label><input type="checkbox" checked={preChat} onChange={e=>setPreChat(e.target.checked)}/> Mở chat trước sự kiện</label>
  {error&&<div className="notice">{error}</div>}
  <button className="action" onClick={create} disabled={busy}>{busy?"Đang tạo…":"Tạo Event Space"}</button>
 </section><BrandFooter/></main>
}