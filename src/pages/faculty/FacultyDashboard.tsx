import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { CourseCard } from '@/components/cards/CourseCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { BarChart } from '@/components/charts/BarChart';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  Plus,
  Calendar,
} from 'lucide-react';

const classPerformance = [
  { name: 'CS201', value: 78 },
  { name: 'CS301', value: 82 },
  { name: 'CS205', value: 85 },
  { name: 'CS401', value: 72 },
];

const assignedCourses = [
  { title: 'Data Structures & Algorithms', code: 'CS201', instructor: 'You', students: 45, schedule: 'Mon, Wed 10:00 AM', status: 'active' as const },
  { title: 'Database Management Systems', code: 'CS301', instructor: 'You', students: 52, schedule: 'Tue, Thu 2:00 PM', status: 'active' as const },
  { title: 'Advanced Algorithms', code: 'CS401', instructor: 'You', students: 28, schedule: 'Wed, Fri 3:00 PM', status: 'active' as const },
];

const pendingSubmissions = [
  { id: 1, student: 'John Smith', assignment: 'Binary Tree Implementation', course: 'CS201', submitted: '2 hours ago', status: 'pending' },
  { id: 2, student: 'Emily Johnson', assignment: 'SQL Query Optimization', course: 'CS301', submitted: '5 hours ago', status: 'pending' },
  { id: 3, student: 'Michael Brown', assignment: 'Graph Algorithms', course: 'CS401', submitted: '1 day ago', status: 'pending' },
  { id: 4, student: 'Sarah Davis', assignment: 'Normalization Exercise', course: 'CS301', submitted: '1 day ago', status: 'pending' },
];

const todaySchedule = [
  { time: '10:00 AM', course: 'CS201', topic: 'Binary Search Trees', room: 'LH-101' },
  { time: '2:00 PM', course: 'CS301', topic: 'Query Optimization', room: 'LH-205' },
  { time: '4:00 PM', course: 'Office Hours', topic: 'Student Consultations', room: 'Faculty Block' },
];

export function FacultyDashboard() {
  const { user } = useAuth();

  const submissionColumns = [
    { key: 'student', header: 'Student' },
    { key: 'assignment', header: 'Assignment' },
    { key: 'course', header: 'Course' },
    { key: 'submitted', header: 'Submitted' },
    {
      key: 'status',
      header: 'Status',
      render: () => <Badge variant="warning">Pending Review</Badge>,
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <Button variant="outline" size="sm">
          Review
        </Button>
      ),
    },
  ];

  return (
    <FacultyLayout>
      <PageHeader
        title={`Good morning, ${user?.name.split(' ')[0]}!`}
        subtitle="Manage your courses and track student progress"
        actions={
          <Button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Assignment
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={125}
          icon={Users}
          iconColor="text-faculty"
          change="Across 3 courses"
        />
        <StatCard
          title="Active Courses"
          value={3}
          icon={BookOpen}
          iconColor="text-primary"
          change="Fall Semester 2025"
        />
        <StatCard
          title="Pending Reviews"
          value={12}
          icon={FileText}
          iconColor="text-warning"
          change="4 due today"
        />
        <StatCard
          title="Avg. Attendance"
          value="87%"
          icon={ClipboardCheck}
          iconColor="text-success"
          change="+2% this week"
          changeType="positive"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Performance Chart */}
        <div className="xl:col-span-2 dashboard-card">
          <h3 className="font-semibold mb-4">Class Performance Overview</h3>
          <BarChart data={classPerformance} color="hsl(var(--faculty))" height={280} />
        </div>

        {/* Today's Schedule */}
        <div className="dashboard-card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Today's Schedule</h3>
          </div>
          <div className="space-y-4">
            {todaySchedule.map((item, index) => (
              <div key={index} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium text-primary w-20 flex-shrink-0">
                  {item.time}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.course}</p>
                  <p className="text-xs text-muted-foreground">{item.topic}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">My Courses</h3>
          <a href="/faculty/courses" className="text-sm text-primary hover:underline">Manage Courses</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedCourses.map((course) => (
            <CourseCard key={course.code} {...course} />
          ))}
        </div>
      </div>

      {/* Pending Submissions */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Pending Submissions</h3>
          <a href="/faculty/assignments" className="text-sm text-primary hover:underline">View All</a>
        </div>
        <DataTable columns={submissionColumns} data={pendingSubmissions} />
      </div>
    </FacultyLayout>
  );
}
