'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { PencilIcon } from "lucide-react"

// Dummy data untuk tampilan
const transactions = [
  {
    id: 1,
    date: "2024-01-10",
    category: "Gaji",
    description: "Gaji Bulan Januari",
    account: "Bank BCA",
    amount: 5000000,
  },
  {
    id: 2,
    date: "2024-01-05",
    category: "Dividen",
    description: "Dividen Saham ABC",
    account: "Bank BCA",
    amount: 1000000,
  },
]

export default function IncomePage() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Arus Kas Masuk</h2>
        <Link href="/dashboard/cashflow/income/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pemasukan
          </Button>
        </Link>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Filter</CardTitle>
          <CardDescription>
            Filter transaksi berdasarkan kategori, akun, dan tanggal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gaji">Gaji</SelectItem>
                <SelectItem value="dividen">Dividen</SelectItem>
                <SelectItem value="sewa">Sewa</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Akun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bca">Bank BCA</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="ewallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <div className="w-full overflow-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
            <CardDescription>
              Menampilkan semua transaksi pemasukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Tanggal</TableHead>
                  <TableHead className="w-[120px]">Waktu</TableHead>
                  <TableHead className="w-[120px]">Kategori</TableHead>
                  <TableHead className="w-[150px]">Keterangan</TableHead>
                  <TableHead className="w-[120px]">Akun</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="w-[150px]">Metode Pembayaran</TableHead>
                  <TableHead className="w-[150px]">Penerima</TableHead>
                  <TableHead className="w-[150px]">No. Referensi</TableHead>
                  <TableHead className="w-[150px]">Dibuat Oleh</TableHead>
                  <TableHead className="w-[150px]">Diperbarui</TableHead>
                  <TableHead className="w-[150px] text-right">Jumlah</TableHead>
                  <TableHead className="w-[100px] text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>14:30</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {transaction.description}
                    </TableCell>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Selesai
                      </span>
                    </TableCell>
                    <TableCell>Transfer Bank</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>REF/2025/001</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>{format(new Date(), "dd MMM yyyy HH:mm")}</TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      }).format(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
