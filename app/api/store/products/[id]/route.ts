import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function PATCH(request:Request, context:{params:Promise<{id:string}>}){
  try{
    const userId=requireUserId(request); const {id}=await context.params; const body=await request.json(); const db=sql();
    const rows=await db`
      update long_products set
        title=coalesce(${body.title??null},title),
        description=coalesce(${body.description??null},description),
        price=coalesce(${body.price??null},price),
        status=coalesce(${body.status??null},status),
        media_url=coalesce(${body.mediaUrl??null},media_url),
        updated_at=now()
      where id=${id}::uuid and owner_user_id=${userId}
      returning id
    `;
    if(!rows[0])return NextResponse.json({ok:false,error:"Product not found"},{status:404});
    return NextResponse.json({ok:true});
  }catch(error){const e=jsonError(error);return NextResponse.json(e.body,{status:e.status})}
}
