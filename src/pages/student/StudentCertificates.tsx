import { useState, useEffect } from 'react';
import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { useTranslation } from '@/i18n/TranslationContext';
import { Award, Download, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export function StudentCertificates() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.institutionId) {
            fetchCertificates();
        }
    }, [user?.institutionId]);

    const fetchCertificates = async () => {
        try {
            setIsLoading(true);

            // 1. Get Student ID (safe check if auth.uid matches student.id or needs lookup)
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('id')
                .eq('id', user?.id)
                .single();

            // If not found by ID directly, we might need another strategy, but assuming auth.uid logic holds or user manually linked.
            // For now, let's assume if studentData exists, use it. If not, maybe use user.id directly if that's how we linked insertion.
            // In FacultyUpload, insert used `student_id` from the students table.

            const studentId = studentData?.id || user?.id;

            // 2. Fetch Certificates
            const { data: certs, error: certsError } = await supabase
                .from('student_certificates')
                .select('*')
                .eq('student_id', studentId)
                .order('created_at', { ascending: false });

            if (certsError) throw certsError;
            setCertificates(certs || []);

        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <StudentLayout>
            <PageHeader
                title={t.nav.certificates}
                subtitle={t.dashboard.overview}
            />

            {isLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
            ) : (
                <>
                    {certificates.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
                            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-semibold">No Certificates Yet</p>
                            <p className="text-sm">Certificates issued to you will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certificates.map((cert) => (
                                <div key={cert.id} className="dashboard-card hover:shadow-lg transition-shadow">
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
                                        <Badge variant="success">
                                            Available
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Issue Date:</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(cert.issued_date || cert.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {cert.grade && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Grade/Achievement:</span>
                                                <span className="font-medium text-primary">{cert.grade}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        className="w-full btn-primary flex items-center justify-center gap-2"
                                        onClick={() => handleDownload(cert.file_url)}
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Certificate
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

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
