"use client"

import { Badge } from "@/components/ui/badge"
import { PlanningOpportunity } from "@/types/opportunity"

interface StatusBadgeProps {
  status: PlanningOpportunity["status"]
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "OPEN") {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
        OPEN
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      CLOSED
    </Badge>
  )
}
