// src/app/dashboard/page.tsx
"use client"
import { Button } from '@/components/ui/button';
import { clearSessionCookie } from '@/cookies/auth';
import { auth } from '@/lib/firebase/firebase';
import {signOut} from "firebase/auth";

export  function SignOut() {

  const handleSignOut = async () => {
    await signOut(auth);
    await clearSessionCookie();
  };

  return (
    <form action={handleSignOut}>
      <Button type="submit">
        sign out
      </Button>
    </form>
  );

}
