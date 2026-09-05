import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireCronSecret, sql } from "@/lib/event-db";

export async function GET(request:Request){
  if(!requireCronSecret(request)) return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  try{
    const db=sql();
    const expired=await db`
      select id from long_events
      where delete_chat_at <= now()
        and exists(select 1 from long_event_messages m where m.event_id=long_events.id)
      limit 100
    `;
    let eventsCleaned=0, blobsDeleted=0;
    for(const e of expired){
      const files=await db`
        select attachment_url from long_event_messages
        where event_id=${e.id}::uuid and attachment_url is not null
      `;
      const urls=files.map((x:any)=>String(x.attachment_url)).filter(Boolean);
      if(urls.length){ await del(urls); blobsDeleted+=urls.length; }
      await db`delete from long_event_messages where event_id=${e.id}::uuid`;
      await db`delete from long_event_members where event_id=${e.id}::uuid`;
      eventsCleaned++;
    }
    return NextResponse.json({ok:true,eventsCleaned,blobsDeleted});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Cleanup failed"},{status:500})}
}
