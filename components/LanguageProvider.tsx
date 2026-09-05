"use client";
import {createContext,useContext,useEffect,useState,useCallback} from "react";
import type {Lang} from "@/core/i18n";
import {languages,ui} from "@/core/i18n";
import WelcomeExperience from "@/components/WelcomeExperience";
import {playStartup} from "@/core/audio-engine";
type Ctx={lang:Lang;setLang:(v:Lang)=>void;t:(key:keyof typeof ui.vi)=>string};
const C=createContext<Ctx|null>(null);
export function LanguageProvider({children}:{children:React.ReactNode}){
 const[lang,setLangState]=useState<Lang>("vi");const[ready,setReady]=useState(false);const[showGate,setShowGate]=useState(false);const[welcome,setWelcome]=useState(false);
 useEffect(()=>{const saved=localStorage.getItem("long-language") as Lang|null;if(saved&&["vi","en","zh"].includes(saved)){setLangState(saved);document.documentElement.lang=saved;setShowGate(false);setTimeout(()=>playStartup().catch(()=>{}),250)}else{const n=(navigator.language||"").toLowerCase();const guessed:Lang=n.startsWith("zh")?"zh":n.startsWith("en")?"en":"vi";setLangState(guessed);setShowGate(true)}setReady(true)},[]);
 function setLang(v:Lang){setLangState(v);localStorage.setItem("long-language",v);document.documentElement.lang=v;setShowGate(false)}
 function firstChoose(v:Lang){setLangState(v);localStorage.setItem("long-language",v);document.documentElement.lang=v;localStorage.setItem("long-welcome-seen","1");setShowGate(false);setWelcome(true)}
 const finishWelcome=useCallback(()=>setWelcome(false),[]);
 const t=(key:keyof typeof ui.vi)=>String(ui[lang][key]??ui.vi[key]);
 return <C.Provider value={{lang,setLang,t}}>{children}{ready&&showGate&&<div className="languageGate"><div className="languageCard"><span className="eyebrow">LONG APP</span><h1>{t("chooseLanguage")}</h1><div className="languageChoices">{(Object.keys(languages) as Lang[]).map(v=><button key={v} onClick={()=>firstChoose(v)} className={lang===v?"active":""}>{languages[v]}</button>)}</div><p>{t("changeLater")}</p></div></div>}{welcome&&<WelcomeExperience lang={lang} onDone={finishWelcome}/>}</C.Provider>
}
export function useI18n(){const v=useContext(C);if(!v)throw new Error("useI18n must be used inside LanguageProvider");return v}
