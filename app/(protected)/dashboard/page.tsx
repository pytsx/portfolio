// src/app/dashboard/page.tsx
"use server"
import { getFirebaseServer } from '@/lib/firebase/serverApp';
import { collection, getDocs } from 'firebase/firestore';
import { redirect } from 'next/navigation';

import { connection } from 'next/server';
import { Suspense } from 'react';

async function DashboardContent() {
  await connection(); // Aguarda uma requisição real antes de executar o Firebase.
  const { auth, db } = await getFirebaseServer();
  const currentUser = auth.currentUser;

  // Redireciona o usuário se ele não estiver autenticado
  if (!currentUser) {
    redirect('/signin');
  }

  // Consulta ao Firestore realizada com segurança sob as Regras do usuário autenticado
  const querySnapshot = await getDocs(collection(db, `users/${currentUser.uid}/projects`));
  const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return (
    <>
      <h1>Bem-vindo, {currentUser.email}!</h1>
      <h2 className="text-xl mt-4">Seus Projetos:</h2>
      <ul>
        {projects.map((proj: any) => (
          <li key={proj.id}>{proj.name}</li>
        ))}
      </ul>
    </>
  );

}

export default async function DashboardPage() {

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
