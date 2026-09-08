import {createHmac} from "node:crypto";
export type DynamicQrPayload={version:"long-dynamic-qr/v1";eventToken:string;activityType:string;activityRef:string|null;issuedAt:number;expiresAt:number};
function key(){const value=process.env.LONG_QR_SECRET;if(!value||value.length<32)throw new Error("LONG_QR_SECRET_MISSING");return value}
export function issueDynamicQr(input:Omit<DynamicQrPayload,"version"|"issuedAt"|"expiresAt">){const issuedAt=Math.floor(Date.now()/1000);const payload:DynamicQrPayload={version:"long-dynamic-qr/v1",...input,issuedAt,expiresAt:issuedAt+60};const encoded=Buffer.from(JSON.stringify(payload)).toString("base64url");const signature=createHmac("sha256",key()).update(encoded).digest("base64url");return{payload,token:`${encoded}.${signature}`}}
