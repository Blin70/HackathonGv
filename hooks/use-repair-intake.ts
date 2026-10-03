"use client"

import { useCallback, useState } from "react"

import {
  repairAssessmentSchema,
  type RepairAssessment,
  type RepairConversationMessage,
} from "@/lib/schemas/repair-intake"
import { getErrorMessage } from "@/lib/utils"

export interface RepairChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  hasImage: boolean
}

interface SubmitRepairInput {
  message: string
  city: string
  imageDataUrl?: string
}

export function useRepairIntake() {
  const [messages, setMessages] = useState<RepairChatMessage[]>([])
  const [assessment, setAssessment] = useState<RepairAssessment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(
    async ({ message, city, imageDataUrl }: SubmitRepairInput): Promise<boolean> => {
      if (loading) return false

      const normalizedMessage = message.trim() || "Please assess the repair in this photo."
      const history: RepairConversationMessage[] = messages.slice(-8).map((item) => ({
        role: item.role,
        content: item.hasImage ? `${item.text}\n[The customer also shared a repair photo.]` : item.text,
      }))
      const userMessage: RepairChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: normalizedMessage,
        hasImage: Boolean(imageDataUrl),
      }

      setMessages((current) => [...current, userMessage])
      setAssessment(null)
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/repair-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: normalizedMessage,
            city,
            imageDataUrl,
            history,
          }),
        })

        const result: unknown = await response.json()
        if (!response.ok) {
          const messageFromServer =
            typeof result === "object" && result !== null && "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "We couldn't analyze the repair right now. Please try again."
          throw new Error(messageFromServer)
        }

        const candidate =
          typeof result === "object" && result !== null && "assessment" in result
            ? result.assessment
            : undefined
        const parsed = repairAssessmentSchema.safeParse(candidate)
        if (!parsed.success) {
          throw new Error("We couldn't read the repair assessment. Please try again.")
        }

        setAssessment(parsed.data)
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: parsed.data.summary,
            hasImage: false,
          },
        ])
        return true
      } catch (caught) {
        setError(getErrorMessage(caught, "We couldn't analyze the repair right now. Please try again."))
        return false
      } finally {
        setLoading(false)
      }
    },
    [loading, messages]
  )

  const reset = useCallback(() => {
    setMessages([])
    setAssessment(null)
    setError(null)
  }, [])

  return { messages, assessment, loading, error, submit, reset }
}
