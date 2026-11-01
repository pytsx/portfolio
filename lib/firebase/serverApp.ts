"use server"
// src/lib/firebase/serverApp.ts
import { cookies, headers } from 'next/headers';
import { initializeServerApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function getFirebaseServer() {
  const headersList = await headers();
  const cookieStore = await cookies();

  // Obtém o token enviado pelo Authorization header (geralmente injetado via Service Worker)
  const session = await cookieStore.get('__session');

  const authIdToken = session ? session.value : headersList.get('Authorization')?.split('Bearer ')[1] || undefined;


  // Inicializa o app do servidor usando o token obtido
  const serverApp = initializeServerApp(firebaseConfig, { authIdToken });
  const auth = getAuth(serverApp);
  
  // Aguarda a sincronização do estado de autenticação antes de prosseguir
  await auth.authStateReady(); 

  return {
    auth,
    db: getFirestore(serverApp),
  };
}
