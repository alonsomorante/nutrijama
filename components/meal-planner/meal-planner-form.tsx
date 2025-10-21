'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Search } from 'lucide-react'
import { MealIngredient } from '@/lib/types'
import { InstantFoodSearch } from '@/components/search/instant-food-search'
import { CustomIngredientForm } from './custom-ingredient-form'
import { FoodItem } from '@/lib/contexts/food-data-context'

interface MealPlannerFormProps {
  onAddIngredient: (ingredient: MealIngredient) => void
  ingredients: MealIngredient[]
  onRemoveIngredient: (id: string) => void
  onUpdateWeight: (id: string, weight: number) => void
}

export function MealPlannerForm({ 
  onAddIngredient, 
  ingredients, 
  onRemoveIngredient, 
  onUpdateWeight 
}: MealPlannerFormProps) {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [weight, setWeight] = useState('')
  const [showCustomForm, setShowCustomForm] = useState(false)

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food)
  }

  const handleAddSelected = () => {
    if (selectedFood && weight && parseFloat(weight) > 0) {
      const ingredient: MealIngredient = {
        id: '',
        name: selectedFood.name,
        weight: parseFloat(weight),
        nutrition: selectedFood,
        groupId: selectedFood.groupId,
        isCustom: false
      }
      onAddIngredient(ingredient)
      setSelectedFood(null)
      setWeight('')
    }
  }

  const handleAddCustom = (ingredient: MealIngredient) => {
    onAddIngredient(ingredient)
    setShowCustomForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5" />
            Buscar Ingredientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InstantFoodSearch
            onFoodSelect={handleFoodSelect}
            onSearchStart={() => setSelectedFood(null)}
          />
          
          {selectedFood && (
            <div className="p-4 border border-border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{selectedFood.name}</h4>
                <Badge variant="outline">{selectedFood.groupName}</Badge>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Peso en gramos"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddSelected}
                  disabled={!weight || parseFloat(weight) <= 0}
                >
                  <Plus className="size-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-border">
            <Button 
              variant="outline" 
              onClick={() => setShowCustomForm(true)}
              className="w-full"
            >
              <Plus className="size-4 mr-2" />
              Agregar Ingrediente Personalizado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Ingredient Form */}
      {showCustomForm && (
        <CustomIngredientForm
          onAddIngredient={handleAddCustom}
          onCancel={() => setShowCustomForm(false)}
        />
      )}

      {/* Ingredients List */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredientes Agregados ({ingredients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {ingredients.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No has agregado ingredientes aún
            </p>
          ) : (
            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <div 
                  key={ingredient.id}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{ingredient.name}</span>
                      {ingredient.isCustom && (
                        <Badge variant="secondary" className="text-xs">
                          Personalizado
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {ingredient.weight}g • {((ingredient.nutrition.energy * ingredient.weight) / 100).toFixed(1)} kcal
                    </div>
                  </div>
                  
                  <Input
                    type="number"
                    value={ingredient.weight}
                    onChange={(e) => onUpdateWeight(ingredient.id, parseFloat(e.target.value) || 0)}
                    className="w-20 text-center"
                    min="0"
                    step="1"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveIngredient(ingredient.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}