import { NextResponse } from "next/server";
import { normalizeEventToken, sql } from "@/lib/event-db";

export async function GET(_:Request, context:{params:Promise<{token:string}>}) {
  try{
    const {token:raw}=await context.params; const token=normalizeEventToken(raw); const db=sql();
    const rows=await db`
      select m.member_id, m.display_name, m.role, m.last_seen_at
      from long_event_members m join long_events e on e.id=m.event_id
      where e.public_token=${token}
        and m.last_seen_at > now() - interval '45 seconds'
        and m.left_at is null
      order by m.last_seen_at desc limit 500
    `;
    return NextResponse.json({ok:true,online:rows});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Presence failed"},{status:500})}
}

export async function POST(request:Request, context:{params:Promise<{token:string}>}) {
  try{
    const {token:raw}=await context.params; const token=normalizeEventToken(raw);
    const body=await request.json(); const memberId=String(body.memberId||""); const action=String(body.action||"heartbeat");
    if(!memberId) return NextResponse.json({ok:false,error:"memberId required"},{status:400});
    const db=sql();
    if(action==="leave"){
      await db`
        update long_event_members m set left_at=now(), last_seen_at=now()
        from long_events e where m.event_id=e.id and e.public_token=${token} and m.member_id=${memberId}
      `;
    } else {
      await db`
        update long_event_members m set last_seen_at=now(), left_at=null
        from long_events e where m.event_id=e.id and e.public_token=${token} and m.member_id=${memberId}
      `;
    }
    return NextResponse.json({ok:true});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Presence update failed"},{status:500})}
}
