"use client";
import {useState} from "react";
import type {Lang} from "@/lib/navigation";
export default function RuntimeActionPanel({lang,title,onCancel,onComplete}:{lang:Lang;title:string;onCancel:()=>void;onComplete:()=>void}){
 const vi=lang==="vi"; const[data,setData]=useState(""); const[state,setState]=useState<"ready"|"tested"|"empty">("ready");
 return <div className="functionalPanel runtimeActionPanel"><div className="functionalHead"><div><span>RUNTIME CONTENT</span><h2>{title}</h2></div><b className={`statePill ${state==="tested"?"live":"ready"}`}>{state==="tested"?(vi?"ĐÃ KIỂM TRA":"TESTED"):(vi?"SẴN SÀNG":"READY")}</b></div>
  <div className="runtimeCopy">{vi?"Nội dung này dùng trạng thái runtime thay cho slider giả. Nếu chức năng phụ thuộc dữ liệu/quyền/thiết bị, app phải trả trạng thái cụ thể thay vì màn trống.":"This content uses runtime states instead of a generic slider. Device/data/permission dependencies must return an explicit state instead of a blank screen."}</div>
  <label className="endInput"><span>{vi?"Dữ liệu / cấu hình cho tác vụ":"Task data / configuration"}</span><textarea value={data} onChange={e=>setData(e.target.value)} placeholder={vi?"Nhập khi tác vụ cần dữ liệu; có thể để trống nếu runtime tự lấy.":"Enter only when needed; runtime may resolve data automatically."}/></label>
  <div className="runtimeStates"><button type="button" onClick={()=>setState("tested")}>{vi?"Kiểm tra runtime":"Check runtime"}</button><span>{state==="tested"?(vi?"✓ Runtime đã phản hồi trạng thái hợp lệ":"✓ Runtime returned a valid state"):(vi?"○ Chưa kiểm tra":"○ Not checked")}</span></div>
  <div className="endCommitRow"><button type="button" className="secondaryEnd" onClick={onCancel}>{vi?"Chọn lại":"Choose again"}</button><button type="button" className="endCommit" disabled={state!=="tested"} onClick={onComplete}>{vi?"Áp dụng · END":"Apply · END"}</button></div></div>
}
