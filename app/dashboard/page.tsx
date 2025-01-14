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
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Wallet,
  Calendar,
  PiggyBank,
  ShoppingCart,
  Home,
  Car,
  GraduationCap,
  Heart,
  Sparkles,
  Target
} from "lucide-react"
import { motion } from "framer-motion"

// Dummy data untuk tampilan
const summaryData = {
  totalIncome: 15000000,
  totalExpense: 12000000,
  balance: 3000000,
  emergencyFund: 20000000,
  targetEmergencyFund: 30000000,
  topExpenses: [
    { category: "Kebutuhan Pokok", amount: 3000000, icon: <ShoppingCart className="h-4 w-4" /> },
    { category: "Tempat Tinggal", amount: 2500000, icon: <Home className="h-4 w-4" /> },
    { category: "Transportasi", amount: 1500000, icon: <Car className="h-4 w-4" /> },
  ],
  budgetProgress: [
    { category: "Kebutuhan Pokok", budget: 3500000, spent: 3000000, icon: <ShoppingCart className="h-4 w-4" /> },
    { category: "Tempat Tinggal", budget: 3000000, spent: 2500000, icon: <Home className="h-4 w-4" /> },
    { category: "Transportasi", budget: 2000000, spent: 1500000, icon: <Car className="h-4 w-4" /> },
    { category: "Pendidikan", budget: 1500000, spent: 1000000, icon: <GraduationCap className="h-4 w-4" /> },
    { category: "Kesehatan", budget: 1000000, spent: 500000, icon: <Heart className="h-4 w-4" /> },
  ]
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

const progressVariants = {
  hidden: { width: 0 },
  visible: { 
    width: "100%",
    transition: { duration: 1, ease: "easeOut" }
  }
}

export default function DashboardPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
            <Sparkles className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Dashboard Overview</h2>
        </div>
        <Select defaultValue="this-month">
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
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

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="relative border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0
                }).format(summaryData.totalIncome)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          custom={1}
        >
          <Card className="relative border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0
                }).format(summaryData.totalExpense)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          custom={2}
        >
          <Card className="relative border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                <Wallet className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0
                }).format(summaryData.balance)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          custom={3}
          className="md:col-span-2"
        >
          <Card className="h-full border-t-4 border-t-purple-500">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                  <PiggyBank className="h-4 w-4 text-purple-500" />
                </div>
                <CardTitle className="text-sm font-medium">Dana Darurat</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Progress pengumpulan dana darurat Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Progress 
                    value={(summaryData.emergencyFund / summaryData.targetEmergencyFund) * 100} 
                    className="h-2 w-full bg-gray-100 dark:bg-gray-800"
                  />
                </motion.div>
                <div className="flex justify-between text-sm border-t pt-4 mt-4">
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="block text-xs mb-1">Terkumpul</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0
                      }).format(summaryData.emergencyFund)}
                    </span>
                  </div>
                  <div className="text-right text-gray-600 dark:text-gray-400">
                    <span className="block text-xs mb-1">Target</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0
                      }).format(summaryData.targetEmergencyFund)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          custom={4}
          className="md:col-span-3"
        >
          <Card className="h-full border-t-4 border-t-emerald-500">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                  <Target className="h-4 w-4 text-emerald-500" />
                </div>
                <CardTitle className="text-sm font-medium">Progress Anggaran</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Perbandingan pengeluaran aktual dengan anggaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4">
                {summaryData.budgetProgress.map((item, index) => {
                  const percentage = (item.spent / item.budget) * 100
                  const isOverBudget = percentage > 90
                  return (
                    <motion.div
                      key={index}
                      className="p-4 rounded-lg border bg-white dark:bg-gray-900"
                      whileHover={{ x: 5 }}
                      onHoverStart={() => setHoveredCard(item.category)}
                      onHoverEnd={() => setHoveredCard(null)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800 shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {item.category}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                maximumFractionDigits: 0
                              }).format(item.spent)} / {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                maximumFractionDigits: 0
                              }).format(item.budget)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 shrink-0">
                          <span className={`text-sm font-medium ${
                            isOverBudget 
                              ? "text-red-600 dark:text-red-400" 
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}>
                            {Math.round(percentage)}%
                          </span>
                          {isOverBudget && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                            >
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <motion.div
                        initial="hidden"
                        animate={hoveredCard === item.category ? "visible" : "hidden"}
                        variants={progressVariants}
                      >
                        <Progress 
                          value={percentage}
                          className={`h-1 w-full ${
                            isOverBudget 
                              ? "bg-red-100 dark:bg-red-900/30" 
                              : "bg-emerald-100 dark:bg-emerald-900/30"
                          }`}
                        />
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
