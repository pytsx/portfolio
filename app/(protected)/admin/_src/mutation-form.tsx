"use client"

import { useActionState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  INITIAL_MUTATION_STATE,
  type MutationState,
} from "@/lib/entities/action-state"

type MutationAction = (
  state: MutationState,
  formData: FormData,
) => Promise<MutationState>

type MutationFormProps = {
  action: MutationAction
  title: string
  description: string
  submitLabel: string
  children: ReactNode
}

export function MutationForm({
  action,
  title,
  description,
  submitLabel,
  children,
}: MutationFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_MUTATION_STATE,
  )

  return (
    <form action={formAction}>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="justify-end border-t pt-6">
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
