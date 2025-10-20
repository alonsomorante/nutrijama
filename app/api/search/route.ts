import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { foodGroups } from '@/lib/hardcode/food-groups'

const TABLE_NAMES = [
  'cereals', 'dairy', 'drinks', 'eggs', 'fats', 'fruits',
  'legumes', 'meat', 'miscellaneous', 'seafood', 'sugar', 'tubers', 'vegetables'
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    const searchPromises = TABLE_NAMES.map(async (tableName) => {
      const group = foodGroups.find(g => g.id === tableName)
      if (!group) return []

      const results = await (prisma as any)[tableName].findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        take: 10
      })

      return results.map((food: any) => ({
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
      const aExact = a.name.toLowerCase().includes(query.toLowerCase())
      const bExact = b.name.toLowerCase().includes(query.toLowerCase())
      
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      return b.energy - a.energy
    }).slice(0, 50)

    return NextResponse.json(sortedResults)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json([], { status: 500 })
  }
}