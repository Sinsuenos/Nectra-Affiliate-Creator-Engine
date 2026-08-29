import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const PINTEREST_APP_ID = process.env.PINTEREST_APP_ID || "1605925";
export const PINTEREST_REDIRECT_URI = process.env.PINTEREST_REDIRECT_URI || "https://nectar-engine.vercel.app/api/pinterest/callback";
export const PINTEREST_API_BASE = "https://api.pinterest.com/v5";
export const PINTEREST_SCOPES = ["boards:read", "boards:write", "pins:read", "pins:write", "user_accounts:read"];

const SESSION_COOKIE = "nectar_pinterest_session";
const STATE_COOKIE = "nectar_pinterest_oauth_state";
const secret = () => process.env.PINTEREST_COOKIE_SECRET || process.env.NEXTAUTH_SECRET || "";

function key() {
  const value = secret();
  if (!value) throw new Error("PINTEREST_COOKIE_SECRET is not configured");
  return createHmac("sha256", value).update("nectar-pinterest-cookie-v1").digest();
}

export function seal(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((part) => part.toString("base64url")).join(".");
}

export function unseal<T>(value: string): T | null {
  try {
    const [ivRaw, tagRaw, encryptedRaw] = value.split(".");
    if (!ivRaw || !tagRaw || !encryptedRaw) return null;
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivRaw, "base64url"));
    decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
    const plain = Buffer.concat([decipher.update(Buffer.from(encryptedRaw, "base64url")), decipher.final()]).toString("utf8");
    return JSON.parse(plain) as T;
  } catch {
    return null;
  }
}

export function makeState() {
  const nonce = randomBytes(24).toString("base64url");
  const mac = createHmac("sha256", key()).update(nonce).digest("base64url");
  return `${nonce}.${mac}`;
}

export function validState(state: string | null, expected: string | undefined) {
  return Boolean(state && expected && state === expected);
}

export async function setOAuthState(state: string) {
  const jar = await cookies();
  jar.set(STATE_COOKIE, state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
}

export async function consumeOAuthState() {
  const jar = await cookies();
  const value = jar.get(STATE_COOKIE)?.value;
  jar.delete(STATE_COOKIE);
  return value;
}

export type PinterestSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  refreshExpiresAt?: number;
  scope: string;
};

export async function getPinterestSession() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  return raw ? unseal<PinterestSession>(raw) : null;
}

export async function savePinterestSession(session: PinterestSession) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, seal(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(60, Math.floor(((session.refreshExpiresAt || session.expiresAt) - Date.now()) / 1000)),
  });
}

export async function clearPinterestSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function exchangeCode(code: string): Promise<PinterestSession> {
  const clientSecret = process.env.PINTEREST_APP_SECRET;
  if (!clientSecret) throw new Error("PINTEREST_APP_SECRET is not configured");
  const body = new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: PINTEREST_REDIRECT_URI });
  const response = await fetch(`${PINTEREST_API_BASE}/oauth/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${PINTEREST_APP_ID}:${clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || `Pinterest token exchange failed (${response.status})`);
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + Number(data.expires_in || 2592000) * 1000,
    refreshExpiresAt: data.refresh_token_expires_in ? Date.now() + Number(data.refresh_token_expires_in) * 1000 : undefined,
    scope: String(data.scope || ""),
  };
}

export async function refreshPinterestSession(session: PinterestSession) {
  if (!session.refreshToken) return session;
  const clientSecret = process.env.PINTEREST_APP_SECRET;
  if (!clientSecret) throw new Error("PINTEREST_APP_SECRET is not configured");
  const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token: session.refreshToken });
  const response = await fetch(`${PINTEREST_API_BASE}/oauth/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${PINTEREST_APP_ID}:${clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || `Pinterest token refresh failed (${response.status})`);
  const refreshed: PinterestSession = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || session.refreshToken,
    expiresAt: Date.now() + Number(data.expires_in || 2592000) * 1000,
    refreshExpiresAt: data.refresh_token_expires_in ? Date.now() + Number(data.refresh_token_expires_in) * 1000 : session.refreshExpiresAt,
    scope: String(data.scope || session.scope),
  };
  await savePinterestSession(refreshed);
  return refreshed;
}

export async function getUsablePinterestSession() {
  const session = await getPinterestSession();
  if (!session) return null;
  if (Date.now() < session.expiresAt - 60_000) return session;
  return refreshPinterestSession(session);
}

export async function pinterestFetch<T>(path: string, init: RequestInit = {}) {
  const session = await getUsablePinterestSession();
  if (!session) throw new Error("PINTEREST_NOT_CONNECTED");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  headers.set("Content-Type", "application/json");
  const response = await fetch(`${PINTEREST_API_BASE}${path}`, { ...init, headers, cache: "no-store" });
  const text = await response.text();
  let data: unknown = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data ? String((data as { message?: unknown }).message) : `Pinterest API error (${response.status})`;
    const error = new Error(message) as Error & { status?: number; details?: unknown };
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data as T;
}
