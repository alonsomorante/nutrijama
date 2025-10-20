'use client'

import { useState } from 'react'
import { GlobalFoodSearch } from '@/components/search/global-food-search'
import { FoodDetailView } from '@/components/food-detail/food-detail-view'
import { MainNav } from '@/components/navigation/main-nav'
import { NutritionData } from '@/lib/types'

type FoodDetailData = NutritionData & {
  groupId: string
  groupName: string
  groupIcon: string
}

export default function Page() {
  const [selectedFood, setSelectedFood] = useState<FoodDetailData | null>(null)

  const handleFoodSelect = (food: FoodDetailData) => {
    setSelectedFood(food)
  }

  const handleCloseDetail = () => {
    setSelectedFood(null)
  }

  if (selectedFood) {
    return <FoodDetailView food={selectedFood} onClose={handleCloseDetail} />
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main>
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-12 md:py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl mb-4">🔍</div>
              <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                Buscar Alimentos
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Encuentra información nutricional detallada de cualquier alimento en nuestra base de datos
              </p>
            </div>
            
            <div className="flex justify-center">
              <GlobalFoodSearch onFoodSelect={handleFoodSelect} />
            </div>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                También puedes explorar por <strong>grupos de alimentos</strong> usando la navegación superior
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
