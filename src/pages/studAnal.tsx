import React from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';
import {
  Award, CheckCircle, TrendingUp, Clock, Star
} from 'lucide-react';

/* -------------------------------------------------- */
/*  MOCK DATA                                          */
/* -------------------------------------------------- */
const studentInfo = {
  name: 'Sarah Johnson', id: 'MED2024001',
  specialization: 'Emergency Medicine', semester: '3rd Semester',
  avgScore: 4.2, rank: 3, totalStudents: 25, percentile: 88
};

const performanceHistory = [
  { date: '2024-08-01', task: 'Patient Assessment', score: 4 },
  { date: '2024-08-02', task: 'Emergency Response', score: 3 },
  { date: '2024-08-03', task: 'Treatment Plan',     score: 5 },
  { date: '2024-08-04', task: 'Follow-up Care',      score: 4 },
  { date: '2024-08-05', task: 'Patient Assessment', score: 5 },
  { date: '2024-08-06', task: 'Documentation',      score: 4 },
  { date: '2024-08-07', task: 'Emergency Response', score: 4 },
];

const weeklyProgress = [
  { week: 'Week 1', score: 3.8, tasks: 5, improvement: 0.2 },
  { week: 'Week 2', score: 4.0, tasks: 6, improvement: 0.2 },
  { week: 'Week 3', score: 4.2, tasks: 4, improvement: 0.2 },
  { week: 'Week 4', score: 4.1, tasks: 7, improvement: -0.1 },
  { week: 'Week 5', score: 4.3, tasks: 5, improvement: 0.2 },
  { week: 'Week 6', score: 4.5, tasks: 6, improvement: 0.2 },
];

const taskTypePerformance = [
  { type: 'Patient Assessment', avgScore: 4.6, completed: 8,  color: '#3B82F6' },
  { type: 'Treatment Plans',    avgScore: 4.2, completed: 5,  color: '#10B981' },
  { type: 'Emergency Response', avgScore: 3.8, completed: 6,  color: '#F59E0B' },
  { type: 'Follow-up Care',     avgScore: 4.0, completed: 4,  color: '#8B5CF6' },
  { type: 'Documentation',      avgScore: 4.4, completed: 3,  color: '#EF4444' },
];

const upcomingTasks = [
  { id: 1, title: 'Cardiac Assessment Protocol', due: '2024-08-10', priority: 'high',   est: '2 h' },
  { id: 2, title: 'Patient History Documentation', due: '2024-08-11', priority: 'medium', est: '1 h' },
  { id: 3, title: 'Emergency Triage Simulation',   due: '2024-08-12', priority: 'high',   est: '3 h' },
];

/* helpers */
const scoreColour = (s: number) =>
  s >= 4.5 ? 'bg-green-500' : s >= 4 ? 'bg-green-400'
  : s >= 3  ? 'bg-yellow-400' : 'bg-red-400';

const priorityColour = (p: string) =>
  p === 'high'   ? 'bg-red-100 text-red-800'
  : p === 'medium'? 'bg-yellow-100 text-yellow-800'
  :                 'bg-green-100 text-green-800';

/* -------------------------------------------------- */

const StudAnal: React.FC = () => (
  <div className="space-y-6">
    {/* --- Header bar --- */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {studentInfo.name}!</h2>
          <p className="opacity-90">{studentInfo.specialization} • {studentInfo.semester}</p>
          <p className="text-sm opacity-75">ID: {studentInfo.id}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-bold">{studentInfo.avgScore}/5.0</span>
          </div>
          <p className="text-sm opacity-90">Rank #{studentInfo.rank} / {studentInfo.totalStudents}</p>
        </div>
      </div>
    </div>

    {/* --- Stat cards --- */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Current Average',    value: studentInfo.avgScore,          icon: <Award      className="w-7 h-7 text-blue-500"/> , color: 'text-blue-600', delta: '+0.3 this month' },
        { label: 'Tasks Completed',    value: performanceHistory.length,     icon: <CheckCircle className="w-7 h-7 text-green-500"/>, color: 'text-green-600', delta: 'this week'        },
        { label: 'Class Rank',         value: `#${studentInfo.rank}`,         icon: <TrendingUp  className="w-7 h-7 text-purple-500"/>, color: 'text-purple-600', delta: `${studentInfo.percentile}th %ile` },
        { label: 'Pending Tasks',      value: upcomingTasks.length,          icon: <Clock       className="w-7 h-7 text-orange-500"/>, color: 'text-orange-600', delta: 'due this week'  },
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

    {/* --- Charts row --- */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* performance timeline */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Performance Timeline</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={performanceHistory.map((d, i) => ({ ...d, idx: i+1 }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="idx" tickFormatter={(i) => `Task ${i}`} />
            <YAxis domain={[0,5]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3}
                  dot={{ fill:'#3B82F6', r:5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* weekly progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#3B82F6" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* --- task-type bars + upcoming tasks --- */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* task-type performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">By Task Type</h3>
        <div className="space-y-4">
          {taskTypePerformance.map(t => (
            <div key={t.type}>
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t.type}</span>
                <span className="text-sm text-gray-600">{t.avgScore}/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="h-2 rounded-full" style={{
                  width: `${(t.avgScore/5)*100}%`, backgroundColor: t.color
                }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{t.completed} completed</span>
                <span>{Math.round((t.avgScore/5)*100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* upcoming tasks */}
      <div className="bg-white p-6 rounded-xl shadow-sm border col-span-2">
        <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
        <div className="space-y-3">
          {upcomingTasks.map(t => (
            <div key={t.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{t.title}</p>
                <p className="text-xs text-gray-600">Due: {t.due} • Est: {t.est}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColour(t.priority)}`}>
                {t.priority.charAt(0).toUpperCase()+t.priority.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default StudAnal;
