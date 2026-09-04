import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function GET(request:Request){
  try{
    const userId=requireUserId(request); const db=sql();
    const rows=await db`
      select id,event_id,category,title,body,action_url,requires_confirmation,status,created_at
      from long_notifications where user_id=${userId}
      order by created_at desc limit 150
    `;
    return NextResponse.json({ok:true,notifications:rows});
  }catch(error){const e=jsonError(error);return NextResponse.json(e.body,{status:e.status})}
}
