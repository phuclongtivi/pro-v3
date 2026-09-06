import "./globals.css";import type {Metadata,Viewport} from "next";import AppShell from "@/components/AppShell";
export const metadata:Metadata={title:"Long App V3",description:"Long App · AI · Event Space · Studio · Store",manifest:"/manifest.webmanifest",appleWebApp:{capable:true,statusBarStyle:"default",title:"Long App"}};
export const viewport:Viewport={themeColor:"#f5f1ff",viewportFit:"cover"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi" data-theme="lavender"><body><AppShell>{children}</AppShell></body></html>}
