'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react'
import { MealIngredient, NutrientKey } from '@/lib/types'

interface NutritionSummaryProps {
  ingredients: MealIngredient[]
}

export function NutritionSummary({ ingredients }: NutritionSummaryProps) {
  const [showIndividual, setShowIndividual] = useState(false)

  // Calculate total nutrition
  const totalNutrition = ingredients.reduce((total, ingredient) => {
    const factor = ingredient.weight / 100 // Convert from per 100g to actual weight
    
    return {
      energy: total.energy + (ingredient.nutrition.energy * factor),
      protein: total.protein + (ingredient.nutrition.protein * factor),
      total_fat: total.total_fat + (ingredient.nutrition.total_fat * factor),
      total_carbohydrates: total.total_carbohydrates + (ingredient.nutrition.total_carbohydrates * factor),
      fibra: total.fibra + (ingredient.nutrition.fibra * factor),
      calcium: total.calcium + (ingredient.nutrition.calcium * factor),
      fosforo: total.fosforo + (ingredient.nutrition.fosforo * factor),
      zinc: total.zinc + (ingredient.nutrition.zinc * factor),
      iron: total.iron + (ingredient.nutrition.iron * factor),
      sodium: total.sodium + (ingredient.nutrition.sodium * factor),
      potassium: total.potassium + (ingredient.nutrition.potassium * factor),
    }
  }, {
    energy: 0,
    protein: 0,
    total_fat: 0,
    total_carbohydrates: 0,
    fibra: 0,
    calcium: 0,
    fosforo: 0,
    zinc: 0,
    iron: 0,
    sodium: 0,
    potassium: 0,
  })

  const totalWeight = ingredients.reduce((sum, ing) => sum + ing.weight, 0)

  const nutritionLabels: Record<NutrientKey, { label: string; unit: string; category: 'macro' | 'mineral' }> = {
    energy: { label: 'Energía', unit: 'kcal', category: 'macro' },
    protein: { label: 'Proteína', unit: 'g', category: 'macro' },
    total_fat: { label: 'Grasa Total', unit: 'g', category: 'macro' },
    total_carbohydrates: { label: 'Carbohidratos', unit: 'g', category: 'macro' },
    fibra: { label: 'Fibra', unit: 'g', category: 'macro' },
    calcium: { label: 'Calcio', unit: 'mg', category: 'mineral' },
    fosforo: { label: 'Fósforo', unit: 'mg', category: 'mineral' },
    zinc: { label: 'Zinc', unit: 'mg', category: 'mineral' },
    iron: { label: 'Hierro', unit: 'mg', category: 'mineral' },
    sodium: { label: 'Sodio', unit: 'mg', category: 'mineral' },
    potassium: { label: 'Potasio', unit: 'mg', category: 'mineral' },
  }

  const macronutrients = Object.entries(nutritionLabels).filter(([_, info]) => info.category === 'macro')
  const minerals = Object.entries(nutritionLabels).filter(([_, info]) => info.category === 'mineral')

  if (ingredients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5" />
            Resumen Nutricional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-muted-foreground">
              Agrega ingredientes para ver el resumen nutricional
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Total Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5" />
            Resumen Total
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{ingredients.length} ingredientes</span>
            <span>•</span>
            <span>{totalWeight}g total</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Macronutrients */}
          <div>
            <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Macronutrientes
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {macronutrients.map(([key, info]) => (
                <div key={key} className="p-3 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">{info.label}</div>
                  <div className="text-lg font-semibold">
                    {totalNutrition[key as NutrientKey].toFixed(1)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {info.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minerals */}
          <div>
            <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Minerales
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {minerals.map(([key, info]) => (
                <div key={key} className="p-3 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">{info.label}</div>
                  <div className="text-lg font-semibold">
                    {totalNutrition[key as NutrientKey].toFixed(1)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {info.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Desglose Individual</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowIndividual(!showIndividual)}
            >
              {showIndividual ? (
                <>
                  <ChevronUp className="size-4 mr-2" />
                  Ocultar
                </>
              ) : (
                <>
                  <ChevronDown className="size-4 mr-2" />
                  Mostrar
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {showIndividual && (
          <CardContent>
            <div className="space-y-4">
              {ingredients.map((ingredient) => {
                const factor = ingredient.weight / 100
                return (
                  <div key={ingredient.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">{ingredient.name}</h5>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{ingredient.weight}g</Badge>
                        {ingredient.isCustom && (
                          <Badge variant="secondary" className="text-xs">
                            Personalizado
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Energía:</span>
                        <span className="font-medium ml-1">
                          {(ingredient.nutrition.energy * factor).toFixed(1)} kcal
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Proteína:</span>
                        <span className="font-medium ml-1">
                          {(ingredient.nutrition.protein * factor).toFixed(1)}g
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Carbos:</span>
                        <span className="font-medium ml-1">
                          {(ingredient.nutrition.total_carbohydrates * factor).toFixed(1)}g
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}