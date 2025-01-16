"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ChevronLeft } from "lucide-react"
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Target, Wallet, Calculator } from "lucide-react"
import { RootTransactionProvider } from "@/context/transaction-context"
import { SettingsMenu } from "@/components/settings-menu"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { BudgetDropdown } from "@/components/budget-dropdown"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { expanded, setExpanded } = useSidebar()

  const handleNavigation = (href: string) => {
    router.push(href)
    if (!expanded) {
      setExpanded(true)
    }
  }

  useEffect(() => {
    const handleClick = () => {
      if (!expanded) {
        setExpanded(true)
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [expanded, setExpanded])

  const menuItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Budget",
      href: "/dashboard/budget",
      icon: Wallet,
    },
    {
      title: "Goals",
      href: "/dashboard/goals",
      icon: Target,
    },
    {
      title: "Loan Simulator",
      href: "/dashboard/loan-simulator",
      icon: Calculator,
    },
  ]

  return (
    <RootTransactionProvider>
      <SidebarProvider>
        <div className="min-h-screen">
          <div className="flex">
            <Sidebar>
              <div className="flex h-full flex-col">
                <SidebarHeader className="p-4 border-b">
                  <SettingsMenu />
                </SidebarHeader>
                <SidebarContent>
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-2">
                      <BudgetDropdown />
                      {menuItems.map((item, index) => (
                        <Button
                          key={index}
                          variant={pathname === item.href ? "secondary" : "ghost"}
                          className={cn(
                            "w-full overflow-hidden",
                            expanded ? "justify-start" : "justify-center"
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNavigation(item.href)
                          }}
                        >
                          <item.icon className={cn(
                            "h-4 w-4",
                            expanded ? "mr-2" : ""
                          )} />
                          <span className={cn(
                            "transition-all duration-300",
                            expanded ? "opacity-100" : "w-0 opacity-0 hidden"
                          )}>
                            {item.title}
                          </span>
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <ModeToggle className={cn(
                        "w-full",
                        expanded ? "" : "px-0"
                      )} />
                      <SidebarTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "w-full overflow-hidden",
                            expanded ? "justify-start" : "justify-center"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ChevronLeft className={cn(
                            "h-4 w-4 transition-transform",
                            expanded ? "mr-2" : "rotate-180"
                          )} />
                          <span className={cn(
                            "transition-all duration-300",
                            expanded ? "opacity-100" : "w-0 opacity-0 hidden"
                          )}>
                            Collapse
                          </span>
                        </Button>
                      </SidebarTrigger>
                    </div>
                  </div>
                </SidebarContent>
              </div>
            </Sidebar>
            <main className="flex-1" onClick={(e) => e.stopPropagation()}>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </RootTransactionProvider>
  )
}
