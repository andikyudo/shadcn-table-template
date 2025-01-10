'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Table,
  FileText,
  BarChart,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface MenuItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  submenu?: MenuItem[]
}

const items: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    icon: FileText,
    submenu: [
      {
        title: "Tables",
        href: "/dashboard/tables",
        icon: Table,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart,
      },
    ],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [openMenus, setOpenMenus] = React.useState<string[]>([])

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderMenuItem = (item: MenuItem) => {
    if ('submenu' in item && item.submenu) {
      const isOpen = openMenus.includes(item.title)
      return (
        <SidebarMenuItem key={item.title}>
          <div>
            <SidebarMenuButton
              asChild
              isActive={false}
              tooltip={item.title}
              variant="default"
              size="default"
              onClick={() => toggleMenu(item.title)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )} />
              </div>
            </SidebarMenuButton>
          </div>
          <div className={cn(
            "pl-6 pt-1",
            !isOpen && "hidden"
          )}>
            <ul className="list-none m-0 p-0">
              {item.submenu.map((subitem) => (
                <SidebarMenuItem key={subitem.href}>
                  <div>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === subitem.href}
                      tooltip={subitem.title}
                      variant="default"
                      size="default"
                    >
                      <Link href={subitem.href || '#'}>
                        <subitem.icon className="mr-2 h-4 w-4" />
                        <span>{subitem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              ))}
            </ul>
          </div>
        </SidebarMenuItem>
      )
    }

    return (
      <SidebarMenuItem key={item.href}>
        <div>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.title}
            variant="default"
            size="default"
          >
            <Link href={item.href || '#'}>
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </div>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <div className="size-8 rounded-lg bg-primary" />
          <div className="flex flex-col">
            <span className="font-semibold">Admin Panel</span>
            <span className="text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
