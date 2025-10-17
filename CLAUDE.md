# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (with Turbopack for faster builds)
- **Build**: `npm run build` (includes Prisma generation)
- **Production start**: `npm start`
- **Linting**: `npm run lint`
- **Database operations**: `prisma generate` (automatically runs after install)

## Architecture Overview

This is a Next.js 15 nutrition tracking application called "Nutrijama" that displays nutritional information for various food groups.

### Database Architecture
- **Database**: PostgreSQL with Prisma ORM
- **Schema**: 13 separate food group tables (cereals, dairy, drinks, eggs, fats, fruits, legumes, meat, miscellaneous, seafood, sugar, tubers, vegetables)
- **Prisma client**: Generated in `lib/generated/prisma/` directory (custom output location)
- **Nutrition fields**: Each table has identical structure with 11 nutritional values (energy, protein, fat, carbs, fiber, minerals, etc.)

### Frontend Architecture
- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: Tailwind CSS 4.x with shadcn/ui components
- **UI Components**: Located in `components/ui/` (Button, Card, Input, Select, Badge)
- **Food components**: `components/home/food-card.tsx` and `components/table/nutrition-table.tsx`

### Key Application Flow
1. **Home page** (`app/page.tsx`): Displays food group cards using hardcoded data from `lib/hardcode/food-groups.ts`
2. **Group pages** (`app/groups/[groupId]/page.tsx`): Dynamic routes that query the corresponding Prisma table
3. **Database access**: Uses dynamic Prisma queries with `(prisma as any)[groupId].findMany()`

### Data Structure
- **Food groups**: 13 predefined groups with icons, colors, and descriptions
- **Nutrition data**: Standardized NutritionData type with 11 nutritional fields
- **Dynamic table access**: Food group IDs correspond exactly to database table names

### Development Notes
- **TypeScript**: Strict configuration with path aliases (`@/*` maps to root)
- **Database connection**: Requires `DATABASE_URL` environment variable
- **Prisma singleton**: Custom singleton pattern in `lib/prisma.ts` to prevent multiple connections
- **Responsive design**: Mobile-first with Tailwind breakpoints
- **Spanish language**: UI text is in Spanish