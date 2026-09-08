import {verifySession} from "@/lib/user-auth";

function cookieValue(request:Request,name:string){
  const raw=request.headers.get("cookie")||"";
  const match=raw.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?decodeURIComponent(match[1]):undefined;
}

/** Server-authoritative identity. Client supplied x-long-user-id is ignored. */
export function requireUserId(request: Request) {
  const session=verifySession(cookieValue(request,"long_user_session"));
  if (!session?.userId) throw new Error("LONG_USER_REQUIRED");
  return String(session.userId).slice(0,160);
}

export function jsonError(error: unknown) {
  if (error instanceof Error && error.message === "LONG_USER_REQUIRED") {
    return { status: 401, body: { ok: false, error: "User identity required" } };
  }
  return { status: 500, body: { ok: false, error: error instanceof Error ? error.message : "Unknown error" } };
}
