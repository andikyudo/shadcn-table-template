"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Target, Plane, GraduationCap, Home, Car, Briefcase, Shield, TrendingUp, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AddGoalDialog } from "@/components/add-goal-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialGoals = [
  {
    id: "1",
    title: "Liburan ke Jepang",
    description: "Liburan keluarga ke Jepang tahun 2024",
    targetAmount: 50000000,
    currentAmount: 15000000,
    deadline: "2024-12-31",
    category: "VACATION",
    icon: <Plane className="h-4 w-4" />,
    priority: 2,
    status: "IN_PROGRESS"
  },
  {
    id: "2",
    title: "Pendidikan Anak",
    description: "Dana pendidikan untuk kuliah anak",
    targetAmount: 200000000,
    currentAmount: 75000000,
    deadline: "2025-06-30",
    category: "EDUCATION",
    icon: <GraduationCap className="h-4 w-4" />,
    priority: 1,
    status: "IN_PROGRESS"
  },
  {
    id: "3",
    title: "DP Rumah",
    description: "Down payment untuk rumah baru",
    targetAmount: 150000000,
    currentAmount: 100000000,
    deadline: "2024-08-31",
    category: "HOME",
    icon: <Home className="h-4 w-4" />,
    priority: 1,
    status: "IN_PROGRESS"
  },
  {
    id: "4",
    title: "Mobil Keluarga",
    description: "Mobil untuk keperluan keluarga",
    targetAmount: 300000000,
    currentAmount: 50000000,
    deadline: "2025-12-31",
    category: "VEHICLE",
    icon: <Car className="h-4 w-4" />,
    priority: 3,
    status: "IN_PROGRESS"
  }
];

const statusColors = {
  "NOT_STARTED": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  "IN_PROGRESS": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "ON_HOLD": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "COMPLETED": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "CANCELLED": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

function GoalCard({ goal, onUpdateStatus }: { goal: typeof initialGoals[0], onUpdateStatus: (id: string, status: string) => void }) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
              {goal.icon}
            </div>
            <div>
              <h3 className="font-semibold">{goal.title}</h3>
              <p className="text-sm text-gray-500">{goal.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={statusColors[goal.status as keyof typeof statusColors]}>
              {goal.status.replace("_", " ")}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdateStatus(goal.id, "NOT_STARTED")}>
                  Not Started
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(goal.id, "IN_PROGRESS")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(goal.id, "ON_HOLD")}>
                  On Hold
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(goal.id, "COMPLETED")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(goal.id, "CANCELLED")}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(goal.currentAmount)}
              </span>
              <span className="text-gray-500">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(goal.targetAmount)}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Target: {new Date(goal.deadline).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState(initialGoals);

  const handleAddGoal = (newGoal: typeof initialGoals[0]) => {
    setGoals([...goals, newGoal]);
  };

  const handleUpdateStatus = (id: string, status: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, status } : goal
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
            <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Financial Goals</h2>
            <p className="text-sm text-gray-500">Track your family&apos;s financial goals and milestones</p>
          </div>
        </div>
        <AddGoalDialog onAddGoal={handleAddGoal}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
        </AddGoalDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onUpdateStatus={handleUpdateStatus} />
        ))}
      </div>
    </div>
  );
}
