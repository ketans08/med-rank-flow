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
import { PatientTask } from "@/types";
import { Link } from "react-router-dom";

// Mock data for student tasks
const mockStudentTasks: PatientTask[] = [
  {
    id: "2",
    title: "Cardiac Rehabilitation Assessment",
    description:
      "Initial assessment and exercise prescription for post-MI patient",
    patient: {
      name: "Mr. James Wilson",
      age: 62,
      primaryComplaint: "Post-MI cardiac rehabilitation",
    },
    assignedStudentId: "2",
    assignedStudentName: "John Smith",
    status: "accepted",
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "5",
    title: "Geriatric Balance Assessment",
    description: "Evaluate fall risk and create balance improvement program",
    patient: {
      name: "Mrs. Dorothy Evans",
      age: 78,
      primaryComplaint: "Recent falls, balance issues",
    },
    assignedStudentId: "2",
    assignedStudentName: "John Smith",
    status: "pending",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "6",
    title: "Sports Injury Rehabilitation",
    description: "Design return-to-sport program for young athlete",
    patient: {
      name: "Alex Rodriguez",
      age: 19,
      primaryComplaint: "ACL reconstruction recovery",
    },
    assignedStudentId: "2",
    assignedStudentName: "John Smith",
    status: "pending",
    createdAt: new Date("2024-01-19"),
  },
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<PatientTask[]>(mockStudentTasks);
  const [currentRank] = useState(1); // Mock rank

  const handleTaskAction = (taskId: string, action: "accept" | "reject") => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: action === "accept" ? "accepted" : "rejected" }
          : task
      )
    );

    const task = tasks.find((t) => t.id === taskId);
    toast({
      title: `Task ${action === "accept" ? "Accepted" : "Rejected"}`,
      description: `${task?.title} has been ${action}ed`,
    });
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: "completed", completedAt: new Date() }
          : task
      )
    );

    const task = tasks.find((t) => t.id === taskId);
    toast({
      title: "Task Completed",
      description: `${task?.title} has been marked as completed`,
    });
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 mx-auto rounded-full  from-primary to-accent flex items-center justify-center mb-2">
              <img className=" text-white h-full w-full" src="public\lg1.png" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Institute ERP Lite</h1>
              <p className="text-sm text-muted-foreground">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="rank">Rank #{currentRank}</Badge>
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
                  <p className="text-xl font-bold">
                    {tasks.filter((t) => t.status === "pending").length}
                  </p>
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
                  <p className="text-xl font-bold">
                    {tasks.filter((t) => t.status === "accepted").length}
                  </p>
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
                  <p className="text-xl font-bold">12</p>
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
                  <p className="text-xl font-bold">4.3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        <Button asChild type="button" className="w-full mt-8">
  <a href="/studanal" target="_blank" rel="noopener noreferrer">
    Student Analytics
  </a>
</Button>

        {/* Tasks Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Tasks</h2>
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
                        <p className="text-muted-foreground">
                          {task.patient.name}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Age:</span>
                        <p className="text-muted-foreground">
                          {task.patient.age} years
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Condition:</span>
                        <p className="text-muted-foreground">
                          {task.patient.primaryComplaint}
                        </p>
                      </div>
                    </div>

                    {/* Complexity Indicator */}
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-xs font-medium">Complexity:</span>
                      <div
                        className={`w-3 h-3 rounded-full bg-${getPatientComplexityColor(
                          task.patient.age,
                          task.patient.primaryComplaint
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
                          onClick={() => handleTaskAction(task.id, "accept")}
                          className="flex-1"
                        >
                          Accept Task
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleTaskAction(task.id, "reject")}
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
                      >
                        Mark as Completed
                      </Button>
                    )}
                    {task.status === "completed" && (
                      <Badge variant="completed" className="px-4 py-2">
                        ✓ Task Completed
                      </Badge>
                    )}
                  </div>

                  {/* Task Meta */}
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Created: {task.createdAt.toLocaleDateString()} •{" "}
                    {task.createdAt.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default StudentDashboard;
