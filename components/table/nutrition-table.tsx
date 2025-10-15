"use client"

import { useState } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { NutritionData, NutrientKey, SortConfig } from "@/lib/types"

interface NutritionTableProps {
  data: NutritionData[]
  groupName: string
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

export function NutritionTable({ data, groupName }: NutritionTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterNutrient, setFilterNutrient] = useState<NutrientKey | "all">("all")

  const filteredData = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
    return 0
  })

  const getTopItem = () => {
    if (filterNutrient === "all") return null
    return [...sortedData].sort((a, b) => b[filterNutrient] - a[filterNutrient])[0]
  }

  const topItem = getTopItem()

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground">Filtrar por nutriente</label>
            <Select value={filterNutrient} onValueChange={(value) => setFilterNutrient(value as NutrientKey | "all")}>
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

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Mostrando {sortedData.length} de {data.length} productos
          </span>
        </div>
      </div>

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
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-muted-foreground">
                    No se encontraron productos que coincidan con tu búsqueda
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border transition-colors hover:bg-muted/30 ${index === sortedData.length - 1 ? "border-b-0" : ""
                      } ${item.id === topItem?.id && filterNutrient !== "all" ? "bg-accent/5" : ""}`}
                  >
                    <td className="sticky left-0 z-20 bg-card px-4 py-3">
                      <span className="font-medium text-foreground">{item.name}</span>
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
    </div>
  )
}
