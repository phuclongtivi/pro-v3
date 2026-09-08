import {cookies} from "next/headers";
import registry from "@/reports/action-registry.json";

export async function GET(){
  const session=(await cookies()).get("long_boss_session");
  if(!session)return Response.json({ok:false,error:"UNAUTHORIZED"},{status:401});
  return Response.json({ok:true,registry,policy:{proposalMinimumDays:7,lowUsageMaximum:2,autoModifyNavigation:false}});
}
