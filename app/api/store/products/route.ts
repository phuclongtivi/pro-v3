import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function GET(request:Request){
  try{
    const url=new URL(request.url); const mine=url.searchParams.get("mine")==="1"; const db=sql();
    if(mine){
      const userId=requireUserId(request);
      const rows=await db`
        select p.*,i.sku,i.quantity,i.reserved from long_products p left join long_inventory i on i.product_id=p.id
        where p.owner_user_id=${userId} order by p.created_at desc
      `;
      return NextResponse.json({ok:true,products:rows});
    }
    const rows=await db`
      select p.*,i.sku,i.quantity,i.reserved from long_products p left join long_inventory i on i.product_id=p.id
      where p.status='published' order by p.created_at desc limit 200
    `;
    return NextResponse.json({ok:true,products:rows});
  }catch(error){const e=jsonError(error);return NextResponse.json(e.body,{status:e.status})}
}

export async function POST(request:Request){
  try{
    const userId=requireUserId(request); const body=await request.json();
    const title=String(body.title||"").trim(); if(!title)return NextResponse.json({ok:false,error:"Title required"},{status:400});
    const id=crypto.randomUUID(), db=sql();
    await db`
      insert into long_products(id,owner_user_id,store_name,title,description,price,currency,status,media_url)
      values(${id}::uuid,${userId},${String(body.storeName||"Long Store")},${title},${String(body.description||"")},
             ${Number(body.price||0)},${String(body.currency||"VND")},${String(body.status||"draft")},${body.mediaUrl||null})
    `;
    await db`
      insert into long_inventory(product_id,sku,quantity,reserved)
      values(${id}::uuid,${String(body.sku||`SKU-${id.slice(0,8)}`)},${Math.max(0,Number(body.quantity||0))},0)
    `;
    return NextResponse.json({ok:true,id});
  }catch(error){const e=jsonError(error);return NextResponse.json(e.body,{status:e.status})}
}
