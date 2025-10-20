'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Flame, Calculator, Minus, Plus } from 'lucide-react'
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
  const [grams, setGrams] = useState(100)
  const [inputValue, setInputValue] = useState('100')
  const group = foodGroups.find(g => g.id === food.groupId)

  const multiplier = grams / 100

  const handleInputChange = (value: string) => {
    setInputValue(value)
    
    if (value === '' || value === '0') {
      // Permitir campo vacío temporalmente
      return
    }
    
    const numValue = Number(value)
    if (!isNaN(numValue) && numValue > 0) {
      setGrams(numValue)
    }
  }

  const handleInputBlur = () => {
    // Al perder foco, si está vacío o inválido, resetear a 100
    if (inputValue === '' || Number(inputValue) <= 0 || isNaN(Number(inputValue))) {
      setInputValue('100')
      setGrams(100)
    }
  }

  const quickAmounts = [50, 100, 150, 200, 250, 500]

  const adjustGrams = (delta: number) => {
    const newValue = Math.max(1, grams + delta)
    setGrams(newValue)
    setInputValue(newValue.toString())
  }

  const setQuickAmount = (amount: number) => {
    setGrams(amount)
    setInputValue(amount.toString())
  }

  const macronutrients = [
    { name: 'Proteínas', value: food.protein * multiplier, unit: 'g', color: 'text-blue-600' },
    { name: 'Grasas Totales', value: food.total_fat * multiplier, unit: 'g', color: 'text-yellow-600' },
    { name: 'Carbohidratos', value: food.total_carbohydrates * multiplier, unit: 'g', color: 'text-green-600' },
    { name: 'Fibra', value: food.fibra * multiplier, unit: 'g', color: 'text-orange-600' }
  ]

  const micronutrients = [
    { name: 'Calcio', value: food.calcium * multiplier, unit: 'mg' },
    { name: 'Fósforo', value: food.fosforo * multiplier, unit: 'mg' },
    { name: 'Zinc', value: food.zinc * multiplier, unit: 'mg' },
    { name: 'Hierro', value: food.iron * multiplier, unit: 'mg' },
    { name: 'Sodio', value: food.sodium * multiplier, unit: 'mg' },
    { name: 'Potasio', value: food.potassium * multiplier, unit: 'mg' }
  ]

  return (
    <div className="inset-0 z-50 bg-background">
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

            <div className="space-y-6">
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
                    Información nutricional por <span className="font-semibold text-foreground">{grams}g</span> de producto
                  </p>
                </div>
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
                    {Math.round(food.energy * multiplier)}
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
              <span className="font-medium text-foreground">Nota:</span> Los valores mostrados son aproximados por {grams}g de
              producto y pueden variar según la variedad y el proceso de elaboración. Los cálculos se basan en los valores nutricionales por 100g.
            </p>
          </div>
        </div>

        {/* Calculadora flotante */}
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/95 dark:to-purple-950/95 border border-blue-200 dark:border-blue-800 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="size-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Calculadora</span>
              </div>
              
              <div className="space-y-3">
                {/* Control principal */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustGrams(-10)}
                    className="size-8 p-0"
                    disabled={grams <= 10}
                  >
                    <Minus className="size-3" />
                  </Button>
                  
                  <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-md px-2 py-1 border min-w-0">
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={handleInputBlur}
                      className="w-14 border-0 bg-transparent text-center text-sm font-semibold p-0 h-auto"
                      placeholder="100"
                    />
                    <span className="text-xs text-muted-foreground">g</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustGrams(10)}
                    className="size-8 p-0"
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>

                {/* Botones rápidos compactos */}
                <div className="grid grid-cols-3 gap-1">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={grams === amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuickAmount(amount)}
                      className="text-xs px-2 py-1 h-7"
                    >
                      {amount}g
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}