import type {MetadataRoute} from "next";
export default function manifest():MetadataRoute.Manifest{return{name:"Long App",short_name:"Long",description:"Long App V3 Web Core",start_url:"/",display:"standalone",background_color:"#f5f1ff",theme_color:"#8d6cff",orientation:"any",icons:[{src:"/icon-192.png",sizes:"192x192",type:"image/png"},{src:"/icon-512.png",sizes:"512x512",type:"image/png"}]}}
