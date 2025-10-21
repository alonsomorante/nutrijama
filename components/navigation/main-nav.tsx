'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, Grid3X3, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'Buscador',
      icon: Search,
      description: 'Buscar alimentos'
    },
    {
      href: '/groups',
      label: 'Grupos',
      icon: Grid3X3,
      description: 'Ver por grupos'
    },
    {
      href: '/meal-planner',
      label: 'Planificador',
      icon: Calculator,
      description: 'Planificar comidas'
    }
  ]

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 md:px-12">
        <div className="flex items-center justify-between">
          <Link href={'/'} className="flex items-center gap-2">
            <div className="text-2xl">🥗</div>
            <h1 className="text-xl font-bold text-foreground">Nutrijama</h1>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href === '/groups' && pathname.startsWith('/groups'))

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2 transition-colors",
                      isActive && "shadow-sm"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}