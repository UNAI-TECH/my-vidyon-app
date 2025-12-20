import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  Users,
  Building,
  TrendingUp,
  DollarSign,
  UserPlus,
} from 'lucide-react';

const enrollmentTrend = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1350 },
  { name: 'Mar', value: 1480 },
  { name: 'Apr', value: 1620 },
  { name: 'May', value: 1750 },
  { name: 'Jun', value: 1890 },
];

const departmentDistribution = [
  { name: 'Engineering', value: 850 },
  { name: 'Business', value: 620 },
  { name: 'Sciences', value: 480 },
  { name: 'Arts', value: 320 },
  { name: 'Law', value: 180 },
];

const feeCollection = [
  { name: 'Q1', value: 2.5 },
  { name: 'Q2', value: 3.2 },
  { name: 'Q3', value: 2.8 },
  { name: 'Q4', value: 3.8 },
];

const recentAdmissions = [
  { id: 1, name: 'James Wilson', program: 'B.Tech Computer Science', date: 'Dec 15, 2025', status: 'confirmed' },
  { id: 2, name: 'Olivia Martinez', program: 'MBA Finance', date: 'Dec 14, 2025', status: 'pending' },
  { id: 3, name: 'William Anderson', program: 'B.Sc Physics', date: 'Dec 14, 2025', status: 'confirmed' },
  { id: 4, name: 'Sophia Thomas', program: 'LLB', date: 'Dec 13, 2025', status: 'documents' },
  { id: 5, name: 'Benjamin Jackson', program: 'B.Com', date: 'Dec 12, 2025', status: 'confirmed' },
];

const topPerformingDepts = [
  { department: 'Computer Science', students: 420, faculty: 28, avgGPA: 3.65, placement: '92%' },
  { department: 'Electrical Eng.', students: 380, faculty: 24, avgGPA: 3.52, placement: '88%' },
  { department: 'Business Admin.', students: 340, faculty: 22, avgGPA: 3.48, placement: '85%' },
  { department: 'Mechanical Eng.', students: 310, faculty: 20, avgGPA: 3.41, placement: '82%' },
];

export function InstitutionDashboard() {
  const { user } = useAuth();

  const admissionColumns = [
    { key: 'name', header: 'Student Name' },
    { key: 'program', header: 'Program' },
    { key: 'date', header: 'Application Date' },
    {
      key: 'status',
      header: 'Status',
      render: (item: typeof recentAdmissions[0]) => {
        const variants: Record<string, 'success' | 'warning' | 'info'> = {
          confirmed: 'success',
          pending: 'warning',
          documents: 'info',
        };
        return <Badge variant={variants[item.status]}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Badge>;
      },
    },
  ];

  const deptColumns = [
    { key: 'department', header: 'Department' },
    { key: 'students', header: 'Students' },
    { key: 'faculty', header: 'Faculty' },
    { key: 'avgGPA', header: 'Avg. GPA' },
    { key: 'placement', header: 'Placement Rate' },
  ];

  return (
    <InstitutionLayout>
      <PageHeader
        title="Institution Overview"
        subtitle={`${user?.name} • Academic Year 2025-26`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value="2,450"
          icon={GraduationCap}
          iconColor="text-institution"
          change="+180 this semester"
          changeType="positive"
        />
        <StatCard
          title="Faculty Members"
          value={124}
          icon={Users}
          iconColor="text-primary"
          change="98% active"
        />
        <StatCard
          title="Departments"
          value={12}
          icon={Building}
          iconColor="text-info"
          change="5 courses each avg."
        />
        <StatCard
          title="Revenue (YTD)"
          value="$12.5M"
          icon={DollarSign}
          iconColor="text-success"
          change="+15% vs last year"
          changeType="positive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 dashboard-card">
          <h3 className="font-semibold mb-4">Enrollment Trend</h3>
          <AreaChart data={enrollmentTrend} color="hsl(var(--institution))" height={280} />
        </div>
        <div className="dashboard-card">
          <h3 className="font-semibold mb-4">Students by Department</h3>
          <DonutChart data={departmentDistribution} height={280} />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Recent Admissions */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Recent Admissions</h3>
            </div>
            <a href="/institution/admissions" className="text-sm text-primary hover:underline">View All</a>
          </div>
          <DataTable columns={admissionColumns} data={recentAdmissions} />
        </div>

        {/* Fee Collection */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <h3 className="font-semibold">Fee Collection (in M)</h3>
            </div>
          </div>
          <BarChart data={feeCollection} color="hsl(var(--success))" height={280} />
        </div>
      </div>

      {/* Department Performance */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Department Performance</h3>
          <a href="/institution/departments" className="text-sm text-primary hover:underline">Manage Departments</a>
        </div>
        <DataTable columns={deptColumns} data={topPerformingDepts} />
      </div>
    </InstitutionLayout>
  );
}
