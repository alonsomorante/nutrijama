"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
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
  const [filterNutrient, setFilterNutrient] = useState<NutrientKey | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const { filteredData, sortedData, paginatedData, totalPages } = useMemo(() => {
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

    return {
      filteredData: filtered,
      sortedData: sorted,
      paginatedData: paginated,
      totalPages: totalPagesCount
    }
  }, [data, searchTerm, sortConfig, currentPage, itemsPerPage])

  const topItem = useMemo(() => {
    if (filterNutrient === "all") return null
    return [...sortedData].sort((a, b) => b[filterNutrient] - a[filterNutrient])[0]
  }, [sortedData, filterNutrient])

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
    setFilterNutrient("all")
    setSortConfig(null)
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm !== "" || filterNutrient !== "all" || sortConfig !== null

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
            <label className="text-sm font-medium text-foreground">Filtrar por nutriente</label>
            <Select value={filterNutrient} onValueChange={(value) => {
              setFilterNutrient(value as NutrientKey | "all")
              setCurrentPage(1)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar nutriente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los nutrientes</SelectItem>
                {(Object.keys(nutrientLabels) as NutrientKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {nutrientLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="gap-2 bg-transparent">
              <X className="size-4" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {topItem && filterNutrient !== "all" && (
          <div className="rounded-md border border-accent/20 bg-accent/5 p-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                Mayor contenido
              </Badge>
              <span className="font-medium text-foreground">{topItem.name}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-sm text-muted-foreground">
                {nutrientLabels[filterNutrient]}: <span className="font-semibold">{topItem[filterNutrient]}</span>
              </span>
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
                      <span className="text-sm font-semibold text-foreground">Producto</span>
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
                        className={`border-b border-border transition-colors hover:bg-muted/30 ${index === paginatedData.length - 1 ? "border-b-0" : ""
                          } ${item.id === topItem?.id && filterNutrient !== "all" ? "bg-accent/5" : ""}`}
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
