export function requireUserId(request: Request) {
  const value = request.headers.get("x-long-user-id")?.trim();
  if (!value) throw new Error("LONG_USER_REQUIRED");
  return value.slice(0, 160);
}

export function jsonError(error: unknown) {
  if (error instanceof Error && error.message === "LONG_USER_REQUIRED") {
    return { status: 401, body: { ok: false, error: "User identity required" } };
  }
  return { status: 500, body: { ok: false, error: error instanceof Error ? error.message : "Unknown error" } };
}
