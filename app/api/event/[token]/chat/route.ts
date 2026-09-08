import { NextResponse } from "next/server";
import { normalizeEventToken, sql } from "@/lib/event-db";

async function eventForToken(token:string){
  const db=sql();
  const rows=await db`
    select id, starts_at, ends_at, chat_enabled, pre_event_chat_enabled, delete_chat_at
    from long_events where public_token=${token} limit 1
  `;
  return rows[0] || null;
}

export async function GET(request:Request, context:{params:Promise<{token:string}>}) {
  try{
    const {token:raw}=await context.params; const token=normalizeEventToken(raw);
    const event=await eventForToken(token);
    if(!event) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
    if(new Date(event.delete_chat_at).getTime() <= Date.now()) return NextResponse.json({ok:true,messages:[],expired:true});
    const url=new URL(request.url); const after=url.searchParams.get("after");
    const db=sql();
    const rows=after?
      await db`select id, member_id, display_name, role, kind, body, attachment_url, attachment_name, attachment_size, created_at
               from long_event_messages where event_id=${event.id}::uuid and deleted_at is null and created_at>${after}::timestamptz order by created_at asc limit 200`:
      await db`select id, member_id, display_name, role, kind, body, attachment_url, attachment_name, attachment_size, created_at
               from long_event_messages where event_id=${event.id}::uuid and deleted_at is null order by created_at desc limit 100`;
    return NextResponse.json({ok:true,messages:after?rows:[...rows].reverse(),expired:false});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Chat read failed"},{status:500})}
}

export async function POST(request:Request, context:{params:Promise<{token:string}>}) {
  try{
    const {token:raw}=await context.params; const token=normalizeEventToken(raw);
    const body=await request.json(); const memberId=String(body.memberId||""); const text=String(body.body||"").trim().slice(0,4000);
    if(!memberId || !text) return NextResponse.json({ok:false,error:"memberId and body required"},{status:400});
    const event=await eventForToken(token);
    if(!event) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
    const now=Date.now(), start=new Date(event.starts_at).getTime(), end=new Date(event.ends_at).getTime(), deleteAt=new Date(event.delete_chat_at).getTime();
    if(now>=deleteAt) return NextResponse.json({ok:false,error:"Chat room deleted"},{status:410});
    if(!event.chat_enabled || (now<start && !event.pre_event_chat_enabled) || now>end) return NextResponse.json({ok:false,error:"Chat is read-only or closed"},{status:403});
    const db=sql();
    const members=await db`
      select display_name, role from long_event_members
      where event_id=${event.id}::uuid and member_id=${memberId} limit 1
    `;
    if(!members[0]) return NextResponse.json({ok:false,error:"Join event first"},{status:403});
    const id=crypto.randomUUID();
    await db`
      insert into long_event_messages(id,event_id,member_id,display_name,role,kind,body)
      values(${id}::uuid,${event.id}::uuid,${memberId},${members[0].display_name},${members[0].role},'text',${text})
    `;
    return NextResponse.json({ok:true,id});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Chat send failed"},{status:500})}
}
