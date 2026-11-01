'use server';
import { cookies } from 'next/headers';

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  cookieStore.set('__session', idToken, {
    maxAge: 60 * 60 * 24 * 1, // Ex: Expira em 1 dia
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('__session');
}
