import {cookies} from "next/headers";
import {providerStatus,verifySession,type AuthProvider} from "@/lib/user-auth";
export async function GET(){const session=verifySession((await cookies()).get("long_user_session")?.value);return Response.json({ok:true,providers:["google","facebook","zalo","apple"].map(x=>providerStatus(x as AuthProvider)),session:session?{provider:session.provider,name:session.name,email:session.email,picture:session.picture}:null})}
