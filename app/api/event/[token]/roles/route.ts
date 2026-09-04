import { NextResponse } from "next/server";
import { normalizeEventToken, sql } from "@/lib/event-db";

const allowed=new Set(["organizer","moderator","host","artist","guest"]);

export async function POST(request:Request, context:{params:Promise<{token:string}>}) {
  try{
    const {token:raw}=await context.params; const token=normalizeEventToken(raw);
    const body=await request.json();
    const actingUserId=String(body.actingUserId||"");
    const targetUserId=String(body.targetUserId||"");
    const role=String(body.role||"");
    if(!actingUserId||!targetUserId||!allowed.has(role)) return NextResponse.json({ok:false,error:"Invalid role request"},{status:400});
    const db=sql();
    const events=await db`select id from long_events where public_token=${token} limit 1`;
    if(!events[0]) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
    const eventId=events[0].id;
    const permission=await db`
      select role from long_event_roles
      where event_id=${eventId}::uuid and user_id=${actingUserId} and role in ('owner','organizer')
      limit 1
    `;
    if(!permission[0]) return NextResponse.json({ok:false,error:"Forbidden"},{status:403});
    await db`
      insert into long_event_roles(event_id,user_id,role,invited_by)
      values(${eventId}::uuid,${targetUserId},${role},${actingUserId})
      on conflict do nothing
    `;
    return NextResponse.json({ok:true});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Role update failed"},{status:500})}
}
