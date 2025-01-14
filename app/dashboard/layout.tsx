'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu } from "lucide-react"
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent,
  SidebarTrigger,
  SidebarHeader
} from "@/components/ui/sidebar"
import { LayoutDashboard, Target, DollarSign, TrendingUp, TrendingDown, BarChart2, Wallet, Settings, Calculator } from "lucide-react"
import { RootTransactionProvider } from "@/context/transaction-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const menuItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Goals",
      href: "/dashboard/goals",
      icon: Target,
    },
    {
      title: "Cash Flow",
      icon: DollarSign,
      items: [
        {
          title: "Income",
          href: "/dashboard/cashflow/income",
          icon: TrendingUp,
        },
        {
          title: "Expenses",
          href: "/dashboard/cashflow/expenses",
          icon: TrendingDown,
        },
        {
          title: "Analysis",
          href: "/dashboard/cashflow/analysis",
          icon: BarChart2,
        },
      ],
    },
    {
      title: "Loan Simulator",
      href: "/dashboard/loan-simulator",
      icon: Calculator,
    },
    {
      title: "Budget",
      href: "/dashboard/budget",
      icon: Wallet,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider>
      <RootTransactionProvider>
        <div className="flex min-h-screen">
          <Sidebar className="border-r shrink-0">
            <SidebarHeader className="border-b">
              <div className="flex h-14 items-center px-4">
                <span className="text-lg font-semibold">Family Finance</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <div className="flex flex-col h-full">
                <NavigationMenu menuItems={menuItems} />
                <div className="mt-auto space-y-4 p-4">
                  <ModeToggle />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 overflow-y-auto bg-gray-50/50">
            <div className="flex h-14 items-center border-b px-4">
              <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
            </div>
            <div className="p-6 w-full">
              {children}
            </div>
          </main>
        </div>
      </RootTransactionProvider>
    </SidebarProvider>
  )
}
