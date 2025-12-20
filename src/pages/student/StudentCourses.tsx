import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { CourseCard } from '@/components/cards/CourseCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/TranslationContext';
import { Search, Filter } from 'lucide-react';

const courses = [
  { title: 'Data Structures & Algorithms', code: 'CS201', instructor: 'Dr. Smith', progress: 75, students: 45, schedule: 'Mon, Wed 10:00 AM', status: 'active' as const },
  { title: 'Database Management Systems', code: 'CS301', instructor: 'Prof. Johnson', progress: 60, students: 52, schedule: 'Tue, Thu 2:00 PM', status: 'active' as const },
  { title: 'Web Development', code: 'CS205', instructor: 'Ms. Davis', progress: 85, students: 38, schedule: 'Mon, Fri 11:00 AM', status: 'active' as const },
  { title: 'Computer Networks', code: 'CS401', instructor: 'Dr. Brown', progress: 45, students: 40, schedule: 'Wed, Fri 9:00 AM', status: 'active' as const },
  { title: 'Operating Systems', code: 'CS302', instructor: 'Prof. Wilson', progress: 30, students: 48, schedule: 'Tue, Thu 10:00 AM', status: 'active' as const },
  { title: 'Machine Learning', code: 'CS501', instructor: 'Dr. Lee', progress: 0, students: 35, schedule: 'Mon, Wed 3:00 PM', status: 'upcoming' as const },
  { title: 'Software Engineering', code: 'CS402', instructor: 'Ms. Garcia', progress: 100, students: 42, schedule: 'Completed', status: 'completed' as const },
];

export function StudentCourses() {
  const { t } = useTranslation();

  return (
    <StudentLayout>
      <PageHeader
        title={t.nav.courses}
        subtitle={t.dashboard.overview}
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.common.search + '...'}
                className="input-field pl-10 w-64"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {t.common.filter}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.code} {...course} />
        ))}
      </div>
    </StudentLayout>
  );
}
