'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Flame } from 'lucide-react'
import { NutritionData } from '@/lib/types'
import { foodGroups } from '@/lib/hardcode/food-groups'

type FoodDetailData = NutritionData & {
  groupId: string
  groupName: string
  groupIcon: string
}

interface FoodDetailViewProps {
  food: FoodDetailData
  onClose: () => void
}

export function FoodDetailView({ food, onClose }: FoodDetailViewProps) {
  const group = foodGroups.find(g => g.id === food.groupId)

  const macronutrients = [
    { name: 'Proteínas', value: food.protein, unit: 'g', color: 'text-blue-600' },
    { name: 'Grasas Totales', value: food.total_fat, unit: 'g', color: 'text-yellow-600' },
    { name: 'Carbohidratos', value: food.total_carbohydrates, unit: 'g', color: 'text-green-600' },
    { name: 'Fibra', value: food.fibra, unit: 'g', color: 'text-orange-600' }
  ]

  const micronutrients = [
    { name: 'Calcio', value: food.calcium, unit: 'mg' },
    { name: 'Fósforo', value: food.fosforo, unit: 'mg' },
    { name: 'Zinc', value: food.zinc, unit: 'mg' },
    { name: 'Hierro', value: food.iron, unit: 'mg' },
    { name: 'Sodio', value: food.sodium, unit: 'mg' },
    { name: 'Potasio', value: food.potassium, unit: 'mg' }
  ]

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-6 py-6 md:px-12">
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Volver a buscar
              </Button>
            </div>

            <div className="flex items-start gap-6">
              <div className="text-6xl">{food.groupIcon}</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {food.name}
                  </h1>
                  <Badge variant="secondary" className={group?.color}>
                    {food.groupName}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Información nutricional por 100g de producto
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-8 md:px-12">
          {/* Calorías destacadas */}
          <Card className="mb-8 border-2 border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4">
                <Flame className="size-12 text-orange-500" />
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-600 dark:text-orange-400">
                    {Math.round(food.energy)}
                  </div>
                  <div className="text-xl font-medium text-orange-700 dark:text-orange-300">
                    kcal
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Macronutrientes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Macronutrientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {macronutrients.map((macro) => (
                  <div key={macro.name} className="text-center p-4 rounded-lg bg-muted/30">
                    <div className={`text-2xl font-bold ${macro.color}`}>
                      {macro.value.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">{macro.unit}</div>
                    <div className="text-sm font-medium mt-1">{macro.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Micronutrientes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Micronutrientes (Minerales)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {micronutrients.map((micro) => (
                  <div key={micro.name} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="font-medium">{micro.name}</span>
                    <span className="text-muted-foreground">
                      {micro.value.toFixed(1)} {micro.unit}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Nota:</span> Los valores mostrados son aproximados por 100g de
              producto y pueden variar según la variedad y el proceso de elaboración.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}