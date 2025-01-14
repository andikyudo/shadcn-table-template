"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "@/components/ui/charts"

export default function LoanSimulatorPage() {
  const [monthlyPayment, setMonthlyPayment] = useState(313.00)
  const [payoffDate, setPayoffDate] = useState("Aug 2026")
  const [remainingPayments, setRemainingPayments] = useState(27)
  const [extraPayment, setExtraPayment] = useState(0)
  const [loanData, setLoanData] = useState([
    { name: "Jun '23", total: 12000 },
    { name: "Jan '24", total: 8000 },
    { name: "Jan '25", total: 4000 },
    { name: "Jan '26", total: 2000 },
    { name: "Jan '27", total: 0 },
  ])

  const handleExtraPaymentChange = (value: string) => {
    const payment = parseFloat(value) || 0
    setExtraPayment(payment)
    // Recalculate loan data based on extra payment
    // This is a simplified calculation
    const newLoanData = loanData.map(point => ({
      ...point,
      total: Math.max(0, point.total - (payment * 0.1))
    }))
    setLoanData(newLoanData)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 border-b pb-4">
        <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
          <Calculator className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Loan Payoff Simulator</h2>
          <p className="text-sm text-gray-500">Calculate and optimize your loan repayment strategy</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Required Minimum Payment</Label>
              <div className="text-2xl font-semibold">${monthlyPayment.toFixed(2)}</div>
            </div>

            <div className="space-y-2">
              <Label>Monthly Payment</Label>
              <Input 
                type="number" 
                value={monthlyPayment} 
                onChange={(e) => setMonthlyPayment(parseFloat(e.target.value) || 0)}
                step="0.01"
                min={312.94}
              />
              <p className="text-sm text-gray-500">
                ${monthlyPayment.toFixed(2)} is your current monthly target.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Payoff Date</Label>
              <Select defaultValue={payoffDate}>
                <SelectTrigger>
                  <SelectValue>{payoffDate}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aug 2026">August 2026</SelectItem>
                  <SelectItem value="Jul 2026">July 2026</SelectItem>
                  <SelectItem value="Jun 2026">June 2026</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                You have {remainingPayments} payments remaining on your loan.
              </p>
            </div>

            <div className="space-y-2">
              <Label>One time extra payment</Label>
              <Input 
                type="number" 
                placeholder="0.00"
                value={extraPayment || ""}
                onChange={(e) => handleExtraPaymentChange(e.target.value)}
                step="0.01"
                min="0"
              />
              <p className="text-sm text-gray-500">
                Extra one-off payments can have a large impact on your loan.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Balance Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={loanData}>
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
                      tickFormatter={(value) => `$${value}`}
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
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-blue-600">$0.06</div>
                  <div className="text-sm text-gray-500">Interest Savings</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-blue-600">0 months</div>
                  <div className="text-sm text-gray-500">Time Savings</div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Remaining to Pay</span>
                  <span className="font-medium">$8,444.66</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Principal</span>
                  <span className="font-medium">$8,114.24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Interest</span>
                  <span className="font-medium">$330.42</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
