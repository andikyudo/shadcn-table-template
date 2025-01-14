"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calculator, 
  PiggyBank, 
  Settings 
} from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface MenuItem {
  title: string
  href?: string
  icon: React.ReactNode
  items?: MenuItem[]
}

const navigationItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Goals",
    href: "/dashboard/goals",
    icon: <Target className="h-4 w-4" />,
  },
  {
    title: "Budget",
    icon: <PiggyBank className="h-4 w-4" />,
    items: [
      {
        title: "Overview",
        href: "/dashboard/budget",
        icon: <PiggyBank className="h-4 w-4" />,
      },
      {
        title: "Kategori Budget",
        href: "/dashboard/budget/categories",
        icon: <PiggyBank className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Arus Kas Masuk",
    icon: <TrendingUp className="h-4 w-4" />,
    items: [
      {
        title: "Semua Pemasukan",
        href: "/dashboard/cashflow/income",
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        title: "Analisis Pemasukan",
        href: "/dashboard/cashflow/income/analysis",
        icon: <TrendingUp className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Arus Kas Keluar",
    icon: <TrendingDown className="h-4 w-4" />,
    items: [
      {
        title: "Semua Pengeluaran",
        href: "/dashboard/cashflow/expenses",
        icon: <TrendingDown className="h-4 w-4" />,
      },
      {
        title: "Analisis Pengeluaran",
        href: "/dashboard/cashflow/expenses/analysis",
        icon: <TrendingDown className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Loan Simulator",
    href: "/dashboard/loan-simulator",
    icon: <Calculator className="h-4 w-4" />,
  },
  {
    title: "Akun",
    icon: <Wallet className="h-4 w-4" />,
    items: [
      {
        title: "Daftar Akun",
        href: "/dashboard/accounts",
        icon: <Wallet className="h-4 w-4" />,
      },
      {
        title: "Tambah Akun",
        href: "/dashboard/accounts/new",
        icon: <Wallet className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  }
]

export function NavigationMenu() {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <div className="grid gap-2 px-2">
      {navigationItems.map((item) => (
        <div key={item.title}>
          {item.items ? (
            <>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between font-normal",
                  "hover:bg-gray-200/60 dark:hover:bg-gray-800/80",
                  "text-gray-600 dark:text-gray-400",
                  "transition-all duration-200",
                  "group",
                  openItems[item.title] && "bg-gray-200/70 dark:bg-gray-800/90"
                )}
                onClick={() => toggleItem(item.title)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-600 dark:text-gray-400">
                    {item.icon}
                  </div>
                  <span className="text-sm">
                    {item.title}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openItems[item.title] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-600 dark:text-gray-400"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openItems[item.title] ? "auto" : 0,
                  opacity: openItems[item.title] ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-6 mt-1 grid gap-1 pl-3 border-l border-gray-200 dark:border-gray-700">
                  {item.items?.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href || "#"}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2",
                        "text-sm text-gray-600 dark:text-gray-400",
                        "transition-all duration-200",
                        "hover:bg-gray-200/60 dark:hover:bg-gray-800/80",
                        pathname === subItem.href && "bg-gray-200/70 dark:bg-gray-800/90 font-medium"
                      )}
                    >
                      <div className="text-gray-600 dark:text-gray-400">
                        {subItem.icon}
                      </div>
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </>
          ) : (
            <Link
              href={item.href || "#"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2",
                "text-sm text-gray-600 dark:text-gray-400",
                "transition-all duration-200",
                "hover:bg-gray-200/60 dark:hover:bg-gray-800/80",
                "group",
                pathname === item.href && "bg-gray-200/70 dark:bg-gray-800/90 font-medium"
              )}
            >
              <div className="text-gray-600 dark:text-gray-400">
                {item.icon}
              </div>
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
