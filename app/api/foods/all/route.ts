import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { foodGroups } from '@/lib/hardcode/food-groups'

const TABLE_NAMES = [
  'cereals', 'dairy', 'drinks', 'eggs', 'fats', 'fruits',
  'legumes', 'meat', 'miscellaneous', 'seafood', 'sugar', 'tubers', 'vegetables'
]

export async function GET() {
  try {
    // Obtener todos los alimentos de todas las tablas en paralelo
    const allFoodsPromises = TABLE_NAMES.map(async (tableName) => {
      const group = foodGroups.find(g => g.id === tableName)
      if (!group) return []

      // Obtener todos los registros de la tabla
      const tableResults = await (prisma as any)[tableName].findMany({
        orderBy: {
          name: 'asc'
        }
      })

      // Agregar información del grupo
      return tableResults.map((food: any) => ({
        ...food,
        groupId: tableName,
        groupName: group.name,
        groupIcon: group.icon
      }))
    })

    const allResults = await Promise.all(allFoodsPromises)
    const flatResults = allResults.flat()
    
    console.log(`Loaded ${flatResults.length} foods from ${TABLE_NAMES.length} tables`)
    
    return NextResponse.json(flatResults)
  } catch (error) {
    console.error('Error loading all foods:', error)
    return NextResponse.json([], { status: 500 })
  }
}