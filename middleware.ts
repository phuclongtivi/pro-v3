import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
export function middleware(req:NextRequest){if(req.nextUrl.pathname.startsWith("/boss")&&!req.nextUrl.pathname.startsWith("/boss/login")&&!req.cookies.get("long_boss_session")){const u=req.nextUrl.clone();u.pathname="/boss/login";return NextResponse.redirect(u)}return NextResponse.next()}
export const config={matcher:["/boss/:path*"]};
