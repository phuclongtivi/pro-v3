"use client";

import {useCallback,useEffect,useState} from "react";
import type {Lang} from "@/lib/navigation";

type EventRow={id:string;public_token:string;title:string;description?:string;starts_at:string;ends_at:string;event_type:string;event_format:string;has_gift:boolean;has_ticket:boolean;status:string;location?:string};
const tr=(lang:Lang,vi:string,en:string,zh:string)=>lang==="en"?en:lang==="zh"?zh:vi;
export default function EventListPanel({lang,filter}:{lang:Lang;filter:"gift"|"no-gift"|"ticket"}){
 const[rows,setRows]=useState<EventRow[]>([]);const[loading,setLoading]=useState(true);const[error,setError]=useState("");
 const load=useCallback(async()=>{setLoading(true);setError("");try{const response=await fetch(`/api/event?filter=${filter}`,{cache:"no-store"});const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.error||`HTTP ${response.status}`);setRows(data.events||[])}catch(error){setRows([]);setError(error instanceof Error?error.message:"EVENTS_UNAVAILABLE")}finally{setLoading(false)}},[filter]);
 useEffect(()=>{load()},[load]);
 const title=filter==="gift"?tr(lang,"Có Quà Tặng","Gift Available","有礼物"):filter==="no-gift"?tr(lang,"Không Quà Tặng","No Gift","无礼物"):tr(lang,"Có Vé","Ticket Available","有票");
 return <section className="eventListPanel" data-runtime-area={`home.events.${filter}`}><div className="eventListHead"><h2>{title}</h2><button data-action-id={`pro.events.${filter}.refresh`} type="button" onClick={load}>{tr(lang,"Làm mới","Refresh","刷新")}</button></div>{loading?<div className="semanticEmpty">{tr(lang,"Đang tải sự kiện…","Loading events…","正在加载活动…")}</div>:error?<div className="semanticEmpty"><span>{error}</span><button data-action-id={`pro.events.${filter}.retry`} type="button" onClick={load}>{tr(lang,"Thử lại","Retry","重试")}</button></div>:rows.length?<div className="eventResultGrid">{rows.map(item=><article key={item.id} className="eventResultCard"><small>{new Date(item.starts_at).toLocaleString()} · {item.event_format}</small><h3>{item.title}</h3><p>{item.description||item.location||""}</p><div><span>{item.has_gift?"🎁 ":""}{item.has_ticket?"🎫 ":""}{item.status}</span><a data-action-id={`pro.events.${item.id}.open`} href={`/event/${item.public_token}`}>{tr(lang,"Xem sự kiện","Open event","查看活动")}</a></div></article>)}</div>:<div className="semanticEmpty">{tr(lang,"Chưa có sự kiện phù hợp bộ lọc.","No matching events.","没有匹配的活动。")}</div>}</section>
}
