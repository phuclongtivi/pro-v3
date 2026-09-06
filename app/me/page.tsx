"use client";
import {useState} from "react";
import BrandFooter from "@/components/BrandFooter";
import Nav3Navigator from "@/components/Nav3Navigator";
import {core,label} from "@/lib/navigation";
import type {CoreItem} from "@/lib/navigation";
import {useI18n} from "@/components/LanguageProvider";
export default function Page(){
 const{lang}=useI18n();const groups:CoreItem[]=core.me as CoreItem[];const[id,setId]=useState(groups[0].id);const group=groups.find(x=>x.id===id)||groups[0];const[childId,setChildId]=useState(group.children[0].id);const child=group.children.find(x=>x.id===childId)||group.children[0];function choose(x:CoreItem){setId(x.id);setChildId(x.children[0].id)}
 return <main className="page nav3Page"><div className="layerbar corebar nav3Corebar">{groups.map(x=><button key={x.id} className={id===x.id?"active":""} onClick={()=>choose(x)}>{label(x.label,lang)}</button>)}</div><Nav3Navigator section={group.id} items={group.children} activeId={child.id} onSelect={setChildId} lang={lang}/><BrandFooter/></main>}
