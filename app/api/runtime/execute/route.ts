import {NextResponse} from "next/server";
import {executeThroughSixCores} from "@/lib/six-core-runtime";
import {simulate} from "@/lib/runtime-simulator";
import type {ExecutionCommand} from "@/lib/execution-contract";

const kinds=new Set(["api","provider","device","job"]);
export async function POST(request:Request){const body=await request.json().catch(()=>null) as ExecutionCommand|null;if(!body?.invocationId||!body.actionId||!body.adapter||!kinds.has(body.executor))return NextResponse.json({ok:false,code:"INVALID_COMMAND"},{status:400});if(process.env.LONG_RUNTIME_MODE==="simulator")return NextResponse.json(simulate(body));try{const result=await executeThroughSixCores(body);const ok=result.state==="success";return NextResponse.json({...result,ok,receipt:result.executorReceipt},{status:ok?200:409})}catch(error){return NextResponse.json({ok:false,state:"failed",code:"EXECUTOR_ERROR",message:error instanceof Error?error.message:"Executor error"},{status:500})}}
