"use client";
import {useMemo,useState} from "react";
import type {Lang} from "@/lib/navigation";

type Props={lang:Lang;onBack:()=>void;onDone:()=>void};
const templates=[
 {id:"event-announce",vi:"Thông báo sự kiện",en:"Event announcement"},
 {id:"product-card",vi:"Giới thiệu sản phẩm",en:"Product showcase"},
 {id:"live-intro",vi:"Intro livestream",en:"Livestream intro"},
 {id:"short-recap",vi:"Recap ngắn",en:"Short recap"},
];
export default function TemplateVideoBuilder({lang,onBack,onDone}:Props){
 const vi=lang==="vi"; const [tpl,setTpl]=useState(templates[0].id); const[files,setFiles]=useState<File[]>([]); const[title,setTitle]=useState(""); const[rendered,setRendered]=useState(false);
 const names=useMemo(()=>files.map(f=>f.name),[files]);
 return <section className="navWorkspace specializedPanel">
  <div className="workspaceCrumbs"><button type="button" className="backKey" onClick={onBack}>← Back</button><button type="button" className="crumbKey selected">{vi?"Tạo video":"Create Video"}</button><button type="button" className="crumbKey selected tree5Crumb">{vi?"Từ mẫu":"From Template"}</button></div>
  <div className="specialHead"><div><span>SPECIALIZED CONTENT</span><h2>{vi?"Dựng video từ mẫu":"Template Video Builder"}</h2></div><b className={`statePill ${rendered?"live":"ready"}`}>{rendered?(vi?"ĐÃ TẠO":"CREATED"):(vi?"SẴN SÀNG":"READY")}</b></div>
  <div className="specialGrid">
   <label><span>{vi?"1. Chọn template":"1. Choose template"}</span><select value={tpl} onChange={e=>{setTpl(e.target.value);setRendered(false)}}>{templates.map(t=><option key={t.id} value={t.id}>{vi?t.vi:t.en}</option>)}</select></label>
   <label><span>{vi?"2. Tiêu đề video":"2. Video title"}</span><input value={title} onChange={e=>setTitle(e.target.value)} placeholder={vi?"Ví dụ: Sự kiện cuối tuần":"Example: Weekend Event"}/></label>
   <label className="wide"><span>{vi?"3. Chọn ảnh/video từ máy":"3. Pick photos/videos from device"}</span><input type="file" accept="image/*,video/*" multiple onChange={e=>{setFiles(Array.from(e.target.files||[]));setRendered(false)}}/><small>{names.length?names.join(" · "):(vi?"Chưa chọn nội dung":"No media selected")}</small></label>
   <div className="templatePreview wide"><b>{vi?"Preview template":"Template preview"}</b><span>{vi?"Template sẽ tự đặt media vào các slot dựng sẵn; không cần camera/microphone permission.":"Selected media will be placed into predefined template slots; no camera/microphone permission is required."}</span><div className="previewMock">{templates.find(t=>t.id===tpl)?.[vi?"vi":"en"]} · {files.length} media</div></div>
  </div>
  <div className="endCommitRow"><button type="button" className="secondaryEnd" onClick={onBack}>{vi?"Chọn lại":"Choose again"}</button><button type="button" className="endCommit" disabled={!files.length} onClick={()=>setRendered(true)}>{rendered?(vi?"✓ Video sẵn sàng":"✓ Video ready"):(vi?"Tạo video":"Create video")}</button>{rendered&&<button type="button" className="endCommit" onClick={onDone}>{vi?"Đưa vào Phát sóng · END":"Send to Broadcast · END"}</button>}</div>
 </section>
}
