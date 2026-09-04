"use client";
import Link from "next/link";import {usePathname} from "next/navigation";import {useI18n} from "@/components/LanguageProvider";
const items=[{href:"/",key:"home" as const},{href:"/studio",key:"studio" as const},{href:"/store",key:"store" as const},{href:"/me",key:"me" as const}];
function active(path:string,href:string){if(href==="/")return path==="/"||path.startsWith("/event")||path.startsWith("/flash-video")||path.startsWith("/ai-jobs");return path===href||path.startsWith(href+"/")}
export default function TopNav(){const p=usePathname();const{t}=useI18n();return <nav className="topnav">{items.map(x=><Link aria-current={active(p,x.href)?"page":undefined} key={x.href} href={x.href} className={active(p,x.href)?"active":""}>{t(x.key)}</Link>)}</nav>}
