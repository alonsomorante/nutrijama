import { QuickGroupSelector } from "@/components/quick-group-selector"
import { NutritionTable } from "@/components/table/nutrition-table"
import { Button } from "@/components/ui/button"
import { foodGroups } from "@/lib/hardcode/food-groups"
import prisma from "@/lib/prisma"
import { ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    groupId: string
  }>
}
export default async function Page({ params }: PageProps) {
  const { groupId } = await params
  const group = foodGroups.find((g) => g.id === groupId)

  const totalCount = await (prisma as any)[groupId].count()
  const data = await (prisma as any)[groupId].findMany()
  if (!group || !data) {
    return <div>Group not found</div>
  }


  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="size-4" />
                  Volver
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="size-4" />
                  Inicio
                </Button>
              </Link>
            </div>
            <QuickGroupSelector currentGroupId={groupId} />
          </div>

          <div className="flex items-start gap-4">
            <div className="text-5xl">{group.icon}</div>
            <div className="space-y-2">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {group.name}
              </h1>
              <p className="text-pretty text-muted-foreground">{group.description}</p>
              <p className="text-sm text-muted-foreground">
                Haz clic en cualquier columna para ordenar por ese nutriente
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <NutritionTable data={data} groupName={group.name} totalCount={totalCount} />

        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Nota:</span> Los valores mostrados son aproximados por 100g de
            producto y pueden variar según la variedad y el proceso de elaboración.
          </p>
        </div>

      </div>
    </main>
  )
}
