import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function POST(request:Request, context:{params:Promise<{id:string}>}) {
  try {
    const userId=requireUserId(request); const {id}=await context.params; const db=sql();
    const jobs=await db`
      select * from long_ai_jobs where id=${id}::uuid and owner_user_id=${userId} limit 1
    `;
    const job=jobs[0];
    if(!job) return NextResponse.json({ok:false,error:"Job not found"},{status:404});
    if(!['queued','running'].includes(String(job.status))) {
      return NextResponse.json({ok:false,error:"Job is not executable"},{status:409});
    }

    await db`update long_ai_jobs set status='running',updated_at=now() where id=${id}::uuid`;

    let result:any={jobType:job.job_type,executedAt:new Date().toISOString()};
    if(job.job_type==='GENERATE_EVENT_REPORT' && job.event_id){
      const stats=await db`
        select
          (select count(*) from long_event_members where event_id=${job.event_id}::uuid) as members,
          (select count(*) from long_event_messages where event_id=${job.event_id}::uuid) as messages,
          (select count(*) from long_orders where buyer_user_id=${userId} or seller_user_id=${userId}) as related_orders
      `;
      result={...result,summary:stats[0]};
    } else if(job.job_type==='CHECK_EVENT_HEALTH' && job.event_id){
      const event=await db`select title,starts_at,ends_at,status from long_events where id=${job.event_id}::uuid limit 1`;
      const online=await db`select count(*) as online from long_event_members where event_id=${job.event_id}::uuid and last_seen_at>now()-interval '45 seconds' and left_at is null`;
      result={...result,event:event[0]||null,online:Number(online[0]?.online||0)};
    } else {
      result={...result,note:"Core job executed. Connect an external model provider in Build 4/Release Candidate for generative output."};
    }

    await db`
      update long_ai_jobs set status='completed',result=${JSON.stringify(result)}::jsonb,updated_at=now()
      where id=${id}::uuid
    `;

    const nid=crypto.randomUUID();
    await db`
      insert into long_notifications(id,user_id,event_id,category,title,body,action_url,status)
      values(${nid}::uuid,${userId},${job.event_id}::uuid,'ai','AI hoàn thành tác vụ',
             ${`Job ${job.job_type} đã hoàn thành.`},${`/me?notification=${nid}`},'unread')
    `;

    return NextResponse.json({ok:true,result});
  } catch(error) {
    const e=jsonError(error); return NextResponse.json(e.body,{status:e.status});
  }
}
