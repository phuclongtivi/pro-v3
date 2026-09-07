import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const creatorId = String(body.creatorId || "local-owner");
    const startsAt = new Date(String(body.startsAt || ""));
    const endsAt = new Date(String(body.endsAt || ""));

    if (!title) return NextResponse.json({ ok:false, error:"Title is required" }, { status:400 });
    if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime()) || endsAt <= startsAt) {
      return NextResponse.json({ ok:false, error:"Invalid event time" }, { status:400 });
    }

    const eventId = crypto.randomUUID();
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 18);
    const db = sql();

    await db`
      insert into long_events
        (id, public_token, title, description, starts_at, ends_at, creator_id,
         chat_enabled, pre_event_chat_enabled)
      values
        (${eventId}::uuid, ${token}, ${title}, ${String(body.description || "")},
         ${startsAt.toISOString()}::timestamptz, ${endsAt.toISOString()}::timestamptz,
         ${creatorId}, ${Boolean(body.chatEnabled ?? true)}, ${Boolean(body.preEventChatEnabled ?? false)})
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
