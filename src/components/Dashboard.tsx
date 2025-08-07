import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/pages/AdminDashboard';
import StudentDashboard from '@/pages/StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
};

export default Dashboard;