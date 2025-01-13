import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const categories = [
  {
    name: "Entertainment",
    allocated: 1000,
    spent: 500,
    remaining: 500,
  },
  {
    name: "Utilities",
    allocated: 800,
    spent: 400,
    remaining: 400,
  },
]

export default function BudgetCategoriesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kategori Budget</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Alokasi Budget</TableHead>
              <TableHead className="text-right">Terpakai</TableHead>
              <TableHead className="text-right">Sisa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.name}>
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-right">
                  Rp{category.allocated.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  Rp{category.spent.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  Rp{category.remaining.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
