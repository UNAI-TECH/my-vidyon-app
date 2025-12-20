import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { useTranslation } from '@/i18n/TranslationContext';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

const attendanceData = [
  { name: 'Week 1', value: 100 },
  { name: 'Week 2', value: 85 },
  { name: 'Week 3', value: 92 },
  { name: 'Week 4', value: 88 },
  { name: 'Week 5', value: 95 },
  { name: 'Week 6', value: 90 },
];

const attendanceBySubject = [
  { name: 'CS201', value: 92 },
  { name: 'CS301', value: 88 },
  { name: 'CS205', value: 95 },
  { name: 'CS401', value: 85 },
];

const recentAttendance = [
  { id: 1, date: 'Dec 18, 2025', course: 'CS201', status: 'present', time: '10:00 AM' },
  { id: 2, date: 'Dec 18, 2025', course: 'CS301', status: 'present', time: '2:00 PM' },
  { id: 3, date: 'Dec 17, 2025', course: 'CS205', status: 'present', time: '11:00 AM' },
  { id: 4, date: 'Dec 17, 2025', course: 'CS401', status: 'absent', time: '9:00 AM' },
  { id: 5, date: 'Dec 16, 2025', course: 'CS201', status: 'present', time: '10:00 AM' },
  { id: 6, date: 'Dec 16, 2025', course: 'CS301', status: 'late', time: '2:15 PM' },
];

export function StudentAttendance() {
  const { t } = useTranslation();

  const columns = [
    { key: 'date', header: 'Date' },
    { key: 'course', header: 'Course' },
    { key: 'time', header: 'Time' },
    {
      key: 'status',
      header: 'Status',
      render: (item: typeof recentAttendance[0]) => {
        const config = {
          present: { variant: 'success' as const, icon: CheckCircle },
          absent: { variant: 'destructive' as const, icon: XCircle },
          late: { variant: 'warning' as const, icon: Clock },
        };
        const { variant, icon: Icon } = config[item.status as keyof typeof config];
        return (
          <Badge variant={variant} className="flex items-center gap-1 w-fit">
            <Icon className="w-3 h-3" />
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        );
      },
    },
  ];

  return (
    <StudentLayout>
      <PageHeader
        title={t.nav.attendance}
        subtitle={t.dashboard.overview}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Overall Attendance"
          value="91%"
          icon={CheckCircle}
          iconColor="text-success"
          change="Above 75% minimum"
          changeType="positive"
        />
        <StatCard
          title="Classes Attended"
          value="68"
          icon={Calendar}
          iconColor="text-primary"
          change="Out of 75 total"
        />
        <StatCard
          title="Classes Missed"
          value="5"
          icon={XCircle}
          iconColor="text-destructive"
          change="2 excused"
        />
        <StatCard
          title="Late Arrivals"
          value="2"
          icon={Clock}
          iconColor="text-warning"
          change="This semester"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 dashboard-card">
          <h3 className="font-semibold mb-4">Weekly Attendance Trend</h3>
          <AreaChart data={attendanceData} color="hsl(var(--success))" height={280} />
        </div>
        <div className="dashboard-card">
          <h3 className="font-semibold mb-4">Attendance by Subject (%)</h3>
          <DonutChart data={attendanceBySubject} height={280} />
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="dashboard-card">
        <h3 className="font-semibold mb-4">Recent Attendance Records</h3>
        <DataTable columns={columns} data={recentAttendance} />
      </div>
    </StudentLayout>
  );
}
