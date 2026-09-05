import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function POST(request:Request, context:{params:Promise<{id:string}>}) {
  try {
    const userId=requireUserId(request); const {id}=await context.params; const db=sql();
    const rows=await db`
      update long_ai_jobs set status='queued',approved_by=${userId},approved_at=now(),updated_at=now()
      where id=${id}::uuid and owner_user_id=${userId} and status='pending_approval'
      returning id
    `;
    if(!rows[0]) return NextResponse.json({ok:false,error:"Job cannot be approved"},{status:409});
    return NextResponse.json({ok:true});
  } catch(error) {
    const e=jsonError(error); return NextResponse.json(e.body,{status:e.status});
  }
}
