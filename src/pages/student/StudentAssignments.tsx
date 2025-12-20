import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { AssignmentCard } from '@/components/cards/AssignmentCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/TranslationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const assignments = {
  pending: [
    { title: 'Binary Tree Implementation', course: 'Data Structures & Algorithms', dueDate: 'Dec 22, 2025', status: 'pending' as const },
    { title: 'E-R Diagram Design', course: 'Database Management Systems', dueDate: 'Dec 24, 2025', status: 'pending' as const },
    { title: 'Network Topology Analysis', course: 'Computer Networks', dueDate: 'Dec 26, 2025', status: 'pending' as const },
  ],
  submitted: [
    { title: 'SQL Query Optimization', course: 'Database Management Systems', dueDate: 'Dec 20, 2025', status: 'submitted' as const },
    { title: 'Responsive Landing Page', course: 'Web Development', dueDate: 'Dec 19, 2025', status: 'submitted' as const },
  ],
  graded: [
    { title: 'React Portfolio Project', course: 'Web Development', dueDate: 'Dec 18, 2025', status: 'graded' as const, grade: '95', maxGrade: '100' },
    { title: 'Sorting Algorithms Analysis', course: 'Data Structures & Algorithms', dueDate: 'Dec 15, 2025', status: 'graded' as const, grade: '88', maxGrade: '100' },
    { title: 'Process Scheduling Simulation', course: 'Operating Systems', dueDate: 'Dec 12, 2025', status: 'graded' as const, grade: '92', maxGrade: '100' },
  ],
  overdue: [
    { title: 'Thread Synchronization Lab', course: 'Operating Systems', dueDate: 'Dec 10, 2025', status: 'overdue' as const },
  ],
};

export function StudentAssignments() {
  const { t } = useTranslation();

  return (
    <StudentLayout>
      <PageHeader
        title={t.nav.assignments}
        subtitle={t.dashboard.overview}
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending ({assignments.pending.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({assignments.submitted.length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({assignments.graded.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({assignments.overdue.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {assignments.pending.map((assignment, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <AssignmentCard {...assignment} />
              </div>
              <Button className="btn-primary">{t.common.submit}</Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {assignments.submitted.map((assignment, index) => (
            <AssignmentCard key={index} {...assignment} />
          ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {assignments.graded.map((assignment, index) => (
            <AssignmentCard key={index} {...assignment} />
          ))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {assignments.overdue.map((assignment, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <AssignmentCard {...assignment} />
              </div>
              <Button variant="outline">Request Extension</Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </StudentLayout>
  );
}
