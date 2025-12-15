import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer, LineChart, Line,
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';
import {
  Award, CheckCircle, TrendingUp, Clock, Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const StudentAnalytics: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['student-analytics'],
    queryFn: () => api.analytics.getMyAnalytics(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 mx-auto rounded-full from-primary to-accent flex items-center justify-center">
                <img className="text-white h-full w-full" src="/lg1.png" alt="Logo" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Med-Rank-Flow Student</h1>
                <p className="text-sm text-muted-foreground">Analytics Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No data available</div>;
  }

  const studentInfo = analytics.student_info || {};
  const performanceHistory = analytics.performance_history || [];
  const weeklyProgress = analytics.weekly_progress || [];
  const taskTypePerformance = analytics.task_type_performance || [];
  const upcomingTasks = analytics.upcoming_tasks || [];

  const scoreColour = (s: number) =>
    s >= 4.5 ? 'bg-green-500' : s >= 4 ? 'bg-green-400'
    : s >= 3 ? 'bg-yellow-400' : 'bg-red-400';

  const priorityColour = (p: string) =>
    p === 'high' ? 'bg-red-100 text-red-800'
    : p === 'medium' ? 'bg-yellow-100 text-yellow-800'
    : 'bg-green-100 text-green-800';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 mx-auto rounded-full from-primary to-accent flex items-center justify-center">
              <img className="text-white h-full w-full" src="/lg1.png" alt="Logo" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Med-Rank-Flow Student</h1>
              <p className="text-sm text-muted-foreground">Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header bar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {studentInfo.name || 'Student'}!</h2>
                <p className="opacity-90">{studentInfo.specialization || 'N/A'} • {studentInfo.semester || 'N/A'}</p>
                <p className="text-sm opacity-75">ID: {studentInfo.id || 'N/A'}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-xl font-bold">{studentInfo.avgScore || 0}/5.0</span>
                </div>
                <p className="text-sm opacity-90">Rank #{studentInfo.rank || 'N/A'} / {studentInfo.totalStudents || 0}</p>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Current Average', value: studentInfo.avgScore || 0, icon: <Award className="w-7 h-7 text-blue-500" />, color: 'text-blue-600', delta: '+0.3 this month' },
              { label: 'Tasks Completed', value: performanceHistory.length, icon: <CheckCircle className="w-7 h-7 text-green-500" />, color: 'text-green-600', delta: 'this week' },
              { label: 'Class Rank', value: `#${studentInfo.rank || 'N/A'}`, icon: <TrendingUp className="w-7 h-7 text-purple-500" />, color: 'text-purple-600', delta: `${studentInfo.percentile || 0}th %ile` },
              { label: 'Pending Tasks', value: upcomingTasks.length, icon: <Clock className="w-7 h-7 text-orange-500" />, color: 'text-orange-600', delta: 'due this week' },
            ].map(({ label, value, icon, color, delta }) => (
              <div key={label} className="bg-white p-6 rounded-xl shadow-sm border flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500">{delta}</p>
                </div>
                {icon}
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance timeline */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Performance Timeline</h3>
              {performanceHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={performanceHistory.map((d: any, i: number) => ({ ...d, idx: i + 1 }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="idx" tickFormatter={(i) => `Task ${i}`} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  No performance data yet
                </div>
              )}
            </div>

            {/* Weekly progress */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
              {weeklyProgress.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  No weekly data yet
                </div>
              )}
            </div>
          </div>

          {/* Task-type bars + upcoming tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task-type performance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">By Task Type</h3>
              {taskTypePerformance.length > 0 ? (
                <div className="space-y-4">
                  {taskTypePerformance.map((t: any) => (
                    <div key={t.type}>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{t.type}</span>
                        <span className="text-sm text-gray-600">{t.avgScore}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="h-2 rounded-full" style={{
                          width: `${(t.avgScore / 5) * 100}%`, backgroundColor: t.color
                        }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{t.completed} completed</span>
                        <span>{Math.round((t.avgScore / 5) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No task type data yet
                </div>
              )}
            </div>

            {/* Upcoming tasks */}
            <div className="bg-white p-6 rounded-xl shadow-sm border col-span-2">
              <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.map((t: any) => (
                    <div key={t.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{t.title}</p>
                        <p className="text-xs text-gray-600">Due: {t.due} • Est: {t.est}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColour(t.priority)}`}>
                        {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming tasks
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;

