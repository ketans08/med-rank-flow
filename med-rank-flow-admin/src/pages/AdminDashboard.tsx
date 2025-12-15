import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientTask, StudentRanking, Student, TaskCreateRequest } from '@/types';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientComplaint, setPatientComplaint] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery<PatientTask[]>({
    queryKey: ['tasks'],
    queryFn: () => api.tasks.getAll(),
  });

  // Fetch rankings
  const { data: rankings = [], isLoading: rankingsLoading } = useQuery<StudentRanking[]>({
    queryKey: ['rankings'],
    queryFn: () => api.analytics.getRankings(),
  });

  // Fetch students for dropdown
  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: () => api.students.getAll(),
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData: TaskCreateRequest) => api.tasks.create(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      toast({
        title: "Task Created",
        description: "New task has been assigned successfully",
      });
      // Reset form
      setTaskTitle('');
      setTaskDescription('');
      setPatientName('');
      setPatientAge('');
      setPatientComplaint('');
      setPatientNotes('');
      setSelectedStudent('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });

  // Score task mutation
  const scoreTaskMutation = useMutation({
    mutationFn: ({ taskId, score }: { taskId: string; score: number }) =>
      api.tasks.score(taskId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      toast({
        title: "Task Scored",
        description: "Quality score has been assigned",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to score task",
        variant: "destructive",
      });
    },
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: TaskCreateRequest = {
      title: taskTitle,
      description: taskDescription,
      patient: {
        name: patientName,
        age: parseInt(patientAge),
        primary_complaint: patientComplaint,
        notes: patientNotes || undefined,
      },
      assigned_student_id: selectedStudent,
    };

    createTaskMutation.mutate(taskData);
  };

  const handleScoreTask = (taskId: string, score: number) => {
    scoreTaskMutation.mutate({ taskId, score });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'accepted': return 'accepted';
      case 'completed': return 'completed';
      case 'rejected': return 'rejected';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
              <img className="h-full w-full object-contain" src="/lg1.png" alt="AIIMS Raipur Logo" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Med-Rank-Flow Admin</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/analytics')}>
              Analytics
            </Button>
            <span className="text-sm">Welcome, {user?.name}</span>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="assign" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assign">Assign Task</TabsTrigger>
            <TabsTrigger value="tasks">All Tasks</TabsTrigger>
            <TabsTrigger value="rankings">Student Rankings</TabsTrigger>
          </TabsList>

          {/* Assign Task Tab */}
          <TabsContent value="assign">
            <Card>
              <CardHeader>
                <CardTitle>Create New Patient-Linked Task</CardTitle>
                <CardDescription>Assign a new task with patient context to a student</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTask} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Task Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Task Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="taskTitle">Task Title</Label>
                        <Input
                          id="taskTitle"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          placeholder="e.g., Post-operative Physiotherapy Plan"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taskDescription">Task Description</Label>
                        <Textarea
                          id="taskDescription"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          placeholder="Detailed description of the task requirements"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignStudent">Assign to Student</Label>
                        <Select value={selectedStudent} onValueChange={setSelectedStudent} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                          <SelectContent>
                            {students.map(student => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Patient Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Patient Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientName">Patient Name</Label>
                          <Input
                            id="patientName"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="e.g., Mrs. Sarah Kumar"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientAge">Age</Label>
                          <Input
                            id="patientAge"
                            type="number"
                            value={patientAge}
                            onChange={(e) => setPatientAge(e.target.value)}
                            placeholder="45"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientComplaint">Primary Complaint</Label>
                        <Input
                          id="patientComplaint"
                          value={patientComplaint}
                          onChange={(e) => setPatientComplaint(e.target.value)}
                          placeholder="e.g., Post-op knee replacement recovery"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientNotes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="patientNotes"
                          value={patientNotes}
                          onChange={(e) => setPatientNotes(e.target.value)}
                          placeholder="Any additional patient information or special considerations"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createTaskMutation.isPending}
                  >
                    {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>Monitor all assigned tasks and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="text-center py-8">Loading tasks...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{task.patient.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {task.patient.age} yrs • {task.patient.primary_complaint}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{task.assigned_student_name || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(task.status)}>
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(task.created_at)}</TableCell>
                          <TableCell>
                            {task.quality_score !== undefined && task.quality_score !== null ? (
                              <Badge variant="completed">{task.quality_score}/5</Badge>
                            ) : task.status === 'completed' ? (
                              <Select
                                onValueChange={(value) => handleScoreTask(task.id, parseFloat(value))}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue placeholder="Score" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map(score => (
                                    <SelectItem key={score} value={score.toString()}>
                                      {score}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {task.status === 'completed' && !task.quality_score && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  const score = prompt('Enter quality score (1-5):');
                                  if (score) {
                                    handleScoreTask(task.id, parseFloat(score));
                                  }
                                }}
                              >
                                Score
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rankings Tab */}
          <TabsContent value="rankings">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Rankings</CardTitle>
                <CardDescription>Track and manage student performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {rankingsLoading ? (
                  <div className="text-center py-8">Loading rankings...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Tasks Completed</TableHead>
                        <TableHead>Average Score</TableHead>
                        <TableHead>Acceptance Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rankings.map((ranking) => (
                        <TableRow key={ranking.student_id}>
                          <TableCell>
                            <Badge variant="rank">#{ranking.rank}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{ranking.student_name}</TableCell>
                          <TableCell>{ranking.tasks_completed}</TableCell>
                          <TableCell>
                            <Badge variant="completed">{ranking.average_score}/5</Badge>
                          </TableCell>
                          <TableCell>{ranking.acceptance_rate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

