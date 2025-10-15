export type FoodGroup = {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export const foodGroups: FoodGroup[] = [
  {
    id: "fruits",
    name: "Frutas",
    description: "Manzanas, naranjas, plátanos y más",
    icon: "🍎",
    color: "from-red-500/10 to-orange-500/10 border-red-200 dark:border-red-900",
  },
  {
    id: "vegetables",
    name: "Verduras",
    description: "Lechuga, tomate, zanahoria y más",
    icon: "🥬",
    color: "from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-900",
  },
  {
    id: "dairy",
    name: "Lácteos",
    description: "Leche, queso, yogur y derivados",
    icon: "🥛",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-900",
  },
  {
    id: "meat",
    name: "Carnes",
    description: "Res, pollo, cerdo y más",
    icon: "🥩",
    color: "from-rose-500/10 to-pink-500/10 border-rose-200 dark:border-rose-900",
  },
  {
    id: "seafood",
    name: "Mariscos",
    description: "Pescado, camarones, atún y más",
    icon: "🐟",
    color: "from-sky-500/10 to-blue-500/10 border-sky-200 dark:border-sky-900",
  },
  {
    id: "cereals",
    name: "Cereales",
    description: "Arroz, trigo, avena y granos",
    icon: "🌾",
    color: "from-amber-500/10 to-yellow-500/10 border-amber-200 dark:border-amber-900",
  },
  {
    id: "legumes",
    name: "Legumbres",
    description: "Frijoles, lentejas, garbanzos",
    icon: "🫘",
    color: "from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-900",
  },
  {
    id: "tubers",
    name: "Tubérculos",
    description: "Papa, yuca, camote y más",
    icon: "🥔",
    color: "from-yellow-500/10 to-orange-500/10 border-yellow-200 dark:border-yellow-900",
  },
  {
    id: "eggs",
    name: "Huevos",
    description: "Huevos de gallina y derivados",
    icon: "🥚",
    color: "from-slate-500/10 to-gray-500/10 border-slate-200 dark:border-slate-900",
  },
  {
    id: "fats",
    name: "Grasas y Aceites",
    description: "Aceites, mantequilla, aguacate",
    icon: "🧈",
    color: "from-yellow-500/10 to-lime-500/10 border-yellow-200 dark:border-yellow-900",
  },
  {
    id: "sugar",
    name: "Azúcares",
    description: "Azúcar, miel, dulces",
    icon: "🍯",
    color: "from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-900",
  },
  {
    id: "drinks",
    name: "Bebidas",
    description: "Jugos, refrescos, café y más",
    icon: "🧃",
    color: "from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-900",
  },
  {
    id: "miscellaneous",
    name: "Misceláneos",
    description: "Otros alimentos y productos",
    icon: "🍱",
    color: "from-gray-500/10 to-slate-500/10 border-gray-200 dark:border-gray-900",
  },
]
