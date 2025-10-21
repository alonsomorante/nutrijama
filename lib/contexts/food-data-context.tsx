'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { NutritionData } from '@/lib/types'
import { foodGroups } from '@/lib/hardcode/food-groups'

export type FoodItem = NutritionData & {
  groupId: string
  groupName: string
  groupIcon: string
}

interface FoodDataContextType {
  allFoods: FoodItem[]
  isLoading: boolean
  isLoaded: boolean
  error: string | null
  searchFoods: (query: string) => FoodItem[]
}

const FoodDataContext = createContext<FoodDataContextType | undefined>(undefined)

export function useFoodData() {
  const context = useContext(FoodDataContext)
  if (context === undefined) {
    throw new Error('useFoodData must be used within a FoodDataProvider')
  }
  return context
}

// Función para normalizar texto (misma que en la API)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover marcas diacríticas (tildes, acentos)
    .replace(/[^a-z0-9\s]/g, '') // Remover símbolos especiales, mantener solo letras, números y espacios
    .trim()
}

interface FoodDataProviderProps {
  children: React.ReactNode
}

export function FoodDataProvider({ children }: FoodDataProviderProps) {
  const [allFoods, setAllFoods] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadAllFoods = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Hacer fetch a todas las tablas en paralelo
        const response = await fetch('/api/foods/all')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const foods: FoodItem[] = await response.json()
        
        if (isMounted) {
          setAllFoods(foods)
          setIsLoaded(true)
          console.log(`Loaded ${foods.length} foods for instant search`)
        }
      } catch (err) {
        console.error('Error loading foods:', err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error cargando alimentos')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAllFoods()

    return () => {
      isMounted = false
    }
  }, [])

  const searchFoods = (query: string): FoodItem[] => {
    if (!query || query.length < 2) {
      return []
    }

    const normalizedQuery = normalizeText(query)
    
    // Filtrar alimentos en memoria
    const filteredResults = allFoods.filter(food => {
      const normalizedFoodName = normalizeText(food.name)
      return normalizedFoodName.includes(normalizedQuery)
    })

    // Ordenar por relevancia (misma lógica que la API)
    const sortedResults = filteredResults.sort((a, b) => {
      const aNormalized = normalizeText(a.name)
      const bNormalized = normalizeText(b.name)
      
      // Prioridad: coincidencia exacta > coincidencia al inicio > coincidencia general
      const aExact = aNormalized === normalizedQuery
      const bExact = bNormalized === normalizedQuery
      
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      const aStartsWith = aNormalized.startsWith(normalizedQuery)
      const bStartsWith = bNormalized.startsWith(normalizedQuery)
      
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
      
      return b.energy - a.energy
    }).slice(0, 50) // Limitar a 50 resultados

    return sortedResults
  }

  const value: FoodDataContextType = {
    allFoods,
    isLoading,
    isLoaded,
    error,
    searchFoods
  }

  return (
    <FoodDataContext.Provider value={value}>
      {children}
    </FoodDataContext.Provider>
  )
}