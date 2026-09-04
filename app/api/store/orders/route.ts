import { NextResponse } from "next/server";
import { sql } from "@/lib/event-db";
import { jsonError, requireUserId } from "@/lib/session-user";

export async function GET(request:Request){
  try{
    const userId=requireUserId(request); const db=sql();
    const rows=await db`
      select o.*,p.title from long_orders o join long_products p on p.id=o.product_id
      where o.buyer_user_id=${userId} or o.seller_user_id=${userId}
      order by o.created_at desc limit 200
    `;
    return NextResponse.json({ok:true,orders:rows});
  }catch(error){const e=jsonError(error);return NextResponse.json(e.body,{status:e.status})}
}

export async function POST(request:Request){
  try{
    const buyer=requireUserId(request); const body=await request.json(); const productId=String(body.productId||"");
    const qty=Math.max(1,Math.floor(Number(body.quantity||1))); const db=sql();
    const products=await db`
      select p.owner_user_id,p.price,p.currency,i.quantity,i.reserved
      from long_products p join long_inventory i on i.product_id=p.id
      where p.id=${productId}::uuid and p.status='published' limit 1
    `;
    const p=products[0]; if(!p)return NextResponse.json({ok:false,error:"Product unavailable"},{status:404});
    const available=Number(p.quantity)-Number(p.reserved);
    if(available<qty)return NextResponse.json({ok:false,error:"Insufficient stock"},{status:409});
    await db`update long_inventory set reserved=reserved+${qty},updated_at=now() where product_id=${productId}::uuid`;
    const id=crypto.randomUUID();
    await db`
      insert into long_orders(id,buyer_user_id,seller_user_id,product_id,quantity,unit_price,currency)
      values(${id}::uuid,${buyer},${p.owner_user_id},${productId}::uuid,${qty},${p.price},${p.currency})
    `;
    return NextResponse.json({ok:true,id});
  }catch(error){const e=jsonError(error);return NextResponse.json(e.body,{status:e.status})}
}
