"use server";

// src/app/lib.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "secret";
const key = new TextEncoder().encode(secretKey);

// Encrypts the payload into a JWT
export async function encrypt(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Session expiration time
    .sign(key);
}

// Decrypts and verifies a JWT
export async function decrypt(token: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(access_token: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration
  const session = await encrypt({ access_token, expires });

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    path: "/",
  });
}

// Clears the session cookie to log the user out
export async function logout() {
  (await cookies()).delete("session");
}

// Retrieves the session data if a valid session cookie exists
export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  return await decrypt(session);
}

// Refreshes the session, extending its expiration
export async function updateSession(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  if (!sessionCookie) return;

  const parsedSession = await decrypt(sessionCookie);
  // update date 1 day from now
  parsedSession.expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsedSession),
    httpOnly: true,
    expires: parsedSession.expires as Date,
    path: "/",
  });
  return res;
}
