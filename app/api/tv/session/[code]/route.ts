import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";

export async function GET(request:Request, context:{params:Promise<{code:string}>}){
  try{
    const {code}=await context.params; const url=new URL(request.url); const role=url.searchParams.get("role")||"controller"; const token=url.searchParams.get("token")||""; const db=sql();
    const rows=await db`select * from long_tv_sessions where code=${code.toUpperCase()} and expires_at>now() limit 1`;
    const s=rows[0]; if(!s)return NextResponse.json({ok:false,error:"Session expired"},{status:404});
    const expected=role==="tv"?s.tv_token:s.controller_token;
    if(!expected||token!==expected)return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
    return NextResponse.json({ok:true,status:s.status,capabilities:s.capabilities,command:s.command,commandSeq:Number(s.command_seq||0),eventId:s.event_id});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"TV session failed"},{status:500})}
}

export async function PATCH(request:Request, context:{params:Promise<{code:string}>}){
  try{
    const {code}=await context.params; const body=await request.json(); const db=sql(); const c=code.toUpperCase();
    if(body.action==="pair"){
      const tvToken=crypto.randomUUID();
      const rows=await db`
        update long_tv_sessions set status='paired',tv_id=${String(body.tvId||crypto.randomUUID())},tv_token=${tvToken},
        capabilities=${JSON.stringify(body.capabilities||{})}::jsonb,updated_at=now()
        where code=${c} and expires_at>now() returning code
      `;
      if(!rows[0])return NextResponse.json({ok:false,error:"Session expired"},{status:404});
      return NextResponse.json({ok:true,tvToken});
    }
    if(body.action==="command"){
      const rows=await db`
        update long_tv_sessions set command=${JSON.stringify(body.command||{})}::jsonb,command_seq=command_seq+1,updated_at=now()
        where code=${c} and controller_token=${String(body.controllerToken||"")} and expires_at>now()
        returning command_seq
      `;
      if(!rows[0])return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
      return NextResponse.json({ok:true,commandSeq:Number(rows[0].command_seq)});
    }
    return NextResponse.json({ok:false,error:"Unknown action"},{status:400});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"TV session update failed"},{status:500})}
}
