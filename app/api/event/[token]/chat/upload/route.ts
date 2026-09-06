import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { normalizeEventToken, sql } from "@/lib/event-db";

const MAX=3*1024*1024;

export async function POST(request:Request, context:{params:Promise<{token:string}>}) {
  try{
    const {token:raw}=await context.params; const token=normalizeEventToken(raw);
    const form=await request.formData();
    const file=form.get("file");
    const memberId=String(form.get("memberId")||"");
    if(!(file instanceof File) || !memberId) return NextResponse.json({ok:false,error:"file and memberId required"},{status:400});
    if(file.size>MAX) return NextResponse.json({ok:false,error:"File exceeds 3MB limit"},{status:413});

    const db=sql();
    const events=await db`
      select id, starts_at, ends_at, chat_enabled, pre_event_chat_enabled, delete_chat_at
      from long_events where public_token=${token} limit 1
    `;
    const event=events[0];
    if(!event) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
    const now=Date.now(), start=new Date(event.starts_at).getTime(), end=new Date(event.ends_at).getTime(), deleteAt=new Date(event.delete_chat_at).getTime();
    if(now>=deleteAt) return NextResponse.json({ok:false,error:"Chat room deleted"},{status:410});
    if(!event.chat_enabled || (now<start && !event.pre_event_chat_enabled) || now>end) return NextResponse.json({ok:false,error:"Chat is read-only or closed"},{status:403});

    const members=await db`select display_name, role from long_event_members where event_id=${event.id}::uuid and member_id=${memberId} limit 1`;
    if(!members[0]) return NextResponse.json({ok:false,error:"Join event first"},{status:403});

    const safeName=file.name.replace(/[^A-Za-z0-9._-]/g,"_").slice(-120);
    const blob=await put(`event-chat/${event.id}/${crypto.randomUUID()}-${safeName}`,file,{access:"public",addRandomSuffix:false});
    const id=crypto.randomUUID();
    await db`
      insert into long_event_messages(id,event_id,member_id,display_name,role,kind,attachment_url,attachment_name,attachment_size)
      values(${id}::uuid,${event.id}::uuid,${memberId},${members[0].display_name},${members[0].role},'file',${blob.url},${file.name},${file.size})
    `;
    return NextResponse.json({ok:true,id,url:blob.url,name:file.name,size:file.size});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Upload failed"},{status:500})}
}
