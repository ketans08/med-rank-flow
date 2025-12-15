import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';
import {
  Users, Award, ClipboardList, Target,
  ChevronUp, ChevronDown, Minus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const trendIcon = (trend: string) => {
  if (trend === 'up') return <ChevronUp className="w-4 h-4 text-green-500" />;
  if (trend === 'down') return <ChevronDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
};

const AdminAnalytics: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.analytics.getAdminAnalytics(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
                <img className="h-full w-full object-contain" src="/lg1.png" alt="AIIMS Raipur Logo" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Med-Rank-Flow Admin</h1>
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 mx-auto rounded-full from-primary to-accent flex items-center justify-center">
              <img className="text-white h-full w-full" src="/lg1.png" alt="Logo" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Med-Rank-Flow Admin</h1>
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
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Analytics</h2>
              <p className="text-gray-600">Monitor student performance & manage tasks</p>
            </div>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Students', value: analytics.total_students.toString(), icon: <Users className="w-8 h-8 text-blue-500" />, delta: '+2 this month', color: 'text-green-600' },
              { label: 'Average Score', value: analytics.average_score.toString(), icon: <Award className="w-8 h-8 text-yellow-500" />, delta: '+0.2 vs prev', color: 'text-green-600' },
              { label: 'Tasks This Month', value: analytics.tasks_this_month.toString(), icon: <ClipboardList className="w-8 h-8 text-purple-500" />, delta: '12 pending', color: 'text-blue-600' },
              { label: 'Completion Rate', value: `${analytics.completion_rate}%`, icon: <Target className="w-8 h-8 text-green-500" />, delta: '+3 pp', color: 'text-green-600' },
            ].map(({ label, value, icon, delta, color }) => (
              <div key={label} className="bg-white p-6 rounded-xl shadow-sm border flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className={`text-xs ${color}`}>{delta}</p>
                </div>
                {icon}
              </div>
            ))}
          </div>

          {/* CHART ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Performance Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Student Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.student_performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trends Area Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.monthly_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="averageScore" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="completionRate" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE + TOP 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Distribution Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.task_distribution}
                    innerRadius={45}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {analytics.task_distribution.map((seg: any, idx: number) => (
                      <Cell key={idx} fill={seg.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {analytics.task_distribution.map((seg: any) => (
                  <div key={seg.name} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: seg.color }} />
                      {seg.name}
                    </div>
                    <span className="font-medium">{seg.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white p-6 rounded-xl shadow-sm border col-span-2">
              <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
              <div className="space-y-3">
                {analytics.top_performers.map((s: any, idx: number) => (
                  <div key={s.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.tasksCompleted} tasks</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{s.avgScore}</span>
                      {trendIcon(s.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

