"use client"
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4 text-2xl font-bold">Algo deu errado</h1>
      <p className="mb-4">{error.message}</p>
      <Button
        variant="outline"
        onClick={() => reset()}
      >
        Tentar novamente
      </Button>
    </div>
  );
}
