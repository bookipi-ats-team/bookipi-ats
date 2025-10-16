import { createHmac, timingSafeEqual } from "crypto";

/**
 * Extracts the auth token from a Bearer authorization header.
 * Returns the token string if header is in the form "Bearer <token>", otherwise undefined.
 */
export function extractAuthToken(
  authorization?: string | string[] | undefined,
): string | undefined {
  if (!authorization) return undefined;
  const header = Array.isArray(authorization) ? authorization[0] : authorization;
  const match = header.match(/^\s*Bearer\s+(.+)$/i);
  return match ? match[1] : undefined;
}

/**
 * Extracts the first and last name from a full name string.
 * Returns an object with firstName and lastName properties.
 */
export function extractNameFromFullName(fullName?: string) {
  if (!fullName) {
    return { firstName: "", lastName: "" };
  }

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  const lastName = parts.length > 1 ? parts.pop()! : "";
  const firstName = parts.join(" ");

  return { firstName, lastName };
}

export function base64UrlEncode(input: string | Buffer) {
  return Buffer.isBuffer(input)
    ? input.toString("base64url")
    : Buffer.from(input).toString("base64url");
}

export function signJwt(
  payload: Record<string, any>,
  secret: string,
  expiresInSeconds = 60 * 60 * 24 * 7,
) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedBody}`;

  const signature = createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifyJwt(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedBody, signature] = parts;
    const data = `${encodedHeader}.${encodedBody}`;

    const expected = createHmac("sha256", secret).update(data).digest("base64url");

    // timing-safe compare
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;

    const payloadJson = Buffer.from(encodedBody, "base64url").toString();
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now >= payload.exp) return null;

    return payload as Record<string, any>;
  } catch (err) {
    return null;
  }
}
