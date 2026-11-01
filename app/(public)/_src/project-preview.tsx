import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Project } from "./type"


type PreviewVariant = Project["variant"]

export function ProjectPreview({
  variant,
}: {
  variant: PreviewVariant
}) {
  return (
    <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl bg-zinc-950 p-6 sm:h-72">
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
        <div className="flex h-9 items-center gap-1.5 border-b border-white/10 px-4">
          <span className="size-2 rounded-full bg-red-400/70" />
          <span className="size-2 rounded-full bg-amber-400/70" />
          <span className="size-2 rounded-full bg-emerald-400/70" />
          <span className="ml-4 font-mono text-[10px] text-zinc-500">
            preview
          </span>
        </div>

        {variant === "dashboard" && (
          <div className="space-y-5 p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-2 w-20 rounded bg-zinc-600" />
                <div className="h-4 w-32 rounded bg-zinc-300" />
              </div>
              <div className="size-7 rounded-lg bg-emerald-400/20" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="space-y-3 rounded-lg border border-white/10 p-3"
                >
                  <div className="h-1.5 w-10 rounded bg-zinc-600" />
                  <div className="h-3 w-14 rounded bg-zinc-300" />
                </div>
              ))}
            </div>

            <div className="flex h-24 items-end gap-2 rounded-lg border border-white/10 p-3">
              {[30, 55, 42, 70, 52, 85, 64, 95, 78, 100].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t bg-emerald-400/70"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>
          </div>
        )}

        {variant === "commerce" && (
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-zinc-300" />
              <div className="h-5 w-14 rounded-full border border-white/20" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["bg-stone-600", "bg-zinc-700", "bg-neutral-600"].map(
                (color, index) => (
                  <div key={index} className="space-y-2">
                    <div className={`aspect-square rounded-lg ${color}`}>
                      <div className="flex size-full items-center justify-center">
                        <div className="size-8 rounded-lg bg-white/10 rotate-12" />
                      </div>
                    </div>
                    <div className="h-2 w-full rounded bg-zinc-500" />
                    <div className="h-2 w-1/2 rounded bg-zinc-700" />
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {variant === "editorial" && (
          <div className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-zinc-300" />
              <div className="h-2 w-16 rounded bg-zinc-600" />
            </div>

            <Separator className="bg-white/10" />

            <Badge className="border-white/10 bg-zinc-800 text-zinc-300">
              Desenvolvimento
            </Badge>

            <h3 className="max-w-56 text-2xl font-semibold leading-tight tracking-tight text-white">
              Construindo experiências para a web.
            </h3>

            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-zinc-600" />
              <div className="h-2 w-4/5 rounded bg-zinc-700" />
              <div className="h-2 w-2/3 rounded bg-zinc-700" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}