'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function NewIncomePage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()

  return (
    <div className="flex justify-center items-start min-h-full py-6">
      <Card className="w-[800px]">
        <CardHeader>
          <CardTitle>Tambah Pemasukan</CardTitle>
          <CardDescription>
            Tambahkan transaksi pemasukan baru ke dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tanggal</Label>
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

            <div className="space-y-2">
              <Label>Waktu</Label>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Jam" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Menit" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gaji">Gaji</SelectItem>
                <SelectItem value="investasi">Investasi</SelectItem>
                <SelectItem value="penjualan">Penjualan</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Keterangan</Label>
            <Textarea placeholder="Masukkan keterangan transaksi" />
          </div>

          <div className="space-y-2">
            <Label>Akun</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih akun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bca">Bank BCA</SelectItem>
                <SelectItem value="mandiri">Bank Mandiri</SelectItem>
                <SelectItem value="bni">Bank BNI</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih metode pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">Transfer Bank</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="debit">Kartu Debit</SelectItem>
                <SelectItem value="ewallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Penerima</Label>
            <Input placeholder="Masukkan nama penerima" />
          </div>

          <div className="space-y-2">
            <Label>No. Referensi</Label>
            <Input placeholder="Masukkan nomor referensi" />
          </div>

          <div className="space-y-2">
            <Label>Jumlah</Label>
            <Input type="number" placeholder="Masukkan jumlah" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/cashflow/income')}
          >
            Batal
          </Button>
          <Button>Simpan</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
