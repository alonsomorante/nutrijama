import { FoodGroupCard } from '@/components/home/food-card'
import { MainNav } from '@/components/navigation/main-nav'
import { foodGroups } from '@/lib/hardcode/food-groups'

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main>
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Grupos de Alimentos</h2>
            <p className="text-muted-foreground mt-2">
              Selecciona un grupo para ver todos los alimentos y su información nutricional
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {foodGroups.map((group) => (
              <FoodGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}