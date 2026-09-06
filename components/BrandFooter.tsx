"use client";
import {useI18n} from "@/components/LanguageProvider";
export default function BrandFooter(){
 const{lang}=useI18n();
 const place=lang==="zh"?"越南 · Việt Yên":"Việt Yên, Việt Nam";
 return <footer className="footer brandFooterCompact">
   <div className="brandLine"><b>Phuc Long Center</b><span>|</span><span>{place}</span></div>
   <div className="techLine">Event Space@ <span>|</span> Flash Flow Engine™ <span>|</span> AI &amp; QRCode live check-in™</div>
 </footer>
}
