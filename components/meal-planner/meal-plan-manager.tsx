'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  Clock, 
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { MealIngredient, SavedMealPlan } from '@/lib/types'
import { useMealPlanStorage } from '@/lib/hooks/use-meal-plan-storage'

interface MealPlanManagerProps {
  ingredients: MealIngredient[]
  onLoadPlan: (ingredients: MealIngredient[]) => void
}

export function MealPlanManager({ ingredients, onLoadPlan }: MealPlanManagerProps) {
  const [planName, setPlanName] = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const [showSaveForm, setShowSaveForm] = useState(false)
  
  const {
    storage,
    isLoaded,
    saveMealPlan,
    loadMealPlan,
    deleteMealPlan,
    updateCurrentPlan,
    clearCurrentPlan,
    getTimeUntilExpiration
  } = useMealPlanStorage()

  const handleSavePlan = () => {
    if (!planName.trim() || ingredients.length === 0) return
    
    saveMealPlan(planName.trim(), ingredients)
    setPlanName('')
    setShowSaveForm(false)
  }

  const handleLoadPlan = (planId: string) => {
    const plan = loadMealPlan(planId)
    if (plan) {
      onLoadPlan(plan.ingredients)
    }
  }

  const handleUpdateCurrent = () => {
    if (storage.currentPlan) {
      updateCurrentPlan(ingredients)
    }
  }

  const formatTimeRemaining = (plan: SavedMealPlan) => {
    const time = getTimeUntilExpiration(plan)
    if (!time) return 'Expirado'
    
    if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m restantes`
    }
    return `${time.minutes}m restantes`
  }

  const getTotalNutrition = (planIngredients: MealIngredient[]) => {
    const total = planIngredients.reduce((sum, ing) => {
      const factor = ing.weight / 100
      return sum + (ing.nutrition.energy * factor)
    }, 0)
    return total.toFixed(0)
  }

  if (!isLoaded) {
    return <div>Cargando...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="size-5" />
          Gestión de Planes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan Status */}
        {storage.currentPlan ? (
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">{storage.currentPlan.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {storage.currentPlan.ingredients.length} ingredientes • 
                  {getTotalNutrition(storage.currentPlan.ingredients)} kcal
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                <Clock className="size-3 mr-1" />
                {formatTimeRemaining(storage.currentPlan)}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleUpdateCurrent}
                disabled={ingredients.length === 0}
              >
                Actualizar
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={clearCurrentPlan}
              >
                Nuevo Plan
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              No tienes un plan activo
            </p>
          </div>
        )}

        {/* Save New Plan */}
        <div className="space-y-3">
          {!showSaveForm ? (
            <Button 
              variant="outline" 
              onClick={() => setShowSaveForm(true)}
              disabled={ingredients.length === 0}
              className="w-full"
            >
              <Plus className="size-4 mr-2" />
              Guardar Plan Actual
            </Button>
          ) : (
            <div className="space-y-3 p-3 border border-border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Nombre del Plan</Label>
                <Input
                  id="plan-name"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="ej. Desayuno Proteico, Cena Ligera..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePlan()}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSavePlan}
                  disabled={!planName.trim() || ingredients.length === 0}
                  className="flex-1"
                >
                  <Save className="size-4 mr-2" />
                  Guardar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowSaveForm(false)
                    setPlanName('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Saved Plans */}
        {storage.plans.length > 0 && (
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => setShowSaved(!showSaved)}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="size-4" />
                Planes Guardados ({storage.plans.length})
              </span>
              {showSaved ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>

            {showSaved && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {storage.plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium truncate">{plan.name}</h5>
                        {plan.id === storage.currentPlan?.id && (
                          <Badge variant="default" className="text-xs">
                            Activo
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {plan.ingredients.length} ingredientes • 
                        {getTotalNutrition(plan.ingredients)} kcal
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeRemaining(plan)}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLoadPlan(plan.id)}
                        className="text-primary hover:text-primary"
                      >
                        <FolderOpen className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMealPlan(plan.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground p-3 border border-border rounded-lg bg-muted/30">
          <p className="flex items-center gap-1 mb-1">
            <Clock className="size-3" />
            Los planes se guardan por 12 horas automáticamente
          </p>
          <p>No requiere registro - todo se almacena localmente</p>
        </div>
      </CardContent>
    </Card>
  )
}