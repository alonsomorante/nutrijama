'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NutritionData } from '@/lib/types'
import { foodGroups } from '@/lib/hardcode/food-groups'

type SearchResult = NutritionData & {
  groupId: string
  groupName: string
  groupIcon: string
}

interface GlobalFoodSearchProps {
  onFoodSelect: (food: SearchResult) => void
  onSearchStart: () => void
}

export function GlobalFoodSearch({ onFoodSelect, onSearchStart }: GlobalFoodSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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
    const searchFoods = async () => {
      if (query.length < 2) {
        setResults([])
        setShowResults(false)
        setIsLoading(false)
        return
      }

      // Notificar que inició una búsqueda (para limpiar resultados previos)
      onSearchStart()

      // Mostrar loading inmediatamente cuando hay query válido
      setIsLoading(true)
      setShowResults(true)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Error searching foods:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length >= 2) {
      // Mostrar loading inmediatamente sin esperar el debounce
      setIsLoading(true)
      setShowResults(true)
    }

    const debounceTimer = setTimeout(searchFoods, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleFoodSelect = (food: SearchResult) => {
    onFoodSelect(food)
    setQuery('')
    setShowResults(false)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar cualquier alimento..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
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
      </div>

      {showResults && (
        <Card className="absolute top-full z-50 mt-2 w-full max-h-96 overflow-y-auto border border-border bg-background shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Buscando...
            </div>
          ) : results.length > 0 ? (
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
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No se encontraron alimentos
            </div>
          )}
        </Card>
      )}
    </div>
  )
}