import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { CourseCard } from '@/components/cards/CourseCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const courses = [
    { title: 'Data Structures & Algorithms', code: 'CS201', instructor: 'You', students: 45, schedule: 'Mon, Wed 10:00 AM', status: 'active' as const },
    { title: 'Database Management Systems', code: 'CS301', instructor: 'You', students: 52, schedule: 'Tue, Thu 2:00 PM', status: 'active' as const },
    { title: 'Advanced Algorithms', code: 'CS401', instructor: 'You', students: 28, schedule: 'Wed, Fri 3:00 PM', status: 'active' as const },
    { title: 'Machine Learning Basics', code: 'CS501', instructor: 'You', students: 35, schedule: 'Mon, Thu 11:00 AM', status: 'active' as const },
];

export function FacultyCourses() {
    return (
        <FacultyLayout>
            <PageHeader
                title="My Courses"
                subtitle="Manage your assigned courses"
                actions={
                    <Button className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create New Course
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard key={course.code} {...course} />
                ))}
            </div>
        </FacultyLayout>
    );
}
