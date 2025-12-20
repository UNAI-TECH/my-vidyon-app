import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/TranslationContext';
import { FileText, Download, Eye } from 'lucide-react';

const materials = [
    {
        course: 'Data Structures & Algorithms',
        items: [
            { name: 'Lecture 1 - Introduction to DS', type: 'PDF', size: '2.4 MB', date: 'Dec 10, 2025' },
            { name: 'Binary Trees Code Examples', type: 'ZIP', size: '1.2 MB', date: 'Dec 12, 2025' },
            { name: 'Assignment 3 - Solutions', type: 'PDF', size: '890 KB', date: 'Dec 15, 2025' },
        ]
    },
    {
        course: 'Database Management Systems',
        items: [
            { name: 'SQL Queries Tutorial', type: 'PDF', size: '3.1 MB', date: 'Dec 8, 2025' },
            { name: 'Normalization Examples', type: 'DOCX', size: '1.5 MB', date: 'Dec 11, 2025' },
            { name: 'Database Design Project', type: 'PDF', size: '2.8 MB', date: 'Dec 14, 2025' },
        ]
    },
    {
        course: 'Web Development',
        items: [
            { name: 'React Components Guide', type: 'PDF', size: '4.2 MB', date: 'Dec 9, 2025' },
            { name: 'Project Starter Code', type: 'ZIP', size: '5.6 MB', date: 'Dec 13, 2025' },
            { name: 'CSS Flexbox Cheatsheet', type: 'PDF', size: '650 KB', date: 'Dec 16, 2025' },
        ]
    },
];

export function StudentMaterials() {
    const { t } = useTranslation();

    return (
        <StudentLayout>
            <PageHeader
                title={t.nav.materials}
                subtitle={t.dashboard.overview}
            />

            <div className="space-y-6">
                {materials.map((course) => (
                    <div key={course.course} className="dashboard-card">
                        <h3 className="font-semibold mb-4">{course.course}</h3>

                        <div className="space-y-3">
                            {course.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.type} • {item.size} • {item.date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </StudentLayout>
    );
}
