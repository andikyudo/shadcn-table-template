"use client"

import { useState } from "react"
import { TrendingDown, BarChart2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "@/components/ui/charts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const monthlyExpenses = [
  { name: "Jan", total: 2375000 },
  { name: "Feb", total: 2150000 },
  { name: "Mar", total: 2450000 },
  { name: "Apr", total: 2275000 },
  { name: "May", total: 2525000 },
  { name: "Jun", total: 2350000 },
]

const categoryExpenses = [
  { name: "Utilities", total: 600000 },
  { name: "Groceries", total: 1500000 },
  { name: "Transportation", total: 400000 },
  { name: "Food", total: 750000 },
  { name: "Entertainment", total: 300000 },
]

export default function ExpenseAnalysisPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 border-b pb-4">
        <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
          <BarChart2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Analisis Pengeluaran</h2>
          <p className="text-sm text-gray-500">
            Analisis tren dan pola pengeluaran Anda
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Tren Pengeluaran Bulanan
            </CardTitle>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Bulan</SelectItem>
                <SelectItem value="6months">6 Bulan</SelectItem>
                <SelectItem value="1year">1 Tahun</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyExpenses}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
                  />
                  <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal">
              Pengeluaran per Kategori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryExpenses}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
                  />
                  <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ringkasan Statistik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-sm text-gray-500">Rata-rata Bulanan</div>
                <div className="text-2xl font-bold">
                  Rp {(2350000).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Pengeluaran Tertinggi</div>
                <div className="text-2xl font-bold">
                  Rp {(2525000).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Pengeluaran Terendah</div>
                <div className="text-2xl font-bold">
                  Rp {(2150000).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
