import { NextResponse } from "next/server";
import { normalizeEventToken, sql } from "@/lib/event-db";

export async function POST(request:Request, context:{params:Promise<{token:string}>}) {
  try {
    const {token:raw}=await context.params;
    const token=normalizeEventToken(raw);
    const body=await request.json();
    const displayName=String(body.displayName||"Guest").trim().slice(0,80) || "Guest";
    const accountId=body.accountId?String(body.accountId):null;
    const memberId=String(body.memberId||crypto.randomUUID());
    const db=sql();

    const events=await db`select id, starts_at, ends_at from long_events where public_token=${token} limit 1`;
    if(!events[0]) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
    const eventId=events[0].id;

    let role="audience";
    if(accountId){
      const roles=await db`
        select role from long_event_roles
        where event_id=${eventId}::uuid and user_id=${accountId}
        order by case role
          when 'owner' then 1 when 'organizer' then 2 when 'moderator' then 3
          when 'host' then 4 when 'artist' then 5 when 'guest' then 6 else 9 end
        limit 1
      `;
      if(roles[0]?.role) role=String(roles[0].role);
    }

    await db`
      insert into long_event_members(event_id, member_id, account_id, display_name, member_type, role, joined_at, last_seen_at, left_at)
      values(${eventId}::uuid, ${memberId}, ${accountId}, ${displayName}, ${accountId?'account':'guest'}, ${role}, now(), now(), null)
      on conflict(event_id, member_id) do update
      set display_name=excluded.display_name, account_id=excluded.account_id, role=excluded.role,
          last_seen_at=now(), left_at=null
    `;
    return NextResponse.json({ok:true,memberId,role,eventId});
  } catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Join failed"},{status:500});
  }
}
