
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || "default-secret-for-development";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // This will be caught for expired tokens, invalid tokens, etc.
    console.error('Failed to decrypt session:', error);
    return null;
  }
}
