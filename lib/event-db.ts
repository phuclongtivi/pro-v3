import { neon } from "@neondatabase/serverless";

export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

export function normalizeEventToken(value: string) {
  return value.trim().replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
}

export function requireCronSecret(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const auth = request.headers.get("authorization") || "";
  return auth === `Bearer ${expected}`;
}
