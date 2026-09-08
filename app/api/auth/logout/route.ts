import {NextResponse} from "next/server";
export async function POST(){const res=NextResponse.json({ok:true,receiptId:`logout-${crypto.randomUUID()}`});res.cookies.set("long_user_session","",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:0});res.cookies.set("long_auth_receipt","",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:0});return res}
