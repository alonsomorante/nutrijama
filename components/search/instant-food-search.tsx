'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useFoodData, FoodItem } from '@/lib/contexts/food-data-context'

interface InstantFoodSearchProps {
  onFoodSelect: (food: FoodItem) => void
  onSearchStart: () => void
}

export function InstantFoodSearch({ onFoodSelect, onSearchStart }: InstantFoodSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodItem[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const { searchFoods, isLoading: isDataLoading, isLoaded, error } = useFoodData()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const performSearch = () => {
      if (query.length < 2) {
        setResults([])
        setShowResults(false)
        setIsSearching(false)
        return
      }

      if (!isLoaded) {
        return // Wait for data to load
      }

      // Notificar que inició una búsqueda (para limpiar resultados previos)
      onSearchStart()

      setIsSearching(true)
      setShowResults(true)

      // Búsqueda instantánea en memoria
      const searchResults = searchFoods(query)
      setResults(searchResults)
      setIsSearching(false)
    }

    if (query.length >= 2) {
      setIsSearching(true)
      setShowResults(true)
    }

    const debounceTimer = setTimeout(performSearch, 150) // Reducido de 300ms a 150ms
    return () => clearTimeout(debounceTimer)
  }, [query, isLoaded, searchFoods, onSearchStart])

  const handleFoodSelect = (food: FoodItem) => {
    onFoodSelect(food)
    setQuery('')
    setShowResults(false)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  const getSearchStatus = () => {
    if (isDataLoading) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          <Loader2 className="size-4 animate-spin mx-auto mb-2" />
          Cargando base de datos...
        </div>
      )
    }

    if (error) {
      return (
        <div className="p-4 text-center text-destructive">
          Error: {error}
        </div>
      )
    }

    if (isSearching) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          <Loader2 className="size-4 animate-spin mx-auto mb-2" />
          Buscando...
        </div>
      )
    }

    if (results.length > 0) {
      return (
        <div className="p-2">
          {results.map((food) => (
            <div
              key={`${food.groupId}-${food.id}`}
              className="flex items-center gap-3 rounded-md p-3 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => handleFoodSelect(food)}
            >
              <div className="text-2xl">{food.groupIcon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate text-left">
                  {food.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {food.groupName}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(food.energy)} kcal
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="p-4 text-center text-muted-foreground">
        No se encontraron alimentos
      </div>
    )
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={
            isDataLoading 
              ? "Cargando base de datos..." 
              : isLoaded 
                ? "Búsqueda instantánea disponible..."
                : "Buscar cualquier alimento..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          disabled={isDataLoading}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 size-6 -translate-y-1/2 p-0"
          >
            <X className="size-4" />
          </Button>
        )}
        {isDataLoading && (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full z-50 mt-2 w-full max-h-96 overflow-y-auto border border-border bg-background shadow-lg">
          {getSearchStatus()}
        </Card>
      )}

    </div>
  )
}