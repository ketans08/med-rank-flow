import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';
import {
  Users, Award, ClipboardList, Target,
  ChevronUp, ChevronDown, Minus
} from 'lucide-react';

/* -------------------------------------------------- */
/*  MOCK DATA                                          */
/* -------------------------------------------------- */
const studentPerformanceData = [
  { name: 'Sarah Johnson', avgScore: 4.8, tasksCompleted: 24, acceptanceRate: 95, trend: 'up' },
  { name: 'Michael Chen',  avgScore: 4.6, tasksCompleted: 22, acceptanceRate: 89, trend: 'up' },
  { name: 'Emily Davis',   avgScore: 4.2, tasksCompleted: 18, acceptanceRate: 78, trend: 'stable' },
  { name: 'David Wilson',  avgScore: 3.9, tasksCompleted: 20, acceptanceRate: 85, trend: 'down' },
  { name: 'Lisa Brown',    avgScore: 3.6, tasksCompleted: 16, acceptanceRate: 72, trend: 'down' },
  { name: 'James Miller',  avgScore: 4.4, tasksCompleted: 21, acceptanceRate: 91, trend: 'up' },
  { name: 'Anna White',    avgScore: 4.1, tasksCompleted: 19, acceptanceRate: 82, trend: 'stable' },
  { name: 'Tom Black',     avgScore: 3.8, tasksCompleted: 17, acceptanceRate: 76, trend: 'up' },
];

const monthlyTrends = [
  { month: 'Jan', averageScore: 3.8, completionRate: 82, totalTasks: 45 },
  { month: 'Feb', averageScore: 4.0, completionRate: 85, totalTasks: 52 },
  { month: 'Mar', averageScore: 4.2, completionRate: 88, totalTasks: 48 },
  { month: 'Apr', averageScore: 4.3, completionRate: 90, totalTasks: 56 },
  { month: 'May', averageScore: 4.1, completionRate: 87, totalTasks: 61 },
  { month: 'Jun', averageScore: 4.4, completionRate: 92, totalTasks: 58 },
  { month: 'Jul', averageScore: 4.5, completionRate: 94, totalTasks: 63 },
  { month: 'Aug', averageScore: 4.6, completionRate: 96, totalTasks: 59 },
];

const taskTypeDistribution = [
  { name: 'Patient Assessment', value: 35, color: '#3B82F6' },
  { name: 'Treatment Plans',    value: 25, color: '#10B981' },
  { name: 'Emergency Response', value: 20, color: '#F59E0B' },
  { name: 'Follow-up Care',     value: 15, color: '#8B5CF6' },
  { name: 'Documentation',      value:  5, color: '#EF4444' },
];

/* -------------------------------------------------- */

const trendIcon = (trend: string) => {
  if (trend === 'up')   return <ChevronUp   className="w-4 h-4 text-green-500" />;
  if (trend === 'down') return <ChevronDown className="w-4 h-4 text-red-500"   />;
  return <Minus className="w-4 h-4 text-gray-400" />;
};

const AdminAnal: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------ HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
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

      {/* ---------------------------------------------- STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students',     value: '25',    icon: <Users        className="w-8 h-8 text-blue-500"   />, delta: '+2 this month',    color: 'text-green-600' },
          { label: 'Average Score',      value: '4.3',   icon: <Award        className="w-8 h-8 text-yellow-500" />, delta: '+0.2 vs prev',      color: 'text-green-600' },
          { label: 'Tasks This Month',   value: '156',   icon: <ClipboardList className="w-8 h-8 text-purple-500" />, delta: '12 pending',        color: 'text-blue-600' },
          { label: 'Completion Rate',    value: '94%',   icon: <Target       className="w-8 h-8 text-green-500"  />, delta: '+3 pp',             color: 'text-green-600' },
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

      {/* ------------------------------------------------ CHART ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- bar: student avg score --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Student Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#3B82F6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* --- area: monthly trend --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends}>
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

      {/* ------------------------------------------------ PIE + TOP 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={taskTypeDistribution}
                innerRadius={45}
                outerRadius={80}
                dataKey="value"
                paddingAngle={2}
              >
                {taskTypeDistribution.map((seg, idx) => (
                  <Cell key={idx} fill={seg.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {taskTypeDistribution.map((seg) => (
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

        {/* top 5 list */}
        <div className="bg-white p-6 rounded-xl shadow-sm border col-span-2">
          <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
          <div className="space-y-3">
            {studentPerformanceData
              .sort((a, b) => b.avgScore - a.avgScore)
              .slice(0, 5)
              .map((s, idx) => (
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
  );
};

export default AdminAnal;
