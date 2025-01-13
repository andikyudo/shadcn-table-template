import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Transaction } from "@/lib/schema"

interface TransactionContextMenuProps {
  children: React.ReactNode
  transaction: Transaction
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onMarkCleared: (id: string) => void
  onMarkUncleared: (id: string) => void
  onMatch: (id: string) => void
  onUnmatch: (id: string) => void
  onDuplicate: (id: string) => void
  onMakeRepeating: (id: string) => void
  onFlag: (id: string) => void
  onCategorize: (id: string) => void
  onMoveToAccount: (id: string) => void
  onExport: (id: string) => void
  onDelete: (id: string) => void
}

export function TransactionContextMenu({
  children,
  transaction,
  onApprove,
  onReject,
  onMarkCleared,
  onMarkUncleared,
  onMatch,
  onUnmatch,
  onDuplicate,
  onMakeRepeating,
  onFlag,
  onCategorize,
  onMoveToAccount,
  onExport,
  onDelete,
}: TransactionContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => onApprove(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Approve
          </span>
          <ContextMenuShortcut>A</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onReject(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reject
          </span>
          <ContextMenuShortcut>⇧R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onMarkCleared(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Mark as Cleared
          </span>
          <ContextMenuShortcut>C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onMarkUncleared(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Mark as Uncleared
          </span>
          <ContextMenuShortcut>C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onMatch(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11H3M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Match
          </span>
          <ContextMenuShortcut>M</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onUnmatch(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11H3M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 7L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Unmatch
          </span>
          <ContextMenuShortcut>⇧U</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onDuplicate(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8H10C8.89543 8 8 8.89543 8 10V20C8 21.1046 8.89543 22 10 22H20C21.1046 22 22 21.1046 22 20V10C22 8.89543 21.1046 8 20 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 16V4C4 2.89543 4.89543 2 6 2H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Duplicate
          </span>
          <ContextMenuShortcut>⇧D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onMakeRepeating(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 1L21 5M21 5L17 9M21 5H7C4.79086 5 3 6.79086 3 9M7 23L3 19M3 19L7 15M3 19H17C19.2091 19 21 17.2091 21 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Make Repeating
          </span>
          <ContextMenuShortcut>⇧T</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <span className="flex items-center">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7H21M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7M3 7L5 3H19L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Flag
            </span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => onFlag(transaction.id)}>Red</ContextMenuItem>
            <ContextMenuItem onClick={() => onFlag(transaction.id)}>Orange</ContextMenuItem>
            <ContextMenuItem onClick={() => onFlag(transaction.id)}>Yellow</ContextMenuItem>
            <ContextMenuItem onClick={() => onFlag(transaction.id)}>Green</ContextMenuItem>
            <ContextMenuItem onClick={() => onFlag(transaction.id)}>Blue</ContextMenuItem>
            <ContextMenuItem onClick={() => onFlag(transaction.id)}>Purple</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem onClick={() => onCategorize(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 9H20M4 15H20M10 3L8 21M16 3L14 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Categorize
          </span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onMoveToAccount(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 9L2 12M2 12L5 15M2 12H16M9 5L12 2M12 2L15 5M12 2V16M19 9L22 12M22 12L19 15M22 12H8M9 19L12 22M12 22L15 19M12 22V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Move to Account
          </span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onExport(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export 1 Transaction
          </span>
        </ContextMenuItem>
        <ContextMenuItem className="text-red-600" onClick={() => onDelete(transaction.id)}>
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </span>
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
