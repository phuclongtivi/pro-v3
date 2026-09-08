import {sql} from "@/lib/event-db";
import {cookies} from "next/headers";
import {providerStatus,verifySession,type AuthProvider} from "@/lib/user-auth";
export async function GET(){let storageReady=false;try{const rows=await sql()`select to_regclass('public.long_users') as users,to_regclass('public.long_oauth_accounts') as accounts`;storageReady=Boolean(rows[0]?.users&&rows[0]?.accounts)}catch{}const session=verifySession((await cookies()).get("long_user_session")?.value);return Response.json({ok:true,providers:["google","facebook","zalo","apple"].map(x=>({...providerStatus(x as AuthProvider),configured:storageReady&&providerStatus(x as AuthProvider).configured})),session:session?{provider:session.provider,name:session.name,email:session.email,picture:session.picture}:null})}
