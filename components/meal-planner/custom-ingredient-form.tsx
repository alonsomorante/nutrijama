'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'
import { MealIngredient, CustomNutritionData, NutritionData } from '@/lib/types'

interface CustomIngredientFormProps {
  onAddIngredient: (ingredient: MealIngredient) => void
  onCancel: () => void
}

export function CustomIngredientForm({ onAddIngredient, onCancel }: CustomIngredientFormProps) {
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [nutrition, setNutrition] = useState<CustomNutritionData>({
    name: '',
    energy: undefined,
    protein: undefined,
    total_fat: undefined,
    total_carbohydrates: undefined,
    fibra: undefined,
    calcium: undefined,
    fosforo: undefined,
    zinc: undefined,
    iron: undefined,
    sodium: undefined,
    potassium: undefined,
  })

  const nutritionFields = [
    { key: 'energy', label: 'Energía (kcal)', placeholder: '0' },
    { key: 'protein', label: 'Proteína (g)', placeholder: '0' },
    { key: 'total_fat', label: 'Grasa Total (g)', placeholder: '0' },
    { key: 'total_carbohydrates', label: 'Carbohidratos (g)', placeholder: '0' },
    { key: 'fibra', label: 'Fibra (g)', placeholder: '0' },
    { key: 'calcium', label: 'Calcio (mg)', placeholder: '0' },
    { key: 'fosforo', label: 'Fósforo (mg)', placeholder: '0' },
    { key: 'zinc', label: 'Zinc (mg)', placeholder: '0' },
    { key: 'iron', label: 'Hierro (mg)', placeholder: '0' },
    { key: 'sodium', label: 'Sodio (mg)', placeholder: '0' },
    { key: 'potassium', label: 'Potasio (mg)', placeholder: '0' },
  ] as const

  const handleNutritionChange = (key: keyof CustomNutritionData, value: string) => {
    setNutrition(prev => ({
      ...prev,
      [key]: value === '' ? undefined : parseFloat(value)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !weight || parseFloat(weight) <= 0) {
      return
    }

    // Create a complete nutrition data object with defaults for missing values
    const completeNutrition: NutritionData = {
      id: Date.now(),
      name: name.trim(),
      energy: nutrition.energy ?? 0,
      protein: nutrition.protein ?? 0,
      total_fat: nutrition.total_fat ?? 0,
      total_carbohydrates: nutrition.total_carbohydrates ?? 0,
      fibra: nutrition.fibra ?? 0,
      calcium: nutrition.calcium ?? 0,
      fosforo: nutrition.fosforo ?? 0,
      zinc: nutrition.zinc ?? 0,
      iron: nutrition.iron ?? 0,
      sodium: nutrition.sodium ?? 0,
      potassium: nutrition.potassium ?? 0,
      image: 'none'
    }

    const ingredient: MealIngredient = {
      id: '',
      name: name.trim(),
      weight: parseFloat(weight),
      nutrition: completeNutrition,
      isCustom: true
    }

    onAddIngredient(ingredient)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ingrediente Personalizado</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Ingrediente *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Quinoa cocida"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (gramos) *</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="100"
                min="0"
                step="1"
                required
              />
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Información Nutricional (por 100g)
            </Label>
            <p className="text-sm text-muted-foreground">
              Completa solo los valores que conozcas. Los campos vacíos se establecerán en 0.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {nutritionFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-sm">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type="number"
                    value={nutrition[field.key] ?? ''}
                    onChange={(e) => handleNutritionChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    min="0"
                    step="0.1"
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Plus className="size-4 mr-2" />
              Agregar Ingrediente
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}