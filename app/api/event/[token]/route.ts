import { NextResponse } from "next/server";
import { normalizeEventToken, sql } from "@/lib/event-db";

export async function GET(_: Request, context:{params:Promise<{token:string}>}) {
  try {
    const {token:raw}=await context.params;
    const token=normalizeEventToken(raw);
    const db=sql();
    const rows=await db`
      select id, public_token, title, description, starts_at, ends_at, status, visibility,
             chat_enabled, pre_event_chat_enabled, delete_chat_at
      from long_events where public_token=${token} limit 1
    `;
    const event=rows[0];
    if(!event) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
    const now=Date.now(), starts=new Date(event.starts_at).getTime(), ends=new Date(event.ends_at).getTime();
    const phase=now<starts?"PRE_EVENT":now<=ends?"LIVE":"POST_EVENT";
    return NextResponse.json({ok:true,event:{...event,phase}});
  } catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Read event failed"},{status:500});
  }
}
