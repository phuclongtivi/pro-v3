import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function GET(request:Request, context:{params:Promise<{id:string}>}) {
  try {
    const userId=requireUserId(request); const {id}=await context.params; const db=sql();
    const rows=await db`
      select * from long_ai_jobs where id=${id}::uuid and owner_user_id=${userId} limit 1
    `;
    if(!rows[0]) return NextResponse.json({ok:false,error:"Job not found"},{status:404});
    return NextResponse.json({ok:true,job:rows[0]});
  } catch(error) {
    const e=jsonError(error); return NextResponse.json(e.body,{status:e.status});
  }
}
