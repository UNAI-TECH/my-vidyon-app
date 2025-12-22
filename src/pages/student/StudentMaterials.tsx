import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/TranslationContext';
import { FileText, Download, Eye, Book, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const materials = [
    {
        course: 'Mathematics',
        items: [
            { name: 'Algebra Formula Sheet', type: 'PDF', size: '2.4 MB', date: 'Dec 10, 2025' },
            { name: 'Geometry Theorems', type: 'PDF', size: '1.2 MB', date: 'Dec 12, 2025' },
            { name: 'Trigonometry Practice Set', type: 'PDF', size: '890 KB', date: 'Dec 15, 2025' },
        ]
    },
    {
        course: 'Science',
        items: [
            { name: 'Physics: Laws of Motion', type: 'PDF', size: '3.1 MB', date: 'Dec 8, 2025' },
            { name: 'Chemistry: Periodic Table', type: 'PDF', size: '1.5 MB', date: 'Dec 11, 2025' },
            { name: 'Biology: Cell Structure', type: 'PDF', size: '2.8 MB', date: 'Dec 14, 2025' },
        ]
    },
    {
        course: 'English',
        items: [
            { name: 'Grammar Guide: Tenses', type: 'PDF', size: '4.2 MB', date: 'Dec 9, 2025' },
            { name: 'Poetry: The Road Not Taken', type: 'PDF', size: '5.6 MB', date: 'Dec 13, 2025' },
            { name: 'Essay Writing Tips', type: 'PDF', size: '650 KB', date: 'Dec 16, 2025' },
        ]
    },
];

const questionPapers = [
    {
        year: '2024',
        papers: [
            { subject: 'Mathematics', exam: 'Annual Exam 2024', type: 'PDF', size: '1.8 MB' },
            { subject: 'Science', exam: 'Annual Exam 2024', type: 'PDF', size: '2.1 MB' },
            { subject: 'English', exam: 'Annual Exam 2024', type: 'PDF', size: '1.5 MB' },
        ]
    },
    {
        year: '2023',
        papers: [
            { subject: 'Mathematics', exam: 'Annual Exam 2023', type: 'PDF', size: '1.6 MB' },
            { subject: 'Science', exam: 'Annual Exam 2023', type: 'PDF', size: '2.0 MB' },
            { subject: 'English', exam: 'Annual Exam 2023', type: 'PDF', size: '1.4 MB' },
        ]
    }
];

export function StudentMaterials() {
    const { t } = useTranslation();

    return (
        <StudentLayout>
            <PageHeader
                title={t.nav.materials}
                subtitle={t.dashboard.overview}
            />

            <Tabs defaultValue="materials" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="materials" className="flex items-center gap-2">
                        <Book className="w-4 h-4" />
                        Study Materials
                    </TabsTrigger>
                    <TabsTrigger value="papers" className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Previous Year Question Papers
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="materials">
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
                </TabsContent>

                <TabsContent value="papers">
                    <div className="space-y-6">
                        {questionPapers.map((yearGroup) => (
                            <div key={yearGroup.year} className="dashboard-card">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <History className="w-5 h-5 text-muted-foreground" />
                                    Academic Year {yearGroup.year}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {yearGroup.papers.map((paper, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{paper.subject}</p>
                                                    <p className="text-sm text-muted-foreground">{paper.exam}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{paper.size}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                                <Download className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </StudentLayout>
    );
}
