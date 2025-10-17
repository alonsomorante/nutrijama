"use client"

import Link from "next/link"
import { Grid3x3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { foodGroups } from "@/lib/hardcode/food-groups"

interface QuickGroupSelectorProps {
  currentGroupId?: string
}

export function QuickGroupSelector({ currentGroupId }: QuickGroupSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Grid3x3 className="size-4" />
          Cambiar grupo
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Grupos de Alimentos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {foodGroups.map((group) => (
            <DropdownMenuItem key={group.id} asChild disabled={group.id === currentGroupId}>
              <Link href={`/groups/${group.id}`} className="flex items-center gap-3 py-2">
                <span className="text-2xl">{group.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{group.name}</div>
                  <div className="text-xs text-muted-foreground">{group.description}</div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
