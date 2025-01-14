'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { CalendarIcon, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Dummy data untuk tampilan
const summaryData = {
  totalIncome: 15000000,
  totalExpense: 12000000,
  balance: 3000000,
  emergencyFund: 20000000,
  targetEmergencyFund: 30000000,
  topExpenses: [
    { category: "Kebutuhan Pokok", amount: 3000000 },
    { category: "Tempat Tinggal", amount: 2500000 },
    { category: "Transportasi", amount: 1500000 },
  ],
  budgetProgress: [
    { category: "Kebutuhan Pokok", budget: 3500000, spent: 3000000 },
    { category: "Tempat Tinggal", budget: 3000000, spent: 2500000 },
    { category: "Transportasi", budget: 2000000, spent: 1500000 },
    { category: "Pendidikan", budget: 1500000, spent: 1000000 },
    { category: "Kesehatan", budget: 1000000, spent: 500000 },
  ]
}

export default function AnalysisPage() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analisis Arus Kas</h2>
        <div className="flex space-x-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">Bulan Ini</SelectItem>
              <SelectItem value="last-month">Bulan Lalu</SelectItem>
              <SelectItem value="last-3-months">3 Bulan Terakhir</SelectItem>
              <SelectItem value="this-year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(summaryData.totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(summaryData.totalExpense)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            {summaryData.balance >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(summaryData.balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dana Darurat</CardTitle>
            <CardDescription>
              Progress pengumpulan dana darurat Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={(summaryData.emergencyFund / summaryData.targetEmergencyFund) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-sm">
                <div>Terkumpul: {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(summaryData.emergencyFund)}</div>
                <div>Target: {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(summaryData.targetEmergencyFund)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Pengeluaran</CardTitle>
            <CardDescription>
              Kategori dengan pengeluaran terbesar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryData.topExpenses.map((expense, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>{expense.category}</div>
                  <div className="font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(expense.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Anggaran</CardTitle>
          <CardDescription>
            Perbandingan pengeluaran aktual dengan anggaran yang ditetapkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {summaryData.budgetProgress.map((item, index) => {
              const percentage = (item.spent / item.budget) * 100
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div>{item.category}</div>
                    <div className="flex items-center space-x-2">
                      <span>{Math.round(percentage)}%</span>
                      {percentage > 90 && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={percentage}
                    className={cn(
                      "h-2",
                      percentage > 90 ? "bg-red-100" : "bg-green-100"
                    )}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div>Terpakai: {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(item.spent)}</div>
                    <div>Anggaran: {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(item.budget)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
