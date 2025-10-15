"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import type { FoodGroup } from "@/lib/hardcode/food-groups"

interface FoodGroupCardProps {
  group: FoodGroup
}

export function FoodGroupCard({ group }: FoodGroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`}>
      <Card
        className={`group relative overflow-hidden border-2 bg-gradient-to-br p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${group.color}`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="text-5xl">{group.icon}</div>
            <div>
              <h3 className="text-balance text-xl font-semibold text-foreground">{group.name}</h3>
              <p className="text-pretty text-sm text-muted-foreground">{group.description}</p>
            </div>
          </div>
          <ArrowRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  )
}
