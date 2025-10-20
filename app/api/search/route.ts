import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { foodGroups } from '@/lib/hardcode/food-groups'

const TABLE_NAMES = [
  'cereals', 'dairy', 'drinks', 'eggs', 'fats', 'fruits',
  'legumes', 'meat', 'miscellaneous', 'seafood', 'sugar', 'tubers', 'vegetables'
]

// Función para normalizar texto (remover acentos, convertir a minúsculas)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover marcas diacríticas (tildes, acentos)
    .replace(/[^a-z0-9\s]/g, '') // Remover símbolos especiales, mantener solo letras, números y espacios
    .trim()
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  const normalizedQuery = normalizeText(query)

  try {
    const searchPromises = TABLE_NAMES.map(async (tableName) => {
      const group = foodGroups.find(g => g.id === tableName)
      if (!group) return []

      // Obtener todos los registros de la tabla
      const allResults = await (prisma as any)[tableName].findMany()

      // Filtrar localmente usando texto normalizado
      const filteredResults = allResults.filter((food: any) => {
        const normalizedFoodName = normalizeText(food.name)
        return normalizedFoodName.includes(normalizedQuery)
      }).slice(0, 10) // Limitar a 10 resultados por tabla

      return filteredResults.map((food: any) => ({
        ...food,
        groupId: tableName,
        groupName: group.name,
        groupIcon: group.icon
      }))
    })

    const allResults = await Promise.all(searchPromises)
    const flatResults = allResults.flat()
    
    // Sort by relevance (exact matches first, then by energy content)
    const sortedResults = flatResults.sort((a, b) => {
      const normalizedQueryForSort = normalizeText(query)
      const aNormalized = normalizeText(a.name)
      const bNormalized = normalizeText(b.name)
      
      // Prioridad: coincidencia exacta > coincidencia al inicio > coincidencia general
      const aExact = aNormalized === normalizedQueryForSort
      const bExact = bNormalized === normalizedQueryForSort
      
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      const aStartsWith = aNormalized.startsWith(normalizedQueryForSort)
      const bStartsWith = bNormalized.startsWith(normalizedQueryForSort)
      
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
      
      return b.energy - a.energy
    }).slice(0, 50)

    return NextResponse.json(sortedResults)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json([], { status: 500 })
  }
}