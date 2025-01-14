import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, isPast } from "date-fns";
import { motion } from "framer-motion";

const goalIcons = {
  Vacation: "🏖️",
  Education: "📚",
  Home: "🏠",
  Car: "🚗",
  Retirement: "👴",
  Emergency: "🚨",
  Investment: "📈",
  Other: "🎯",
};

type GoalStatus = "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";

const statusColors = {
  IN_PROGRESS: "bg-blue-500",
  COMPLETED: "bg-green-500",
  ON_HOLD: "bg-yellow-500",
};

interface FinancialGoalCardProps {
  goal: {
    id: string;
    title: string;
    description?: string | null;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date | null;
    category: string;
    priority: number;
    status: GoalStatus;
  };
}

export function FinancialGoalCard({ goal }: FinancialGoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isOverdue = goal.deadline && isPast(goal.deadline);
  const priorityColor = 
    goal.priority === 1 ? "text-red-500" :
    goal.priority === 2 ? "text-orange-500" :
    goal.priority === 3 ? "text-yellow-500" :
    goal.priority === 4 ? "text-blue-500" :
    "text-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl" role="img" aria-label={goal.category}>
                {goalIcons[goal.category as keyof typeof goalIcons] || "🎯"}
              </span>
              <div>
                <h3 className="font-semibold line-clamp-1">{goal.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {goal.category}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={goal.status === "COMPLETED" ? "default" : "secondary"}>
                {goal.status.replace("_", " ")}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Goal</DropdownMenuItem>
                  <DropdownMenuItem>Update Progress</DropdownMenuItem>
                  <DropdownMenuItem>Delete Goal</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goal.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {goal.description}
              </p>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(goal.currentAmount)}
                </span>
                <span className="font-medium">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(goal.targetAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">
                  {goal.deadline
                    ? formatDistanceToNow(goal.deadline, { addSuffix: true })
                    : "No deadline"}
                </span>
              </div>
              {isOverdue && (
                <div className="flex items-center text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Overdue</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
