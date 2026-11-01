'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { setSessionCookie } from '../../../cookies/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      // Envia o token para a Server Action salvar no cookie __session
      await setSessionCookie(token);
      
      router.push('/dashboard');
    } catch (error) {
      alert("Erro ao fazer login: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col p-2 space-y-2" >
      <h2>Entrar no App</h2>
      <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} required className="p-2 border" />
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} required className="p-2 border" />
      <Button type="submit" className="bg-blue-500 text-white p-2 rounded">Entrar</Button>
    </form>
  );
}
