import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function PATCH(request:Request, context:{params:Promise<{id:string}>}){
  try{
    const userId=requireUserId(request); const {id}=await context.params; const body=await request.json(); const db=sql();
    const own=await db`select id from long_products where id=${id}::uuid and owner_user_id=${userId} limit 1`;
    if(!own[0])return NextResponse.json({ok:false,error:"Product not found"},{status:404});
    const quantity=Math.max(0,Number(body.quantity||0));
    await db`update long_inventory set quantity=${quantity},updated_at=now() where product_id=${id}::uuid`;
    return NextResponse.json({ok:true,quantity});
  }catch(error){const e=jsonError(error);return NextResponse.json(e.body,{status:e.status})}
}
