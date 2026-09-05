"use client";
import {useEffect,useRef,useState} from "react";
import type {Lang} from "@/core/i18n";
const copy:Record<Lang,{title:string;line:string;skip:string}>={
 vi:{title:"Xin chào đến với không gian công nghệ của Phúc Long Center!",line:"Event Space@ · Flash Flow Engine™ · AI & QRCode live check-in™",skip:"Bỏ qua"},
 en:{title:"Phuc Long Center Welcome!",line:"Event Space@ · Flash Flow Engine™ · AI & QRCode live check-in™",skip:"Skip"},
 zh:{title:"欢迎来到 Phuc Long Center 科技空间！",line:"Event Space@ · Flash Flow Engine™ · AI & QRCode live check-in™",skip:"跳过"}
};
export default function WelcomeExperience({lang,onDone}:{lang:Lang;onDone:()=>void}){
 const[leaving,setLeaving]=useState(false);const videoRef=useRef<HTMLVideoElement|null>(null);
 useEffect(()=>{const t=setTimeout(()=>{setLeaving(true);setTimeout(onDone,460)},5000);return()=>clearTimeout(t)},[onDone]);
 function close(){setLeaving(true);setTimeout(onDone,320)}
 return <div className={"welcomeFlash welcomeFilm "+(leaving?"leaving":"")} role="dialog" aria-label="Long Welcome">
   <div className="welcomeAura"/>
   <div className="welcomeJewelFrame" aria-hidden="true"><i/><i/><i/><i/></div>
   <video ref={videoRef} className="welcomeMovie" src="/welcome/long-welcome-5s.mp4" autoPlay playsInline preload="auto"
     onEnded={close} onCanPlay={()=>videoRef.current?.play().catch(()=>{})}/>
   <div className="welcomeGlass"/>
   <div className="welcomeIdentity compact"><h1>{copy[lang].title}</h1><p>{copy[lang].line}</p></div>
   <button className="welcomeSkip" onClick={close}>{copy[lang].skip}</button>
 </div>
}
