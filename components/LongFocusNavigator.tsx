"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import type {Lang,NavChild} from "@/lib/navigation";
import {label} from "@/lib/navigation";

export default function LongFocusNavigator({items,activeId,onSelect,lang}:{items:NavChild[];activeId:string;onSelect:(id:string)=>void;lang:Lang}){
 const index=Math.max(0,items.findIndex(x=>x.id===activeId));
 const timer=useRef<ReturnType<typeof setInterval>|null>(null);
 const[fineOffset,setFineOffset]=useState(0);
 const tap=useRef({side:"",at:0});
 const visible=useMemo(()=>items.map((item,i)=>{let d=i-index;const n=items.length;if(d>n/2)d-=n;if(d<-n/2)d+=n;return{item,d}}).filter(x=>Math.abs(x.d)<=4),[items,index]);
 function move(step:number){onSelect(items[(index+step+items.length)%items.length].id)}
 function precision(side:-1|1){const now=Date.now(),key=String(side);if(tap.current.side===key&&now-tap.current.at<330){setFineOffset(0);move(side);tap.current={side:"",at:0};return}tap.current={side:key,at:now};setFineOffset(side*8);window.setTimeout(()=>setFineOffset(0),180)}
 function hold(side:-1|1){timer.current=setInterval(()=>move(side),430)}
 function stop(){if(timer.current){clearInterval(timer.current);timer.current=null}}
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="ArrowLeft"){e.preventDefault();move(-1)}if(e.key==="ArrowRight"){e.preventDefault();move(1)}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[index,items]);
 return <div className="longFocusNav" aria-label="Long Focus Navigator">
   <button className="quickKey left" onClick={()=>precision(-1)} onPointerDown={()=>hold(-1)} onPointerUp={stop} onPointerLeave={stop}><b>◀</b><span>QUICK</span><small>tap • double • hold</small></button>
   <div className="focusStage" style={{transform:`translateX(${fineOffset}px)`}}>
    <div className="focusTarget" aria-hidden="true"><i/><i/><i/><i/><span>＋</span></div>
    {visible.map(({item,d})=>{const a=d===0,x=d*132,abs=Math.abs(d),scale=a?1:Math.max(.60,1-abs*.12),rot=d===0?0:(d<0?16+abs*6:-16-abs*6);return <button key={item.id} className={`focusItem ${a?"active":""}`} onClick={()=>onSelect(item.id)} style={{transform:`translate3d(${x}px,0,${-abs*58}px) rotateY(${rot}deg) scale(${scale})`,opacity:a?1:Math.max(.28,1-abs*.19),zIndex:30-abs}}><span>{label(item.label,lang)}</span>{a&&<em>FOCUS</em>}</button>})}
   </div>
   <button className="quickKey right" onClick={()=>precision(1)} onPointerDown={()=>hold(1)} onPointerUp={stop} onPointerLeave={stop}><b>▶</b><span>QUICK</span><small>tap • double • hold</small></button>
 </div>
}
