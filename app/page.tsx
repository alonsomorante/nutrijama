'use client'

import { useState } from 'react'
import { GlobalFoodSearch } from '@/components/search/global-food-search'
import { InlineFoodDetail } from '@/components/food-detail/inline-food-detail'
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

  const handleSearchStart = () => {
    // Limpiar resultado previo cuando empieza una nueva búsqueda
    setSelectedFood(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main>
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-12 md:py-16">
          <div className="space-y-12">
            {/* Sección de búsqueda */}
            <div className="text-center space-y-8">
              {/* <div className="space-y-4">
                <div className="text-6xl mb-4">🔍</div>
                <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                  Buscar Alimentos
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Encuentra información nutricional detallada de cualquier alimento
                </p>
              </div> */}

              <div className="flex justify-center">
                <GlobalFoodSearch
                  onFoodSelect={handleFoodSelect}
                  onSearchStart={handleSearchStart}
                />
              </div>
            </div>

            {/* Sección de información del alimento */}
            {selectedFood ? (
              <div className="space-y-6">
                <InlineFoodDetail food={selectedFood} />
              </div>
            ) : (
              <div className="text-center py-12 border-t border-border">
                <div className="text-4xl mb-4">🍎</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Busca un alimento
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Escribe el nombre de cualquier alimento para ver su información nutricional detallada
                </p>
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    También puedes explorar por <strong>grupos de alimentos</strong> usando la navegación superior
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
