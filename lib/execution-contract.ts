import {createHmac, timingSafeEqual} from "node:crypto";

export type ExecutorKind="api"|"provider"|"device"|"job";
export type ExecutionCommand={invocationId:string;actionId:string;executor:ExecutorKind;adapter:string;input?:Record<string,unknown>};
export type ExecutionReceipt={version:"long-receipt/v1";receiptId:string;invocationId:string;actionId:string;executor:ExecutorKind;adapter:string;status:"success"|"failed"|"gated";issuedAt:string;evidence:Record<string,unknown>;signature:string};
function secret(){const value=process.env.LONG_RECEIPT_SECRET;if(!value||value.length<32)throw new Error("LONG_RECEIPT_SECRET_MISSING");return value}
function payload(receipt:Omit<ExecutionReceipt,"signature">){return JSON.stringify(receipt)}
export function issueReceipt(receipt:Omit<ExecutionReceipt,"signature">):ExecutionReceipt{return{...receipt,signature:createHmac("sha256",secret()).update(payload(receipt)).digest("hex")}}
export function verifyReceipt(receipt:ExecutionReceipt){try{const{signature,...unsigned}=receipt;const expected=createHmac("sha256",secret()).update(payload(unsigned)).digest("hex");return signature.length===expected.length&&timingSafeEqual(Buffer.from(signature),Buffer.from(expected))}catch{return false}}
