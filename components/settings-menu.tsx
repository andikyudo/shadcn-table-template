"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "./ui/sidebar"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { User, Plus, FolderOpen, Settings, Users, Flag, Monitor, FileText, Leaf, UserCog, Users2, Building2, GraduationCap, Keyboard, Download, LogOut, FileQuestion, Shield } from "lucide-react"

export function SettingsMenu() {
  const { expanded } = useSidebar()
  const router = useRouter()

  const recentBudgets = [
    "Andik's Budget",
    "View All Budgets"
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full h-14 flex items-center justify-center"
        >
          <User className="h-5 w-5" />
          {expanded && (
            <span className="ml-2 text-base">
              Rika
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[280px]"
        align="start"
        alignOffset={expanded ? 0 : -20}
        sideOffset={5}
      >
        <DropdownMenuLabel className="text-base px-3 py-2">
          <div className="font-medium">Rika</div>
          <div className="text-sm text-muted-foreground">andikyudo85@gmail.com</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-base">
            <Plus className="mr-2 h-4 w-4" /> New Budget
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-base">
              <FolderOpen className="mr-2 h-4 w-4" /> Open Budget
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent 
                className="w-[280px]"
                alignOffset={-10}
                sideOffset={-5}
              >
                <DropdownMenuLabel className="text-sm px-3 py-2">Recent Budgets</DropdownMenuLabel>
                {recentBudgets.map((budget, index) => (
                  <DropdownMenuItem key={index} className="text-base">
                    <FileText className="mr-2 h-4 w-4" /> {budget}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-sm px-3 py-2">Current Budget</DropdownMenuLabel>
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-base">
            <Settings className="mr-2 h-4 w-4" /> Budget Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <Users className="mr-2 h-4 w-4" /> Manage Payees
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <Flag className="mr-2 h-4 w-4" /> Edit Flags
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <Monitor className="mr-2 h-4 w-4" /> Display Options
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <FileText className="mr-2 h-4 w-4" /> Export Budget
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <Leaf className="mr-2 h-4 w-4" /> Make a Fresh Start
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-sm px-3 py-2">Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem className="text-base">
            <UserCog className="mr-2 h-4 w-4" /> Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <Users2 className="mr-2 h-4 w-4" /> YNAB Together
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <Building2 className="mr-2 h-4 w-4" /> Manage Connections
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <GraduationCap className="mr-2 h-4 w-4" /> Join a Workshop
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <Keyboard className="mr-2 h-4 w-4" /> Keyboard Shortcuts
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-base">
              <Download className="mr-2 h-4 w-4" /> Migrate From
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent 
                className="w-[280px]"
                alignOffset={-10}
                sideOffset={-5}
              >
                <DropdownMenuItem className="text-base">
                  <FileText className="mr-2 h-4 w-4" /> Other Budgeting App
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem className="text-base">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-sm px-3 py-2">Legal</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem className="text-base">
            <Shield className="mr-2 h-4 w-4" /> Privacy Policy
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <Shield className="mr-2 h-4 w-4" /> California Privacy Policy
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <FileQuestion className="mr-2 h-4 w-4" /> Your Privacy Choices
            </div>
            <div className="flex items-center space-x-1">
              <span className="h-3 w-3 rounded-full border" />
              <span className="h-3 w-3 rounded-full bg-primary" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
