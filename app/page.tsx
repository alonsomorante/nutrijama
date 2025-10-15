import { FoodGroupCard } from '@/components/home/food-card'
import { foodGroups } from '@/lib/hardcode/food-groups'
import React from 'react'

export default function page() {
  return (
    <main>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Grupos de Alimentos</h2>
          <p className="text-muted-foreground">Selecciona un grupo para ver su información nutricional</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {foodGroups.map((group) => (
            <FoodGroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </main>
  )
}
