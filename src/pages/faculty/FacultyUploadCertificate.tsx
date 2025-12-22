import { useState } from 'react';
import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export function FacultyUploadCertificate() {
    const [formData, setFormData] = useState({
        studentName: '',
        studentEmail: '',
        studentClass: '',
        studentGrade: '',
        category: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call and persistent storage
        setTimeout(() => {
            // Create a mock certificate object
            const newCertificate = {
                title: formData.category, // Use category as title
                course: `Class ${formData.studentClass}`,
                issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'available',
                grade: formData.studentGrade,
                studentEmail: formData.studentEmail
            };

            // Get existing certificates or initialize empty array
            const existingCerts = JSON.parse(localStorage.getItem('mockCertificates') || '[]');

            // Add new certificate
            localStorage.setItem('mockCertificates', JSON.stringify([...existingCerts, newCertificate]));

            setIsSubmitting(false);
            setFormData({
                studentName: '',
                studentEmail: '',
                studentClass: '',
                studentGrade: '',
                category: '',
            });
            toast.success(`Certificate uploaded for ${formData.studentName}`);
        }, 1500);
    };

    return (
        <FacultyLayout>
            <PageHeader
                title="Upload Certificate"
                subtitle="Issue new certificates to students"
            />

            <div className="max-w-2xl mx-auto dashboard-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="studentName">Student Name</Label>
                                <Input
                                    id="studentName"
                                    name="studentName"
                                    placeholder="e.g. John Doe"
                                    value={formData.studentName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="studentEmail">Student Email ID</Label>
                                <Input
                                    id="studentEmail"
                                    name="studentEmail"
                                    type="email"
                                    placeholder="student@school.edu"
                                    value={formData.studentEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="studentClass">Student Class</Label>
                                <Select
                                    value={formData.studentClass}
                                    onValueChange={(value) => handleSelectChange('studentClass', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="9">Class 9</SelectItem>
                                        <SelectItem value="10">Class 10</SelectItem>
                                        <SelectItem value="11">Class 11</SelectItem>
                                        <SelectItem value="12">Class 12</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="studentGrade">Student Grade/Section</Label>
                                <Input
                                    id="studentGrade"
                                    name="studentGrade"
                                    placeholder="e.g. A"
                                    value={formData.studentGrade}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Certificate Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleSelectChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Academic Excellence">Academic Excellence</SelectItem>
                                    <SelectItem value="Sports Achievement">Sports Achievement</SelectItem>
                                    <SelectItem value="Perfect Attendance">Perfect Attendance</SelectItem>
                                    <SelectItem value="Course Completion">Course Completion</SelectItem>
                                    <SelectItem value="Participation">Participation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* File Upload Placeholder */}
                        <div className="space-y-2">
                            <Label>Upload Certificate File</Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 text-muted-foreground mb-4" />
                                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, JPG or PNG (max. 10MB)</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="btn-primary min-w-[120px]" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>Posting...</>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Post Certificate
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </FacultyLayout>
    );
}
