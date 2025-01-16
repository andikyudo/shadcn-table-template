"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarVariants = cva(
  "relative flex h-screen flex-none flex-col gap-2 border-r bg-white dark:bg-gray-950 font-figtree transition-all duration-300 ease-in-out overflow-hidden",
  {
    variants: {
      state: {
        expanded: "w-[280px]",
        collapsed: "w-[60px]",
      },
    },
    defaultVariants: {
      state: "expanded",
    },
  }
)

interface SidebarContextValue {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  toggleExpanded: () => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  expanded: true,
  setExpanded: () => {},
  toggleExpanded: () => {},
})

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = React.useState(true)
  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded, toggleExpanded }}>
      {children}
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    const { expanded } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          sidebarVariants({
            state: expanded ? "expanded" : "collapsed",
          }),
          className
        )}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    const { expanded } = useSidebar()
    
    return (
      <div
        ref={ref}
        className={cn(
          "transition-width duration-300",
          expanded ? "px-4" : "px-2",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    const { expanded } = useSidebar()
    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 transition-all duration-300",
          expanded ? "px-4" : "px-2",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarContent.displayName = "SidebarContent"

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { toggleExpanded } = useSidebar()
    const Comp = asChild ? Slot : Button

    return (
      <Comp
        ref={ref}
        className={cn("transition-all duration-200", className)}
        onClick={toggleExpanded}
        {...props}
      />
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-auto", className)}
        {...props}
      />
    )
  }
)
SidebarFooter.displayName = "SidebarFooter"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
