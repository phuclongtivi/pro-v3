"use client";
import AuthLoginPanel from "@/components/AuthLoginPanel";
export default function Page(){return <AuthLoginPanel lang="vi" initialMode="login" onBack={()=>location.assign("/me")}/>}
