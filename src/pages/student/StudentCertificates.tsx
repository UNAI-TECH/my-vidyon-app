import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { useTranslation } from '@/i18n/TranslationContext';
import { Award, Download, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const certificates = [
    {
        title: 'Course Completion Certificate',
        course: 'Web Development Bootcamp',
        issueDate: 'Dec 1, 2025',
        status: 'available' as const,
        grade: 'A+',
    },
    {
        title: 'Participation Certificate',
        course: 'National Coding Competition 2025',
        issueDate: 'Nov 15, 2025',
        status: 'available' as const,
        grade: '2nd Place',
    },
    {
        title: 'Semester Certificate',
        course: 'Fall Semester 2025',
        issueDate: 'Pending',
        status: 'processing' as const,
        grade: 'GPA 3.75',
    },
    {
        title: 'Internship Completion',
        course: 'Summer Internship Program',
        issueDate: 'Aug 30, 2025',
        status: 'available' as const,
        grade: 'Excellent',
    },
];

export function StudentCertificates() {
    const { t } = useTranslation();

    return (
        <StudentLayout>
            <PageHeader
                title={t.nav.certificates}
                subtitle={t.dashboard.overview}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert, index) => (
                    <div key={index} className="dashboard-card hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Award className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{cert.title}</h3>
                                    <p className="text-sm text-muted-foreground">{cert.course}</p>
                                </div>
                            </div>
                            <Badge variant={cert.status === 'available' ? 'success' : 'warning'}>
                                {cert.status === 'available' ? 'Available' : 'Processing'}
                            </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Issue Date:</span>
                                <span className="font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {cert.issueDate}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Grade/Achievement:</span>
                                <span className="font-medium text-primary">{cert.grade}</span>
                            </div>
                        </div>

                        {cert.status === 'available' ? (
                            <Button className="w-full btn-primary flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                Download Certificate
                            </Button>
                        ) : (
                            <Button className="w-full" variant="outline" disabled>
                                Certificate Being Processed
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Info Box */}
            <div className="mt-8 p-6 bg-muted/50 rounded-lg border border-border">
                <h4 className="font-semibold mb-2">Certificate Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Certificates are issued within 2 weeks of course completion</li>
                    <li>• All certificates are digitally signed and verifiable</li>
                    <li>• Downloaded certificates are in PDF format</li>
                    <li>• For physical certificates, contact the administration office</li>
                </ul>
            </div>
        </StudentLayout>
    );
}
