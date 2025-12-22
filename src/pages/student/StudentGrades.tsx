import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { useTranslation } from '@/i18n/TranslationContext';
import { TrendingUp, Award } from 'lucide-react';

const gradesData = [
    { course: 'Mathematics', code: 'MAT10', midterm: 85, assignments: 90, final: 88, total: 88, grade: 'A1' },
    { course: 'Science', code: 'SCI10', midterm: 78, assignments: 85, final: 82, total: 82, grade: 'A2' },
    { course: 'English', code: 'ENG10', midterm: 92, assignments: 95, final: 90, total: 92, grade: 'A1' },
    { course: 'Social Studies', code: 'SST10', midterm: 75, assignments: 80, final: 78, total: 78, grade: 'B1' },
    { course: 'Hindi', code: 'HIN10', midterm: 88, assignments: 85, final: 86, total: 86, grade: 'A2' },
];

const semesterPercentage = '85%';
const overallPercentage = '83%';

export function StudentGrades() {
    const { t } = useTranslation();
    return (
        <StudentLayout>
            <PageHeader
                title={t.nav.grades}
                subtitle={t.dashboard.overview}
            />

            {/* GPA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="dashboard-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Semester %</p>
                            <h3 className="text-3xl font-bold text-primary">{semesterPercentage}</h3>
                            <p className="text-sm text-success mt-1 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                +2% from last semester
                            </p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Award className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Overall %</p>
                            <h3 className="text-3xl font-bold text-foreground">{overallPercentage}</h3>
                            <p className="text-sm text-muted-foreground mt-1">Overall Performance</p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <TrendingUp className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grades Table */}
            <div className="dashboard-card">
                <h3 className="font-semibold mb-6">Course Grades</h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="table-header text-left">Course</th>
                                <th className="table-header text-center">Code</th>
                                <th className="table-header text-center">Midterm</th>
                                <th className="table-header text-center">Assignments</th>
                                <th className="table-header text-center">Final</th>
                                <th className="table-header text-center">Total</th>
                                <th className="table-header text-center">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradesData.map((course) => (
                                <tr key={course.code} className="border-b border-border hover:bg-muted/50">
                                    <td className="table-cell font-medium">{course.course}</td>
                                    <td className="table-cell text-center text-muted-foreground">{course.code}</td>
                                    <td className="table-cell text-center">{course.midterm}</td>
                                    <td className="table-cell text-center">{course.assignments}</td>
                                    <td className="table-cell text-center">{course.final}</td>
                                    <td className="table-cell text-center font-semibold">{course.total}</td>
                                    <td className="table-cell text-center">
                                        <Badge variant={course.grade.startsWith('A') ? 'success' : course.grade.startsWith('B') ? 'info' : 'default'}>
                                            {course.grade}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </StudentLayout>
    );
}
