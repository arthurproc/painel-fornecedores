"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface InterestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (message: string) => void
}

export function InterestDialog({
  open,
  onOpenChange,
  onSubmit,
}: InterestDialogProps) {
  const [message, setMessage] = useState("")

  function handleSubmit() {
    onSubmit(message)
    setMessage("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manifestar Interesse</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="mensagem-contratante">Mensagem ao contratante</Label>
          <Textarea
            id="mensagem-contratante"
            placeholder="Descreva seu interesse nesta oportunidade..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!message.trim()}>
            Enviar manifestação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
