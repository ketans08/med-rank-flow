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
import { PatientTask, StudentRanking } from '@/types';
import { Link } from "react-router-dom";

// Mock data
const mockStudents = [
  { id: '2', name: 'John Smith' },
  { id: '3', name: 'Emma Wilson' },
  { id: '4', name: 'Mike Johnson' },
];

const mockTasks: PatientTask[] = [
  {
    id: '1',
    title: 'Post-operative Physiotherapy Plan',
    description: 'Develop a comprehensive rehabilitation program',
    patient: { name: 'Mrs. Sarah Kumar', age: 45, primaryComplaint: 'Post-op knee replacement recovery' },
    assignedStudentId: '2',
    assignedStudentName: 'John Smith',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    completedAt: new Date('2024-01-18'),
    qualityScore: 4.5
  },
  {
    id: '2',
    title: 'Cardiac Rehabilitation Assessment',
    description: 'Initial assessment and exercise prescription',
    patient: { name: 'Mr. James Wilson', age: 62, primaryComplaint: 'Post-MI cardiac rehabilitation' },
    assignedStudentId: '3',
    assignedStudentName: 'Emma Wilson',
    status: 'accepted',
    createdAt: new Date('2024-01-16')
  },
  {
    id: '3',
    title: 'Pediatric Development Evaluation',
    description: 'Assess motor skills and create intervention plan',
    patient: { name: 'Tommy Chen', age: 8, primaryComplaint: 'Delayed motor development' },
    assignedStudentId: '4',
    assignedStudentName: 'Mike Johnson',
    status: 'pending',
    createdAt: new Date('2024-01-17')
  }
];

const mockRankings: StudentRanking[] = [
  { studentId: '2', studentName: 'John Smith', rank: 1, tasksCompleted: 12, averageScore: 4.3, acceptanceRate: 95 },
  { studentId: '3', studentName: 'Emma Wilson', rank: 2, tasksCompleted: 10, averageScore: 4.1, acceptanceRate: 90 },
  { studentId: '4', studentName: 'Mike Johnson', rank: 3, tasksCompleted: 8, averageScore: 3.8, acceptanceRate: 85 },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<PatientTask[]>(mockTasks);
  const [rankings, setRankings] = useState<StudentRanking[]>(mockRankings);
  
  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientComplaint, setPatientComplaint] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStudentData = mockStudents.find(s => s.id === selectedStudent);
    
    const newTask: PatientTask = {
      id: Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      patient: {
        name: patientName,
        age: parseInt(patientAge),
        primaryComplaint: patientComplaint,
        notes: patientNotes || undefined
      },
      assignedStudentId: selectedStudent,
      assignedStudentName: selectedStudentData?.name || '',
      status: 'pending',
      createdAt: new Date()
    };

    setTasks([newTask, ...tasks]);
    
    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setPatientName('');
    setPatientAge('');
    setPatientComplaint('');
    setPatientNotes('');
    setSelectedStudent('');

    toast({
      title: "Task Created",
      description: `New task assigned to ${selectedStudentData?.name}`,
    });
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 mx-auto rounded-full  from-primary to-accent flex items-center justify-center mb-2">
            <img className=" text-white h-full w-full"  src=".\lg1.png" />
              
          </div>
            <div>
              <h1 className="text-xl font-bold">Institute ERP Lite</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
                            {mockStudents.map(student => (
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
                  
                  <Button type="submit" className="w-full">Create Task</Button>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Score</TableHead>
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
                              {task.patient.age} yrs • {task.patient.primaryComplaint}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{task.assignedStudentName}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          {task.qualityScore ? (
                            <Badge variant="completed">{task.qualityScore}/5</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Tasks Completed</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Acceptance Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((ranking) => (
                      <TableRow key={ranking.studentId}>
                        <TableCell>
                          <Badge variant="rank">#{ranking.rank}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{ranking.studentName}</TableCell>
                        <TableCell>{ranking.tasksCompleted}</TableCell>
                        <TableCell>
                          <Badge variant="completed">{ranking.averageScore}/5</Badge>
                        </TableCell>
                        <TableCell>{ranking.acceptanceRate}%</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit Rank</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button asChild type="button" className="w-full mt-8">
  <a href="/adminanal" target="_blank" rel="noopener noreferrer">
    Admin Analytics
  </a>
</Button>

      </div>
          
    </div>
  );
};

export default AdminDashboard;