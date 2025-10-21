'use client'

import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useFoodData } from '@/lib/contexts/food-data-context'

export function DataLoadingIndicator() {
  const { isLoading, isLoaded, error, allFoods } = useFoodData()

  if (isLoaded && !error) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm animate-in slide-in-from-bottom-2 duration-500">
        <CheckCircle className="size-4" />
        {allFoods.length} alimentos cargados
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
        <AlertCircle className="size-4" />
        Error cargando datos
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
        <Loader2 className="size-4 animate-spin" />
        Cargando base de datos...
      </div>
    )
  }

  return null
}