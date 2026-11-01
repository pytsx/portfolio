export default function Loading() {
  return (
    <div
      aria-label="Carregando"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="size-8 animate-pulse rounded-full bg-muted" />
    </div>
  );
}
