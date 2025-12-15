import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PatientTask } from "@/types";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery<PatientTask[]>({
    queryKey: ["tasks"],
    queryFn: () => api.tasks.getMine(),
  });

  // Fetch analytics for rank
  const { data: analytics } = useQuery({
    queryKey: ["student-analytics"],
    queryFn: () => api.analytics.getMyAnalytics(),
  });

  // Accept task mutation
  const acceptTaskMutation = useMutation({
    mutationFn: (taskId: string) => api.tasks.accept(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task Accepted",
        description: "Task has been accepted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to accept task",
        variant: "destructive",
      });
    },
  });

  // Reject task mutation
  const rejectTaskMutation = useMutation({
    mutationFn: ({ taskId, reason }: { taskId: string; reason: string }) =>
      api.tasks.reject(taskId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setRejectDialogOpen(false);
      setRejectReason("");
      setSelectedTaskId(null);
      toast({
        title: "Task Rejected",
        description: "Task has been rejected",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject task",
        variant: "destructive",
      });
    },
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) => api.tasks.complete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["student-analytics"] });
      toast({
        title: "Task Completed",
        description: "Task has been marked as completed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete task",
        variant: "destructive",
      });
    },
  });

  const handleAcceptTask = (taskId: string) => {
    acceptTaskMutation.mutate(taskId);
  };

  const handleRejectTask = () => {
    if (selectedTaskId && rejectReason.trim()) {
      rejectTaskMutation.mutate({ taskId: selectedTaskId, reason: rejectReason });
    }
  };

  const openRejectDialog = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRejectDialogOpen(true);
  };

  const handleCompleteTask = (taskId: string) => {
    completeTaskMutation.mutate(taskId);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "pending";
      case "accepted":
        return "accepted";
      case "completed":
        return "completed";
      case "rejected":
        return "rejected";
      default:
        return "default";
    }
  };

  const getPatientComplexityColor = (age: number, complaint: string) => {
    if (
      age > 70 ||
      complaint.toLowerCase().includes("cardiac") ||
      complaint.toLowerCase().includes("post-op")
    ) {
      return "medical-red";
    } else if (age > 50 || complaint.toLowerCase().includes("chronic")) {
      return "medical-orange";
    }
    return "medical-green";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const acceptedCount = tasks.filter((t) => t.status === "accepted").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const avgScore =
    tasks
      .filter((t) => t.quality_score !== undefined && t.quality_score !== null)
      .reduce((sum, t) => sum + (t.quality_score || 0), 0) /
    (tasks.filter((t) => t.quality_score !== undefined && t.quality_score !== null).length || 1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 mx-auto rounded-full from-primary to-accent flex items-center justify-center">
              <img className="text-white h-full w-full" src="/lg1.png" alt="Logo" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Med-Rank-Flow Student</h1>
              <p className="text-sm text-muted-foreground">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {analytics && (
              <Badge variant="rank">Rank #{analytics.student_info?.rank || "N/A"}</Badge>
            )}
            <Button variant="outline" onClick={() => navigate("/analytics")}>
              Analytics
            </Button>
            <span className="text-sm">Welcome, {user?.name}</span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-status-pending flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-status-accepted flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-xl font-bold">{acceptedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-status-completed flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-medical-blue flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-xl font-bold">
                    {avgScore > 0 ? avgScore.toFixed(1) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          asChild
          type="button"
          className="w-full mb-6"
          onClick={() => navigate("/analytics")}
        >
          <a href="/analytics">Student Analytics</a>
        </Button>

        {/* Tasks Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          {tasksLoading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks assigned yet
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className="transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {task.description}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusBadgeVariant(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Patient Information */}
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Patient Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Name:</span>
                          <p className="text-muted-foreground">{task.patient.name}</p>
                        </div>
                        <div>
                          <span className="font-medium">Age:</span>
                          <p className="text-muted-foreground">{task.patient.age} years</p>
                        </div>
                        <div>
                          <span className="font-medium">Condition:</span>
                          <p className="text-muted-foreground">
                            {task.patient.primary_complaint}
                          </p>
                        </div>
                      </div>

                      {/* Complexity Indicator */}
                      <div className="mt-3 flex items-center space-x-2">
                        <span className="text-xs font-medium">Complexity:</span>
                        <div
                          className={`w-3 h-3 rounded-full bg-${getPatientComplexityColor(
                            task.patient.age,
                            task.patient.primary_complaint
                          )}`}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {task.patient.age > 70
                            ? "High"
                            : task.patient.age > 50
                            ? "Medium"
                            : "Low"}
                        </span>
                      </div>

                      {task.patient.notes && (
                        <div className="mt-3">
                          <span className="font-medium text-sm">Notes:</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.patient.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {task.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleAcceptTask(task.id)}
                            className="flex-1"
                            disabled={acceptTaskMutation.isPending}
                          >
                            Accept Task
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => openRejectDialog(task.id)}
                            className="flex-1"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {task.status === "accepted" && (
                        <Button
                          onClick={() => handleCompleteTask(task.id)}
                          className="flex-1"
                          disabled={completeTaskMutation.isPending}
                        >
                          Mark as Completed
                        </Button>
                      )}
                      {task.status === "completed" && (
                        <Badge variant="completed" className="px-4 py-2">
                          ✓ Task Completed
                          {task.quality_score !== undefined && task.quality_score !== null && (
                            <span className="ml-2">Score: {task.quality_score}/5</span>
                          )}
                        </Badge>
                      )}
                    </div>

                    {/* Task Meta */}
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Created: {formatDate(task.created_at)}
                      {task.completed_at && ` • Completed: ${formatDate(task.completed_at)}`}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Task</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this task.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectReason">Reason</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
                setSelectedTaskId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectTask}
              disabled={!rejectReason.trim() || rejectTaskMutation.isPending}
            >
              {rejectTaskMutation.isPending ? "Rejecting..." : "Reject Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;

