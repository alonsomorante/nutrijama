'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Flame, Calculator, Minus, Plus } from 'lucide-react'
import { NutritionData } from '@/lib/types'
import { foodGroups } from '@/lib/hardcode/food-groups'

type FoodDetailData = NutritionData & {
  groupId: string
  groupName: string
  groupIcon: string
}

interface InlineFoodDetailProps {
  food: FoodDetailData
}

export function InlineFoodDetail({ food }: InlineFoodDetailProps) {
  const [grams, setGrams] = useState(100)
  const [inputValue, setInputValue] = useState('100')
  const [showCalculator, setShowCalculator] = useState(false)
  const group = foodGroups.find(g => g.id === food.groupId)

  const multiplier = grams / 100

  const handleInputChange = (value: string) => {
    setInputValue(value)

    if (value === '' || value === '0') {
      return
    }

    const numValue = Number(value)
    if (!isNaN(numValue) && numValue > 0) {
      setGrams(numValue)
    }
  }

  const handleInputBlur = () => {
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
    <div className="space-y-6">
      {/* Botón flotante para mostrar/ocultar calculadora */}
      <div className="fixed top-20 right-6 z-50">
        {!showCalculator && (
          <Button
            onClick={() => setShowCalculator(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-2xl rounded-full p-3"
            size="sm"
          >
            <Calculator className="size-5" />
          </Button>
        )}
      </div>

      {/* Widget flotante calculadora - parte superior derecha */}
      {showCalculator && (
        <div className="fixed top-20 right-6 z-50">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/95 dark:to-purple-950/95 border border-blue-200 dark:border-blue-800 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Calculator className="size-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Calculadora</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCalculator(false)}
                className="size-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <span className="text-xs">✕</span>
              </Button>
            </div>

            <div className="space-y-2">
              {/* Control principal */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustGrams(-10)}
                  className="size-7 p-0"
                  disabled={grams <= 10}
                >
                  <Minus className="size-3" />
                </Button>

                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-md px-2 py-1 border min-w-0">
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onBlur={handleInputBlur}
                    className="w-12 border-0 bg-transparent text-center text-xs font-semibold p-0 h-auto ring-0 focus:ring-0 focus:outline-none outline-0 border-none"
                    placeholder="100"
                  />
                  <span className="text-xs text-muted-foreground">g</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustGrams(10)}
                  className="size-7 p-0"
                >
                  <Plus className="size-3" />
                </Button>
              </div>

              {/* Botones rápidos compactos */}
              <div className="grid grid-cols-2 gap-1">
                {quickAmounts.slice(0, 6).map((amount) => (
                  <Button
                    key={amount}
                    variant={grams === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickAmount(amount)}
                    className="text-xs px-1 py-1 h-6"
                  >
                    {amount}g
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Header del alimento - diseño original */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="text-4xl">{food.groupIcon}</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 justify-center">
              <h2 className="text-2xl font-bold text-foreground">
                {food.name}
              </h2>
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

      {/* Calorías destacadas - diseño original */}
      <Card className="border-2 border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            <Flame className="size-10 text-orange-500" />
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(food.energy * multiplier)}
              </div>
              <div className="text-lg font-medium text-orange-700 dark:text-orange-300">
                kcal
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macronutrientes - diseño original */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Macronutrientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {macronutrients.map((macro) => (
              <div key={macro.name} className="text-center p-3 rounded-lg bg-muted/30">
                <div className={`text-xl font-bold ${macro.color}`}>
                  {macro.value.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">{macro.unit}</div>
                <div className="text-sm font-medium mt-1">{macro.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Micronutrientes - diseño original */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Micronutrientes (Minerales)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {micronutrients.map((micro) => (
              <div key={micro.name} className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                <span className="font-medium text-sm">{micro.name}</span>
                <span className="text-muted-foreground text-sm">
                  {micro.value.toFixed(1)} {micro.unit}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Nota:</span> Los valores mostrados son aproximados por {grams}g de
          producto y pueden variar según la variedad y el proceso de elaboración.
        </p>
      </div>
    </div>
  )
}