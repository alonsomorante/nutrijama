'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, Grid3X3, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 md:px-12">
        <div className="flex items-center justify-between">
          <Link href={'/'} className="flex items-center gap-2">
            <div className="text-2xl">🥗</div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Nutrijama</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href === '/groups' && pathname.startsWith('/groups'))

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-1 md:gap-2 transition-colors text-xs md:text-sm px-2 md:px-3",
                      isActive && "shadow-sm"
                    )}
                  >
                    <Icon className="size-3 md:size-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              <div className="flex flex-col gap-1">
                <div className={cn("h-0.5 w-4 bg-current transition-transform", isMenuOpen && "rotate-45 translate-y-1.5")} />
                <div className={cn("h-0.5 w-4 bg-current transition-opacity", isMenuOpen && "opacity-0")} />
                <div className={cn("h-0.5 w-4 bg-current transition-transform", isMenuOpen && "-rotate-45 -translate-y-1.5")} />
              </div>
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href === '/groups' && pathname.startsWith('/groups'))

                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full justify-start gap-3 transition-colors",
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
        )}
      </div>
    </nav>
  )
}