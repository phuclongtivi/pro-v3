"use client";
import {useState} from "react";
import BrandFooter from "@/components/BrandFooter";
import LongFocusNavigator from "@/components/LongFocusNavigator";
import BroadcastControl from "@/components/BroadcastControl";
import {core,label} from "@/lib/navigation";
import {useI18n} from "@/components/LanguageProvider";

export default function Page(){
 const{lang}=useI18n();const groups=core.studio;
 const[id,setId]=useState(groups[0].id);const group=groups.find(x=>x.id===id)!;
 const[childId,setChildId]=useState(group.children[0].id);const[resetSignal,setResetSignal]=useState(0);const child=group.children.find(x=>x.id===childId)||group.children[0];
 function choose(x:(typeof groups)[number]){setId(x.id);setChildId(x.children[0].id)}
 return <main className="page studioPage"><section className="hero studioHero"><h1>Phòng Thu</h1><p>Broadcast • Room • Chat</p></section>
  <div className="layerbar corebar studioCore">{groups.map(x=><button key={x.id} className={id===x.id?"active":""} onClick={()=>choose(x)}>{label(x.label,lang)}</button>)}</div>
  <LongFocusNavigator items={group.children} activeId={child.id} onSelect={v=>v===child.id?setResetSignal(x=>x+1):setChildId(v)} lang={lang}/>
  <section className="panel studioContent"><div className="kpi">Phòng Thu → {label(group.label,lang)} → {label(child.label,lang)}</div>
   <BroadcastControl itemId={child.id} resetSignal={resetSignal}/>
  </section><BrandFooter/></main>
}
