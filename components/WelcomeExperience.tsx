"use client";
import {useEffect,useState} from "react";
import type {Lang} from "@/core/i18n";
const copy:Record<Lang,{hello:string,sub:string}>={
 vi:{hello:"Xin chào, chào mừng đến với Long.",sub:"Một không gian để tạo, kết nối và trải nghiệm."},
 en:{hello:"Hello, welcome to Long.",sub:"A space to create, connect and experience."},
 zh:{hello:"你好，欢迎来到 Long。",sub:"一个用于创作、连接与体验的空间。"}
};
export default function WelcomeExperience({lang,onDone}:{lang:Lang;onDone:()=>void}){
 const[leaving,setLeaving]=useState(false);
 useEffect(()=>{const t=setTimeout(()=>{setLeaving(true);setTimeout(onDone,500)},5200);return()=>clearTimeout(t)},[onDone]);
 return <div className={"welcomeFlash "+(leaving?"leaving":"")} role="dialog" aria-label="Long Welcome">
  <div className="welcomeGlow"/>
  <img className="welcomeDragon" src="/brand/phuc-long-dragon.svg" alt="Long Dragon"/>
  <div className="welcomeText"><span>PHUC LONG CENTER</span><h1>{copy[lang].hello}</h1><p>{copy[lang].sub}</p></div>
  <button className="welcomeSkip" onClick={onDone}>Skip</button>
 </div>
}
