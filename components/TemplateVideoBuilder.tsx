"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {renderLocalVideo} from "@/lib/local-video-renderer";
import type {Lang} from "@/lib/navigation";

type Props={lang:Lang;onBack:()=>void;onDone:()=>void};
const templates=[
 {id:"event-announce",vi:"Thông báo sự kiện",en:"Event announcement"},
 {id:"product-card",vi:"Giới thiệu sản phẩm",en:"Product showcase"},
 {id:"live-intro",vi:"Intro livestream",en:"Livestream intro"},
 {id:"short-recap",vi:"Recap ngắn",en:"Short recap"},
];
export default function TemplateVideoBuilder({lang,onBack,onDone}:Props){
 const vi=lang==="vi"; const [tpl,setTpl]=useState(templates[0].id); const[files,setFiles]=useState<File[]>([]); const[title,setTitle]=useState(""); const[rendered,setRendered]=useState(false);const[query,setQuery]=useState("event background");const[assets,setAssets]=useState<any[]>([]);const[selectedAsset,setSelectedAsset]=useState<any|null>(null);const[status,setStatus]=useState("");
 const[busy,setBusy]=useState(false);const[output,setOutput]=useState<{url:string;extension:string}|null>(null);const abortRef=useRef<AbortController|null>(null);
 useEffect(()=>()=>{abortRef.current?.abort()},[]);
 useEffect(()=>()=>{if(output)URL.revokeObjectURL(output.url)},[output]);
 useEffect(()=>{setOutput(null);setRendered(false)},[files,title,tpl,selectedAsset]);
 const names=useMemo(()=>files.map(f=>f.name),[files]);
 async function searchAssets(){setStatus(vi?"Đang tìm nguồn miễn phí có license…":"Searching licensed free resources…");const result=await fetch(`/api/assets/search?q=${encodeURIComponent(query)}`).then(r=>r.json()).catch(()=>({ok:false,assets:[]}));setAssets(result.assets||[]);setStatus(result.ok?"":(vi?"Nguồn ngoài tạm thời không khả dụng; hãy dùng file trên thiết bị.":"External source unavailable; use a device file."))}
 async function createVideo(){
  if(busy)return;
  if(!files.length){setStatus(vi?"Chọn ảnh/video trên máy để dựng. Nguồn ngoài chưa hỗ trợ xuất video.":"Choose device media to render. External export is not available yet.");return}
  setBusy(true);setRendered(false);setOutput(null);const controller=new AbortController();abortRef.current=controller;
  try{const result=await renderLocalVideo(files,title,value=>setStatus(`${value}%`),controller.signal,tpl);if(controller.signal.aborted)return;setOutput({url:URL.createObjectURL(result.blob),extension:result.extension});setRendered(true);setStatus(vi?"Đã tạo video trên thiết bị.":"Video created on this device.");window.dispatchEvent(new CustomEvent("long:local-media-output",{detail:result.evidence}))}
  catch(error){if(!controller.signal.aborted)setStatus(error instanceof Error?error.message:"Không tạo được video.")}
  finally{setBusy(false)}
 }

 return <section className="navWorkspace specializedPanel">
  <div className="workspaceCrumbs"><button data-action-id="pro.components.templatevideobuilder.button.001" type="button" className="backKey" onClick={()=>{abortRef.current?.abort();onBack()}}>← Back</button><span className="crumbKey selected">{vi?"Tạo video":"Create Video"}</span><span className="crumbKey selected tree5Crumb">{vi?"Từ mẫu":"From Template"}</span></div>
  <div className="specialHead"><div><h2>{vi?"Dựng video từ mẫu":"Template Video Builder"}</h2></div><b className={`statePill ${rendered?"live":"ready"}`}>{rendered?(vi?"ĐÃ TẠO":"CREATED"):(vi?"SẴN SÀNG":"READY")}</b></div>
  <fieldset className="specialGrid" disabled={busy} style={{border:0,minWidth:0}}>
   <label><span>{vi?"1. Chọn template":"1. Choose template"}</span><select value={tpl} onChange={e=>{setTpl(e.target.value);setRendered(false)}}>{templates.map(t=><option key={t.id} value={t.id}>{vi?t.vi:t.en}</option>)}</select></label>
   <label><span>{vi?"2. Tiêu đề video":"2. Video title"}</span><input value={title} onChange={e=>setTitle(e.target.value)} placeholder={vi?"Ví dụ: Sự kiện cuối tuần":"Example: Weekend Event"}/></label>
   <label className="wide"><span>{vi?"3. Chọn ảnh/video từ máy":"3. Pick photos/videos from device"}</span><input type="file" accept="image/*,video/*" multiple onChange={e=>{setFiles(Array.from(e.target.files||[]));setRendered(false)}}/><small>{names.length?names.join(" · "):(vi?"Chưa chọn nội dung":"No media selected")}</small></label>
   <div className="templatePreview wide"><b>{vi?"Hoặc tìm ảnh mẫu bên ngoài":"Or find external sample images"}</b><div className="aiComposer"><input value={query} onChange={e=>setQuery(e.target.value)}/><button data-action-id="pro.scene.assets.search" type="button" onClick={searchAssets}>{vi?"Tìm nguồn":"Search"}</button></div><div className="stickerGrid">{assets.map(asset=><button data-action-id={`pro.scene.assets.select.${asset.id}`} type="button" key={asset.id} onClick={()=>setSelectedAsset(asset)} className={selectedAsset?.id===asset.id?"priority":""}><img src={asset.previewUrl} alt="" loading="lazy"/><small>{asset.license} · {asset.creator}</small></button>)}</div>{selectedAsset&&<small>{selectedAsset.attribution} · <a href={selectedAsset.sourceUrl} target="_blank" rel="noreferrer">Source/license evidence</a></small>}{status&&<div className="connectResult">{status}</div>}</div>
   <div className="templatePreview wide"><b>{vi?"Preview template":"Template preview"}</b><span>{vi?"Ảnh: 3 giây mỗi tệp. Video: tối đa 30 giây mỗi tệp. Giữ màn hình mở khi dựng.":"Images: 3 seconds each. Videos: up to 30 seconds each. Keep this screen open while rendering."}</span><div className="previewMock">{templates.find(t=>t.id===tpl)?.[vi?"vi":"en"]} · {files.length} media</div></div>
  </fieldset>
  {output&&<div><video controls playsInline src={output.url} style={{width:"100%"}}/><a className="endCommit" href={output.url} download={`long-flashflow.${output.extension}`}>{vi?"Tải video về máy":"Download video"}</a></div>}
  <div className="endCommitRow"><button data-action-id="pro.components.templatevideobuilder.button.004" type="button" className="secondaryEnd" onClick={()=>{abortRef.current?.abort();onBack()}}>{vi?"Chọn lại":"Choose again"}</button><button data-action-id="pro.components.templatevideobuilder.button.005" data-runtime-ignore="true" type="button" className="endCommit" disabled={busy||!files.length} onClick={createVideo}>{rendered?(vi?"✓ Video đã tạo":"✓ Video created"):(vi?"Tạo video":"Create video")}</button>{rendered&&!output&&<button data-action-id="pro.components.templatevideobuilder.button.006" type="button" className="endCommit" onClick={onDone}>{vi?"Đưa vào Phát sóng":"Send to Broadcast"}</button>}</div>
 </section>
}
