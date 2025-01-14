"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Plane, GraduationCap, Home, Car, Briefcase, Shield, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

const categories = [
  { id: "VACATION", name: "Liburan", icon: <Plane className="h-4 w-4" />, color: "bg-blue-100 dark:bg-blue-900/50" },
  { id: "EDUCATION", name: "Pendidikan", icon: <GraduationCap className="h-4 w-4" />, color: "bg-green-100 dark:bg-green-900/50" },
  { id: "HOME", name: "Rumah", icon: <Home className="h-4 w-4" />, color: "bg-yellow-100 dark:bg-yellow-900/50" },
  { id: "VEHICLE", name: "Kendaraan", icon: <Car className="h-4 w-4" />, color: "bg-purple-100 dark:bg-purple-900/50" },
  { id: "RETIREMENT", name: "Pensiun", icon: <Briefcase className="h-4 w-4" />, color: "bg-pink-100 dark:bg-pink-900/50" },
  { id: "EMERGENCY", name: "Dana Darurat", icon: <Shield className="h-4 w-4" />, color: "bg-red-100 dark:bg-red-900/50" },
  { id: "INVESTMENT", name: "Investasi", icon: <TrendingUp className="h-4 w-4" />, color: "bg-indigo-100 dark:bg-indigo-900/50" }
]

interface AddGoalDialogProps {
  children: React.ReactNode
  onAddGoal: (goal: any) => void
}

export function AddGoalDialog({ children, onAddGoal }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [selectedPriority, setSelectedPriority] = useState<number>()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = formRef.current
    if (!form || !selectedCategory || !date || !selectedPriority) return

    const formData = new FormData(form)
    const newGoal = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title'),
      description: formData.get('description'),
      targetAmount: Number(formData.get('targetAmount')),
      currentAmount: 0,
      deadline: date.toISOString(),
      category: selectedCategory,
      icon: categories.find(c => c.id === selectedCategory)?.icon,
      priority: selectedPriority,
      status: "IN_PROGRESS"
    }

    onAddGoal(newGoal)
    setOpen(false)
    form.reset()
    setSelectedCategory(undefined)
    setDate(undefined)
    setSelectedPriority(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Financial Goal</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Goal Title</Label>
              <Input name="title" placeholder="e.g., Family Vacation to Japan" required />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" placeholder="Add some details about your goal..." className="h-20" required />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className={cn(
                      "p-3 cursor-pointer hover:border-primary transition-colors",
                      selectedCategory === category.id ? "border-primary ring-2 ring-primary/20" : "",
                      category.color,
                      "hover:bg-opacity-80 dark:hover:bg-opacity-60"
                    )}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-1">
                      {category.icon}
                      <span className="text-xs font-medium">{category.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                  <Input name="targetAmount" type="number" placeholder="0" className="pl-8" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={selectedPriority === level ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      selectedPriority === level && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setSelectedPriority(level)}
                  >
                    {level === 1 ? "Highest" :
                     level === 2 ? "High" :
                     level === 3 ? "Medium" :
                     level === 4 ? "Low" : "Lowest"}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
