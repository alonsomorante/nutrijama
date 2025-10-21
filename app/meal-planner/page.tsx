'use client'

import { useState, useEffect } from 'react'
import { MainNav } from '@/components/navigation/main-nav'
import { MealPlannerForm } from '@/components/meal-planner/meal-planner-form'
import { NutritionSummary } from '@/components/meal-planner/nutrition-summary'
import { MealPlanManager } from '@/components/meal-planner/meal-plan-manager'
import { MealIngredient } from '@/lib/types'
import { useMealPlanStorage } from '@/lib/hooks/use-meal-plan-storage'

export default function MealPlannerPage() {
  const [ingredients, setIngredients] = useState<MealIngredient[]>([])
  const { storage, isLoaded, updateCurrentPlan } = useMealPlanStorage()

  // Load current plan on mount
  useEffect(() => {
    if (isLoaded && storage.currentPlan) {
      setIngredients(storage.currentPlan.ingredients)
    }
  }, [isLoaded, storage.currentPlan])

  // Auto-save current plan when ingredients change
  useEffect(() => {
    if (isLoaded && storage.currentPlan && ingredients.length > 0) {
      const timeoutId = setTimeout(() => {
        updateCurrentPlan(ingredients)
      }, 1000) // Debounce auto-save by 1 second

      return () => clearTimeout(timeoutId)
    }
  }, [ingredients, isLoaded, storage.currentPlan, updateCurrentPlan])

  const handleAddIngredient = (ingredient: MealIngredient) => {
    setIngredients(prev => [...prev, { ...ingredient, id: Date.now().toString() }])
  }

  const handleRemoveIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id))
  }

  const handleUpdateWeight = (id: string, weight: number) => {
    setIngredients(prev => 
      prev.map(ing => ing.id === id ? { ...ing, weight } : ing)
    )
  }

  const handleLoadPlan = (loadedIngredients: MealIngredient[]) => {
    setIngredients(loadedIngredients)
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main>
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-12 md:py-16">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🍽️</div>
              <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                Planificador de Comidas
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Calcula los nutrientes totales de todos tus ingredientes agregando pesos personalizados
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Meal Planner Form */}
              <div className="lg:col-span-2 space-y-6">
                <MealPlannerForm 
                  onAddIngredient={handleAddIngredient}
                  ingredients={ingredients}
                  onRemoveIngredient={handleRemoveIngredient}
                  onUpdateWeight={handleUpdateWeight}
                />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Meal Plan Manager */}
                <MealPlanManager 
                  ingredients={ingredients}
                  onLoadPlan={handleLoadPlan}
                />
                
                {/* Nutrition Summary */}
                <NutritionSummary ingredients={ingredients} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}