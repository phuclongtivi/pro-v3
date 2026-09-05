import { NextResponse } from "next/server";
import { normalizeEventToken, sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function POST(request:Request, context:{params:Promise<{token:string}>}){
  try{
    const accountId=requireUserId(request); const {token:raw}=await context.params; const token=normalizeEventToken(raw);
    const body=await request.json(); const memberId=String(body.memberId||"");
    if(!memberId) return NextResponse.json({ok:false,error:"memberId required"},{status:400});
    const db=sql();
    const events=await db`select id from long_events where public_token=${token} limit 1`;
    if(!events[0]) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
    const eventId=events[0].id;
    const roles=await db`select role from long_event_roles where event_id=${eventId}::uuid and user_id=${accountId} limit 1`;
    const role=roles[0]?.role || 'audience';
    const rows=await db`
      update long_event_members set account_id=${accountId},member_type='account',role=${role},last_seen_at=now()
      where event_id=${eventId}::uuid and member_id=${memberId}
      returning member_id
    `;
    if(!rows[0]) return NextResponse.json({ok:false,error:"Guest membership not found"},{status:404});
    return NextResponse.json({ok:true,role});
  }catch(error){const e=jsonError(error);return NextResponse.json(e.body,{status:e.status})}
}
