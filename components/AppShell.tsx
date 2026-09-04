"use client";
import {useEffect} from "react";import {LanguageProvider} from "@/components/LanguageProvider";import TopNav from "@/components/TopNav";
export default function AppShell({children}:{children:React.ReactNode}){useEffect(()=>{const saved=localStorage.getItem("long-theme")||"lavender";document.documentElement.dataset.theme=saved;if("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{})},[]);return <LanguageProvider><TopNav/>{children}</LanguageProvider>}
