"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import type {Lang} from "@/lib/navigation";

const EVENT_TYPES = [
  ["conference", "Hội nghị / Hội thảo"],
  ["stage_show", "Sân khấu / Biểu diễn"],
  ["livestream", "Livestream"],
  ["sales", "Bán hàng / Ra mắt sản phẩm"],
  ["training", "Đào tạo"],
  ["community", "Cộng đồng"],
  ["private", "Sự kiện riêng tư"],
] as const;
const FORMATS = [["offline","Trực tiếp"],["online","Trực tuyến"],["hybrid","Kết hợp"]] as const;
const VISIBILITY = [["public","Công khai"],["unlisted","Chỉ người có link/QR"],["private","Riêng tư"]] as const;

function localValue(date:Date){const p=(n:number)=>String(n).padStart(2,"0");return `${date.getFullYear()}-${p(date.getMonth()+1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`}
function preset(value:string){const start=new Date();start.setSeconds(0,0);if(value==="tomorrow")start.setDate(start.getDate()+1);if(value!=="now")start.setHours(value==="evening"?19:9,0,0,0);const end=new Date(start.getTime()+2*60*60*1000);return [localValue(start),localValue(end)]}

export default function EventStructuredCreateForm({lang="vi",onBack}:{lang?:Lang;onBack?:()=>void}){
  const router=useRouter();
  const initial=useMemo(()=>preset("tomorrow"),[]);
  const[title,setTitle]=useState("");const[type,setType]=useState("conference");const[format,setFormat]=useState("offline");
  const[visibility,setVisibility]=useState("public");const[timePreset,setTimePreset]=useState("tomorrow");
  const[start,setStart]=useState(initial[0]);const[end,setEnd]=useState(initial[1]);const[timezone,setTimezone]=useState("Asia/Ho_Chi_Minh");
  const[location,setLocation]=useState("");const[description,setDescription]=useState("");const[preChat,setPreChat]=useState(false);const[hasGift,setHasGift]=useState(true);const[hasTicket,setHasTicket]=useState(false);
  const[busy,setBusy]=useState(false);const[error,setError]=useState("");
  function choosePreset(value:string){setTimePreset(value);if(value!=="custom"){const v=preset(value);setStart(v[0]);setEnd(v[1])}}
  async function create(){setBusy(true);setError("");try{const res=await fetch("/api/event",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({title,eventType:type,eventFormat:format,visibility,startsAt:start,endsAt:end,timezone,location,description,hasGift,hasTicket,preEventChatEnabled:preChat,chatEnabled:true})});const data=await res.json();if(!res.ok||!data.ok)throw new Error(data.error==="LOGIN_REQUIRED"?(lang==="vi"?"Vui lòng đăng nhập trước khi tạo sự kiện.":"Please sign in before creating an event."):data.error||"Create failed");router.push(data.eventUrl)}catch(e){setError(e instanceof Error?e.message:"Create failed")}finally{setBusy(false)}}
  const vi=lang==="vi";
  return <section className="navWorkspace contentSurface structuredEventForm" data-runtime-area="home.quickcreate.event.new">
    <div className="workspaceCrumbs">{onBack&&<button data-action-id="pro.event.form.back" type="button" className="backKey" onClick={onBack}>← Back</button>}<span className="crumbKey selected">{vi?"Sự kiện mới":"New event"}</span></div>
    <div className="eventFormGrid">
      <label className="field"><span>{vi?"Tên sự kiện":"Event name"}</span><input value={title} onChange={e=>setTitle(e.target.value)} maxLength={160} required/></label>
      <label className="field"><span>{vi?"Loại sự kiện":"Event type"}</span><select value={type} onChange={e=>setType(e.target.value)}>{EVENT_TYPES.map(x=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select></label>
      <label className="field"><span>{vi?"Hình thức":"Format"}</span><select value={format} onChange={e=>setFormat(e.target.value)}>{FORMATS.map(x=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select></label>
      <label className="field"><span>{vi?"Quyền xem":"Visibility"}</span><select value={visibility} onChange={e=>setVisibility(e.target.value)}>{VISIBILITY.map(x=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select></label>
      <label className="field"><span>{vi?"Quà tặng":"Gift"}</span><select value={hasGift?"yes":"no"} onChange={e=>setHasGift(e.target.value==="yes")}><option value="yes">{vi?"Có quà tặng":"Gift available"}</option><option value="no">{vi?"Không quà tặng":"No gift"}</option></select></label>
      <label className="field"><span>{vi?"Vé":"Ticket"}</span><select value={hasTicket?"yes":"no"} onChange={e=>setHasTicket(e.target.value==="yes")}><option value="no">{vi?"Không yêu cầu vé":"No ticket"}</option><option value="yes">{vi?"Có vé":"Ticket required"}</option></select></label>
      <label className="field"><span>{vi?"Mốc thời gian":"Time preset"}</span><select value={timePreset} onChange={e=>choosePreset(e.target.value)}><option value="now">Bắt đầu ngay · 2 giờ</option><option value="tomorrow">Ngày mai · 09:00–11:00</option><option value="evening">Tối nay · 19:00–21:00</option><option value="custom">Chọn ngày giờ cụ thể</option></select></label>
      <label className="field"><span>{vi?"Múi giờ":"Timezone"}</span><select value={timezone} onChange={e=>setTimezone(e.target.value)}><option value="Asia/Ho_Chi_Minh">Việt Nam · UTC+7</option><option value="Asia/Bangkok">Bangkok · UTC+7</option><option value="Asia/Singapore">Singapore · UTC+8</option><option value="UTC">UTC</option></select></label>
      <label className="field"><span>{vi?"Bắt đầu":"Starts"}</span><input type="datetime-local" value={start} onChange={e=>{setStart(e.target.value);setTimePreset("custom")}}/></label>
      <label className="field"><span>{vi?"Kết thúc":"Ends"}</span><input type="datetime-local" value={end} min={start} onChange={e=>{setEnd(e.target.value);setTimePreset("custom")}}/></label>
      <label className="field"><span>{vi?"Địa điểm / link":"Location / link"}</span><input value={location} onChange={e=>setLocation(e.target.value)} maxLength={240}/></label>
      <label className="field eventDescription"><span>{vi?"Mô tả (tùy chọn)":"Description (optional)"}</span><textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={2000}/></label>
    </div>
    <label className="eventCheck"><input type="checkbox" checked={preChat} onChange={e=>setPreChat(e.target.checked)}/>{vi?" Mở chat trước sự kiện":" Enable pre-event chat"}</label>
    {error&&<div className="notice">{error}</div>}
    <div className="endCommitRow"><button data-action-id="pro.event.form.create" className="endCommit" disabled={busy||!title.trim()||!start||!end} onClick={create}>{busy?(vi?"Đang tạo…":"Creating…"):(vi?"Tạo Event Space":"Create Event Space")}</button></div>
  </section>
}
