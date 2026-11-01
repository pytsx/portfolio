export default function PublicPageLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-5 py-12 sm:px-8 sm:py-20" aria-label="Carregando página" role="status">
      <div className="h-14 w-2/3 animate-pulse rounded-xl bg-muted" />
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
    </div>
  )
}
