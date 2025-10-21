"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X, ChevronLeft, ChevronRight, ImageIcon, Trophy, Zap, Shield } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { NutritionData, NutrientKey, SortConfig } from "@/lib/types"

interface NutritionTableProps {
  data: NutritionData[]
  groupName: string
  totalCount: number
}

const nutrientLabels: Record<NutrientKey, string> = {
  energy: "Energía (kcal)",
  protein: "Proteína (g)",
  total_fat: "Grasa Total (g)",
  total_carbohydrates: "Carbohidratos (g)",
  fibra: "Fibra (g)",
  calcium: "Calcio (mg)",
  fosforo: "Fósforo (mg)",
  zinc: "Zinc (mg)",
  iron: "Hierro (mg)",
  sodium: "Sodio (mg)",
  potassium: "Potasio (mg)",
}

export function NutritionTable({ data, groupName, totalCount }: NutritionTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showTopValues, setShowTopValues] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const { filteredData, sortedData, paginatedData, totalPages, topNutritionalValues } = useMemo(() => {
    const filtered = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const sorted = [...filtered].sort((a, b) => {
      if (!sortConfig) return 0

      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    const totalPagesCount = Math.ceil(sorted.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginated = sorted.slice(startIndex, endIndex)

    // Calcular top valores nutricionales
    const topValues = {
      highestProtein: [...filtered].sort((a, b) => b.protein - a.protein)[0],
      highestFiber: [...filtered].sort((a, b) => b.fibra - a.fibra)[0],
      lowestSodium: [...filtered].sort((a, b) => a.sodium - b.sodium)[0],
      highestCalcium: [...filtered].sort((a, b) => b.calcium - a.calcium)[0],
      highestIron: [...filtered].sort((a, b) => b.iron - a.iron)[0],
      lowestCalories: [...filtered].sort((a, b) => a.energy - b.energy)[0],
    }

    return {
      filteredData: filtered,
      sortedData: sorted,
      paginatedData: paginated,
      totalPages: totalPagesCount,
      topNutritionalValues: topValues
    }
  }, [data, searchTerm, sortConfig, currentPage, itemsPerPage])


  const handleSort = (key: NutrientKey) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "desc" }
      }
      if (current.direction === "desc") {
        return { key, direction: "asc" }
      }
      return null
    })
    setCurrentPage(1)
  }

  const getSortIcon = (key: NutrientKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="size-4" />
    }
    return sortConfig.direction === "desc" ? <ArrowDown className="size-4" /> : <ArrowUp className="size-4" />
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSortConfig(null)
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm !== "" || sortConfig !== null

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground">Buscar producto</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground">Mejores valores nutricionales</label>
            <Button
              variant={showTopValues ? "default" : "outline"}
              onClick={() => setShowTopValues(!showTopValues)}
              className="w-full justify-start gap-2"
            >
              <Trophy className="size-4" />
              {showTopValues ? "Ocultar destacados" : "Ver destacados"}
            </Button>
          </div>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="gap-2 bg-transparent">
              <X className="size-4" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {showTopValues && topNutritionalValues && (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-4 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Más Proteína
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-green-900">{topNutritionalValues.highestProtein?.name}</p>
                <p className="text-sm text-green-700">{topNutritionalValues.highestProtein?.protein.toFixed(1)}g proteína</p>
              </div>
            </div>
            
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-4 text-orange-600" />
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Más Fibra
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-orange-900">{topNutritionalValues.highestFiber?.name}</p>
                <p className="text-sm text-orange-700">{topNutritionalValues.highestFiber?.fibra.toFixed(1)}g fibra</p>
              </div>
            </div>
            
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="size-4 text-blue-600" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Menos Sodio
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-900">{topNutritionalValues.lowestSodium?.name}</p>
                <p className="text-sm text-blue-700">{topNutritionalValues.lowestSodium?.sodium.toFixed(1)}mg sodio</p>
              </div>
            </div>
            
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-4 text-purple-600" />
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Más Calcio
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-purple-900">{topNutritionalValues.highestCalcium?.name}</p>
                <p className="text-sm text-purple-700">{topNutritionalValues.highestCalcium?.calcium.toFixed(1)}mg calcio</p>
              </div>
            </div>
            
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-4 text-red-600" />
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Más Hierro
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-red-900">{topNutritionalValues.highestIron?.name}</p>
                <p className="text-sm text-red-700">{topNutritionalValues.highestIron?.iron.toFixed(2)}mg hierro</p>
              </div>
            </div>
            
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="size-4 text-emerald-600" />
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  Menos Calorías
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-emerald-900">{topNutritionalValues.lowestCalories?.name}</p>
                <p className="text-sm text-emerald-700">{topNutritionalValues.lowestCalories?.energy.toFixed(0)} kcal</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            Mostrando {paginatedData.length} de {sortedData.length} productos
            {sortedData.length !== data.length && ` (filtrados de ${data.length} total)`}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span>Página {currentPage} de {totalPages}</span>
            </div>
          )}
        </div>
      </div>
      {
        paginatedData.length > 0 ? (
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="sticky left-0 z-20 bg-muted/50 px-4 py-3 text-left">
                      <span className="text-sm font-semibold text-foreground"></span>
                    </th>
                    {(Object.keys(nutrientLabels) as NutrientKey[]).map((key) => (
                      <th key={key} className="px-4 py-3 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(key)}
                          className="h-auto gap-2 p-0 font-semibold hover:bg-transparent hover:text-accent"
                        >
                          <span className="text-sm">{nutrientLabels[key]}</span>
                          {getSortIcon(key)}
                        </Button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-4 py-12 text-center text-muted-foreground">
                        No se encontraron productos que coincidan con tu búsqueda
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-b border-border transition-colors hover:bg-muted/30 ${
                          index === paginatedData.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <td className="sticky left-0 z-20 bg-card px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.image && item.image !== "none" ? (
                              <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium text-foreground">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.energy.toFixed(1)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.protein.toFixed(1)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.total_fat.toFixed(1)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.total_carbohydrates.toFixed(1)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.fibra.toFixed(1)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.calcium.toFixed(1)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.fosforo.toFixed(1)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.zinc.toFixed(2)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.iron.toFixed(2)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.sodium.toFixed(1)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-center">{item.potassium.toFixed(1)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>No se encontraron productos que coincidan con tu búsqueda</div>
        )
      }

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className="w-10"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="gap-2"
          >
            Siguiente
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
