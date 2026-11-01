import { ArrowRight, Check } from "lucide-react"

type SectionActionProps = {
  href: string
  label: string
  muted?: boolean
  preview?: boolean
}

export type HeroSectionProps = {
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  alignment: "left" | "center"
  appearance: "default" | "muted" | "gradient"
  preview?: boolean
}

export type FeatureGridSectionProps = {
  title: string
  description: string
  firstTitle: string
  firstDescription: string
  secondTitle: string
  secondDescription: string
  thirdTitle: string
  thirdDescription: string
  preview?: boolean
}

export type CallToActionSectionProps = {
  title: string
  description: string
  label: string
  href: string
  appearance: "default" | "inverted" | "gradient"
  preview?: boolean
}

function SectionAction({ href, label, muted = false, preview = false }: SectionActionProps) {
  if (!label) return null

  const className = muted
    ? "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-foreground transition-colors hover:bg-background/60"
    : "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"

  if (preview) return <span className={className}>{label}{muted ? null : <ArrowRight className="size-4" />}</span>

  return <a href={href || "#"} className={className}>{label}{muted ? null : <ArrowRight className="size-4" />}</a>
}

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  alignment,
  appearance,
  preview,
}: HeroSectionProps) {
  const isCentered = alignment === "center"
  const background = appearance === "gradient"
    ? "border-primary/20 bg-gradient-to-br from-primary/15 via-background to-background"
    : appearance === "muted" ? "bg-muted/60" : "border border-border bg-card"

  return (
    <section className={`page-web-section overflow-hidden rounded-3xl ${background} px-6 py-14 sm:px-12 sm:py-20`}>
      <div className={`grid gap-6 ${isCentered ? "mx-auto max-w-3xl justify-items-center text-center" : "max-w-3xl"}`}>
        {eyebrow ? <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">{eyebrow}</span> : null}
        <div className="grid gap-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{title || "Título da seção"}</h1>
          {description ? <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p> : null}
        </div>
        <div className={`flex flex-wrap gap-2 ${isCentered ? "justify-center" : ""}`}>
          <SectionAction href={primaryHref} label={primaryLabel} preview={preview} />
          <SectionAction href={secondaryHref} label={secondaryLabel} muted preview={preview} />
        </div>
      </div>
    </section>
  )
}

export function FeatureGridSection({
  title,
  description,
  firstTitle,
  firstDescription,
  secondTitle,
  secondDescription,
  thirdTitle,
  thirdDescription,
}: FeatureGridSectionProps) {
  const features = [
    [firstTitle, firstDescription],
    [secondTitle, secondDescription],
    [thirdTitle, thirdDescription],
  ]

  return (
    <section className="page-web-section grid gap-8 py-6">
      <div className="grid max-w-2xl gap-3">
        <h2 className="text-3xl font-semibold tracking-tight">{title || "Destaques"}</h2>
        {description ? <p className="leading-7 text-muted-foreground">{description}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map(([featureTitle, featureDescription], index) => (
          <article key={index} className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Check className="size-4" /></span>
            <div className="grid gap-2">
              <h3 className="font-semibold">{featureTitle || "Destaque"}</h3>
              {featureDescription ? <p className="text-sm leading-6 text-muted-foreground">{featureDescription}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function CallToActionSection({ title, description, label, href, appearance, preview }: CallToActionSectionProps) {
  const background = appearance === "gradient"
    ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground"
    : appearance === "inverted" ? "bg-foreground text-background" : "bg-muted"
  const mutedText = appearance === "default" ? "text-muted-foreground" : "text-primary-foreground/75"

  return (
    <section className={`page-web-section grid gap-6 rounded-3xl p-7 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10 ${background}`}>
      <div className="grid gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title || "Pronto para começar?"}</h2>
        {description ? <p className={mutedText}>{description}</p> : null}
      </div>
      <SectionAction href={href} label={label} preview={preview} />
    </section>
  )
}
