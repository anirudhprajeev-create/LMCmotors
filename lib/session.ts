
'use server';
import { cookies } from 'next/headers';
import { encrypt, decrypt } from '@/lib/crypto';

export async function createSession() {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ expires });
  cookies().set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
}

export async function verifySession() {
    const cookieStore = cookies();
    const cookie = cookieStore.get('session')?.value;
    if (!cookie) {
        return { isAuth: false };
    }

    const session = await decrypt(cookie);
    if (!session) {
         return { isAuth: false };
    }
    
    return { isAuth: true };
}


export async function deleteSession() {
  cookies().delete('session');
}
