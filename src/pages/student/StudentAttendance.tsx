import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { useTranslation } from '@/i18n/TranslationContext';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export function StudentAttendance() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch Student Profile
  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile', user?.email],
    queryFn: async () => {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('email', user?.email)
        .single();
      return data;
    },
    enabled: !!user?.email,
  });

  // 2. Fetch Attendance History
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['student-attendance-history', studentProfile?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('student_attendance')
        .select('*')
        .eq('student_id', studentProfile?.id)
        .order('attendance_date', { ascending: false });
      return (data || []).map(record => ({
        id: record.id,
        date: new Date(record.attendance_date).toLocaleDateString(),
        course: 'General Attendance', // Default unless subject-wise is implemented
        status: record.status,
        time: new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    },
    enabled: !!studentProfile?.id,
  });

  // 3. Real-time Subscription
  useEffect(() => {
    if (!studentProfile?.id) return;

    const channel = supabase.channel('student-attendance-personal')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_attendance',
        filter: `student_id=eq.${studentProfile.id}`
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['student-attendance-history'] });
        queryClient.invalidateQueries({ queryKey: ['student-attendance-rate'] }); // From dashboard
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [studentProfile?.id, queryClient]);

  // 4. Calculate Stats
  const presentCount = history.filter(h => h.status === 'present').length;
  const absentCount = history.filter(h => h.status === 'absent').length;
  const attendanceRate = history.length > 0 ? Math.round((presentCount / history.length) * 100) : 0;


  const columns = [
    { key: 'date', header: 'Date' },
    { key: 'course', header: 'Course' },
    { key: 'time', header: 'Time' },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => {
        const config = {
          present: { variant: 'success' as const, icon: CheckCircle },
          absent: { variant: 'destructive' as const, icon: XCircle },
          late: { variant: 'warning' as const, icon: Clock },
        };
        const status = (item.status || 'absent').toLowerCase() as keyof typeof config;
        const { variant, icon: Icon } = config[status] || config.absent;
        return (
          <Badge variant={variant} className="flex items-center gap-1 w-fit">
            <Icon className="w-3 h-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
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
          value={`${attendanceRate}%`}
          icon={CheckCircle}
          iconColor="text-success"
          change={attendanceRate >= 75 ? "Above 75% minimum" : "Warning: Below 75%"}
          changeType={attendanceRate >= 75 ? "positive" : "negative"}
        />
        <StatCard
          title="Days Present"
          value={presentCount}
          icon={Calendar}
          iconColor="text-primary"
          change={`Out of ${history.length} recorded days`}
        />
        <StatCard
          title="Days Absent"
          value={absentCount}
          icon={XCircle}
          iconColor="text-destructive"
          change="Recognized by System"
        />
        <StatCard
          title="Streak"
          value="N/A"
          icon={Clock}
          iconColor="text-warning"
          change="Consistency Tracker"
        />
      </div>

      {/* Charts (Hidden for now until enough data) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 dashboard-card">
          <h3 className="font-semibold mb-4">Weekly Attendance Trend</h3>
          <AreaChart data={[]} color="hsl(var(--success))" height={280} />
          <p className="text-sm text-muted-foreground text-center py-10 italic">Data will appear as you scan daily</p>
        </div>
        <div className="dashboard-card">
          <h3 className="font-semibold mb-4">Attendance Rate</h3>
          <DonutChart data={[{ name: 'Present', value: attendanceRate }, { name: 'Absent', value: 100 - attendanceRate }]} height={280} />
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="dashboard-card">
        <h3 className="font-semibold mb-4">Recent Attendance Records</h3>
        <DataTable columns={columns} data={history} loading={isLoading} />
      </div>
    </StudentLayout>
  );
}
