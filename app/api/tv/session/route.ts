import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function POST(request:Request){
  try{
    const userId=requireUserId(request); const body=await request.json().catch(()=>({})); const db=sql();
    const code=crypto.randomUUID().replace(/-/g,"").slice(0,8).toUpperCase();
    const token=crypto.randomUUID();
    await db`
      insert into long_tv_sessions(code,event_id,status,controller_id,controller_token,command_seq,expires_at)
      values(${code},${body.eventId||null}::uuid,'waiting',${userId},${token},0,now()+interval '30 minutes')
    `;
    return NextResponse.json({ok:true,code,controllerToken:token,pairUrl:`https://tivi.phuclong.live/?pair=${code}`});
  }catch(error){const e=jsonError(error);return NextResponse.json(e.body,{status:e.status})}
}
