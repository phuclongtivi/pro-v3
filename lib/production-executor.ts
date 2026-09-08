import {randomUUID} from "node:crypto";
import {issueReceipt,type ExecutionCommand} from "@/lib/execution-contract";

type AdapterResult={ok:boolean;code:string;evidence?:Record<string,unknown>};
type ProductionResult={ok:true;mode:"production";state:"success";receipt:ReturnType<typeof issueReceipt>;code?:never;message?:never}|{ok:false;mode:"production";state:"gated";code:string;message:string;evidence?:Record<string,unknown>;receipt?:never};
async function executeAdapter(command:ExecutionCommand):Promise<AdapterResult>{
 if(command.adapter==="internal-ui"){
  const signature=`${command.actionId}:${String(command.input?.label||"")}`;
  if(/payment|checkout|publish|delete|refund|take.live|go.live|open.sale|logout|thanh toán|hoàn tiền|xóa|đăng xuất|phát live/i.test(signature))return{ok:false,code:"INTERNAL_UI_SCOPE_DENIED"};
  if(!/(back|close|open|select|choose|tab|menu|theme|language|filter|refresh|retry|view|toggle|quay|chọn|đóng|mở|xem)/i.test(signature))return{ok:false,code:"INTERNAL_UI_SCOPE_DENIED"};
  return{ok:true,code:"UI_ACTION_APPLIED",evidence:{kind:"internal-ui",resultCode:"UI_ACTION_APPLIED",input:command.input||{}}};
 }
 if(command.executor==="device")return{ok:false,code:"DEVICE_SESSION_REQUIRED",evidence:{adapter:command.adapter}};
 if(command.executor==="provider")return{ok:false,code:"PROVIDER_OAUTH_REQUIRED",evidence:{adapter:command.adapter}};
 if(command.executor==="job")return{ok:false,code:"JOB_WORKER_REQUIRED",evidence:{adapter:command.adapter}};
 return{ok:false,code:"API_ADAPTER_NOT_CONFIGURED",evidence:{adapter:command.adapter}};
}
export async function executeProduction(command:ExecutionCommand):Promise<ProductionResult>{const result=await executeAdapter(command);if(!result.ok)return{ok:false,mode:"production",state:"gated",code:result.code,message:"Executor chưa trả về bằng chứng hoàn tất; hệ thống không ghi success.",evidence:result.evidence};const issuedAt=new Date().toISOString();return{ok:true,mode:"production",state:"success",receipt:issueReceipt({version:"long-receipt/v1",receiptId:randomUUID(),invocationId:command.invocationId,actionId:command.actionId,executor:command.executor,adapter:command.adapter,status:"success",issuedAt,evidence:result.evidence||{}})}}
