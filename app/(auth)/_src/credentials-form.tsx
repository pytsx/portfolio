
"use client"

import { useState, type FormEvent } from "react"
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CredentialsFormProps = {
  description: string
  submitLabel: string
  title: string
  submitCredentials(
    email: string,
    password: string
  ): Promise<void>
}

function getErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    error.message ===
      "Você não tem permissão para acessar a administração."
  ) {
    return error.message
  }

  return "Não foi possível concluir o acesso. Confira suas credenciais e tente novamente."
}

export function CredentialsForm({
  description,
  submitLabel,
  title,
  submitCredentials,
}: CredentialsFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)

    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    setErrorMessage(undefined)
    setIsSubmitting(true)

    try {
      await submitCredentials(email, password)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      className="flex w-full flex-col"
    >
      {/* Header */}

      <CardHeader className="space-y-0 px-7 pb-0 pt-8 sm:px-9 sm:pt-10">
        <div
          className="
            mb-8 flex size-11 items-center
            justify-center rounded-xl
            border border-border/80
            bg-muted/50 text-foreground
            shadow-xs
          "
        >
          <LockKeyhole
            className="size-5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div
            className="
              flex items-center gap-1.5
              text-[11px] font-medium
              tracking-wide text-muted-foreground
            "
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-500/30" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>

            Login
          </div>

          <CardTitle
            className="
              text-[26px] font-semibold
              tracking-tight text-foreground
              sm:text-[28px]
            "
          >
            {title}
          </CardTitle>

          <CardDescription className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Fields */}

      <CardContent className="space-y-5 px-7 pb-0 pt-8 sm:px-9">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[12px] font-medium text-foreground/85"
          >
            E-mail
          </Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={isSubmitting}
            onChange={() => {
              if (errorMessage) setErrorMessage(undefined)
            }}
            className="
              h-10 rounded-lg border-border/80
              bg-background px-3
              text-[13px] shadow-none
              transition-colors duration-150
              placeholder:text-muted-foreground/50
              hover:border-border
              focus-visible:border-ring
              focus-visible:ring-2
              focus-visible:ring-ring/15
            "
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-[12px] font-medium text-foreground/85"
          >
            Senha
          </Label>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              minLength={6}
              required
              disabled={isSubmitting}
              onChange={() => {
                if (errorMessage) setErrorMessage(undefined)
              }}
              className="
                h-10 rounded-lg border-border/80
                bg-background px-3 pr-11
                text-[13px] shadow-none
                transition-colors duration-150
                placeholder:text-muted-foreground/50
                hover:border-border
                focus-visible:border-ring
                focus-visible:ring-2
                focus-visible:ring-ring/15
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              disabled={isSubmitting}
              aria-label={
                showPassword
                  ? "Ocultar senha"
                  : "Mostrar senha"
              }
              aria-pressed={showPassword}
              className="
                absolute right-1 top-1/2
                flex size-8 -translate-y-1/2
                items-center justify-center
                rounded-md text-muted-foreground
                transition-colors duration-150
                hover:bg-muted/80
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring/30
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              {showPassword ? (
                <EyeOff
                  className="size-[17px]"
                  strokeWidth={1.7}
                />
              ) : (
                <Eye
                  className="size-[17px]"
                  strokeWidth={1.7}
                />
              )}
            </button>
          </div>
        </div>

        {/* Error message */}

        {errorMessage && (
          <div
            role="alert"
            className="
              flex items-start gap-2.5
              rounded-lg border
              border-destructive/15
              bg-destructive/5
              px-3 py-3
              text-[12px] leading-relaxed
              text-destructive
            "
          >
            <LockKeyhole
              className="mt-0.5 size-4 shrink-0"
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <span>{errorMessage}</span>
          </div>
        )}
      </CardContent>

      {/* Submit and footer */}

      <CardFooter className="flex flex-col gap-0 px-7 pb-8 pt-7 sm:px-9 sm:pb-9">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            group h-10 w-full
            rounded-lg text-[13px]
            font-medium shadow-sm
            transition-all duration-200
            active:scale-[0.99]
          "
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
              Autenticando...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              {submitLabel}

              <ArrowRight
                className="
                  size-4 transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                "
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>
          )}
        </Button>

      </CardFooter>
    </form>
  )
}
