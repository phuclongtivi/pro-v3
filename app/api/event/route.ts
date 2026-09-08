import { NextResponse } from "next/server";
import {cookies} from "next/headers";
import { sql } from "@/lib/event-db";
import {verifySession} from "@/lib/user-auth";

export async function GET(request:Request){
  try{
    const filter=String(new URL(request.url).searchParams.get("filter")||"gift");
    if(!new Set(["gift","no-gift","ticket"]).has(filter))return NextResponse.json({ok:false,error:"INVALID_FILTER"},{status:400});
    const db=sql();
    const rows=await db`
      select id,public_token,title,description,starts_at,ends_at,event_type,event_format,has_gift,has_ticket,status,location
      from long_events
      where visibility='public' and status in ('published','live')
        and (${filter}='gift' and has_gift=true or ${filter}='no-gift' and has_gift=false or ${filter}='ticket' and has_ticket=true)
      order by case when status='live' then 0 else 1 end,starts_at asc limit 200
    `;
    return NextResponse.json({ok:true,events:rows});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Event list failed"},{status:500})}
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const session=verifySession((await cookies()).get("long_user_session")?.value);
    if(!session?.userId)return NextResponse.json({ok:false,error:"LOGIN_REQUIRED"},{status:401});
    const creatorId = String(session.userId);
    const startsAt = new Date(String(body.startsAt || ""));
    const endsAt = new Date(String(body.endsAt || ""));
    const eventType = String(body.eventType || "community");
    const eventFormat = String(body.eventFormat || "offline");
    const visibility = String(body.visibility || "public");
    const hasGift=Boolean(body.hasGift);
    const hasTicket=Boolean(body.hasTicket);
    const timezone = String(body.timezone || "Asia/Ho_Chi_Minh");
    const allowedTypes = new Set(["conference","stage_show","livestream","sales","training","community","private"]);
    const allowedFormats = new Set(["offline","online","hybrid"]);
    const allowedVisibility = new Set(["public","unlisted","private"]);

    if (!title) return NextResponse.json({ ok:false, error:"Title is required" }, { status:400 });
    if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime()) || endsAt <= startsAt) {
      return NextResponse.json({ ok:false, error:"Invalid event time" }, { status:400 });
    }
    if (!allowedTypes.has(eventType) || !allowedFormats.has(eventFormat) || !allowedVisibility.has(visibility)) {
      return NextResponse.json({ok:false,error:"Invalid event filter fields"},{status:400});
    }

    const eventId = crypto.randomUUID();
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 18);
    const db = sql();

    await db`
      insert into long_events
        (id, public_token, title, description, starts_at, ends_at, creator_id,
         chat_enabled, pre_event_chat_enabled, event_type, event_format, visibility, timezone, location, has_gift, has_ticket)
      values
        (${eventId}::uuid, ${token}, ${title}, ${String(body.description || "")},
         ${startsAt.toISOString()}::timestamptz, ${endsAt.toISOString()}::timestamptz,
         ${creatorId}, ${Boolean(body.chatEnabled ?? true)}, ${Boolean(body.preEventChatEnabled ?? false)},
         ${eventType}, ${eventFormat}, ${visibility}, ${timezone}, ${String(body.location || "").trim()}, ${hasGift}, ${hasTicket})
    `;

    await db`
      insert into long_event_roles(event_id, user_id, role, invited_by)
      values (${eventId}::uuid, ${creatorId}, 'owner', ${creatorId})
      on conflict do nothing
    `;

    return NextResponse.json({
      ok:true,
      eventId,
      publicToken:token,
      eventUrl:`/event/${token}`,
      qrPayload:`https://mobi.phuclong.live/event/${token}`
    });
  } catch (error) {
    return NextResponse.json({ ok:false, error:error instanceof Error?error.message:"Create event failed" }, { status:500 });
  }
}
