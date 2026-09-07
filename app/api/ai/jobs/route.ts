import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

const allowed = new Set([
  "REMIND_USER","REMIND_GUEST","CHECK_EVENT_HEALTH","SUMMARIZE_CHAT",
  "PREPARE_NEXT_SEGMENT","CHECK_TV_OUTPUT","CHECK_MEDIA_READY",
  "GENERATE_EVENT_REPORT","SUGGEST_ACTION","MODERATION_ALERT"
]);

export async function GET(request: Request) {
  try {
    const userId = requireUserId(request);
    const db = sql();
    const rows = await db`
      select id,event_id,job_type,status,requires_approval,payload,result,approved_by,approved_at,created_at
      from long_ai_jobs where owner_user_id=${userId}
      order by created_at desc limit 100
    `;
    return NextResponse.json({ok:true,jobs:rows});
  } catch (error) {
    const e=jsonError(error); return NextResponse.json(e.body,{status:e.status});
  }
}

export async function POST(request: Request) {
  try {
    const userId = requireUserId(request);
    const body = await request.json();
    const jobType = String(body.jobType || "");
    if (!allowed.has(jobType)) return NextResponse.json({ok:false,error:"Unsupported AI job"},{status:400});
    const id = crypto.randomUUID();
    const db = sql();
    await db`
      insert into long_ai_jobs(id,event_id,owner_user_id,job_type,status,requires_approval,payload)
      values(
        ${id}::uuid,
        ${body.eventId || null}::uuid,
        ${userId},
        ${jobType},
        ${Boolean(body.requiresApproval ?? true) ? 'pending_approval' : 'queued'},
        ${Boolean(body.requiresApproval ?? true)},
        ${JSON.stringify(body.payload || {})}::jsonb
      )
    `;
    return NextResponse.json({ok:true,id});
  } catch (error) {
    const e=jsonError(error); return NextResponse.json(e.body,{status:e.status});
  }
}
