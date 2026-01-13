import { useState, useEffect } from 'react';
import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export function FacultyUploadCertificate() {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [classes, setClasses] = useState<any[]>([]);
    const [availableSections, setAvailableSections] = useState<string[]>([]);
    const [students, setStudents] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        classId: '',
        section: '',
        studentId: '', // selected student ID
        title: '', // Category/Title
        description: '', // Course/Description
        file: null as File | null
    });

    useEffect(() => {
        if (user?.institutionId) {
            fetchClasses();
        }
    }, [user?.institutionId]);

    const fetchClasses = async () => {
        try {
            const { data: groupsWithClasses, error } = await supabase
                .from('groups')
                .select('classes(id, name, sections)')
                .eq('institution_id', user?.institutionId);

            if (error) throw error;

            if (groupsWithClasses) {
                const flatClasses = groupsWithClasses.flatMap(g => g.classes);
                setClasses(flatClasses);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleClassChange = (classId: string) => {
        const selectedClass = classes.find(c => c.id === classId);
        const sections = selectedClass?.sections || [];

        setFormData(prev => ({ ...prev, classId, section: '', studentId: '' }));
        setAvailableSections(sections);
        setStudents([]); // Clear students until section is selected
    };

    const handleSectionChange = async (section: string) => {
        setFormData(prev => ({ ...prev, section, studentId: '' }));
        setStudents([]);

        if (!formData.classId || !section) return;

        const selectedClass = classes.find(c => c.id === formData.classId);
        if (!selectedClass) {
            console.error("Selected class not found in classes list");
            return;
        }

        try {
            console.log(`Fetching students for: Class '${selectedClass.name}', Section '${section}'`);

            // Fetch students by class_name and section
            // We use class_name because students table is populated with class names (e.g. "10th", "12th") 
            // from the User Creation dialogs, not necessarily linked by class_id FK.
            const query = supabase
                .from('students')
                .select('id, name, admission_no')
                .eq('institution_id', user?.institutionId)
                .eq('class_name', selectedClass.name) // STRICT MATCH on Name
                .eq('section', section);

            const { data, error } = await query;

            if (error) throw error;
            console.log("Students found:", data?.length);
            setStudents(data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Could not fetch students');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, file: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.studentId || !formData.title || !formData.file || !user?.institutionId) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload File
            const file = formData.file;
            const fileExt = file.name.split('.').pop();
            const fileName = `cert-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.institutionId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('certificates')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('certificates')
                .getPublicUrl(filePath);

            // 2. Insert Record
            const { error: insertError } = await supabase
                .from('student_certificates')
                .insert({
                    title: formData.title,
                    student_id: formData.studentId,
                    course: formData.description, // Mapping description to course/details column
                    file_url: publicUrl,
                    institution_id: user.institutionId,
                    uploaded_by: user.id,
                    issued_date: new Date().toISOString(),
                    status: 'available', // if we add status column or just assume available
                    category: formData.title // Using title as category or vice versa
                });

            if (insertError) throw insertError;

            toast.success('Certificate uploaded successfully!');
            // Reset form
            setFormData({
                classId: '',
                section: '',
                studentId: '',
                title: '',
                description: '',
                file: null
            });
            setStudents([]);
            setAvailableSections([]); // Reset sections too or keep them? Reset ideally as classId is reset.

        } catch (error: any) {
            console.error('Upload failed:', error);
            toast.error(`Upload failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
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

                        {/* Class Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="studentClass">Select Class</Label>
                            <Select
                                value={formData.classId}
                                onValueChange={handleClassChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(cls => (
                                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Section Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="studentSection">Select Section</Label>
                            <Select
                                value={formData.section}
                                onValueChange={handleSectionChange}
                                disabled={!formData.classId || availableSections.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSections.map(sec => (
                                        <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Student Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="student">Select Student</Label>
                            <Select
                                value={formData.studentId}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, studentId: val }))}
                                disabled={!formData.section || students.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={!formData.section ? "Select Section first" : (students.length === 0 ? "No students found" : "Select Student")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map(std => (
                                        <SelectItem key={std.id} value={std.id}>
                                            {std.name} ({std.admission_no})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Certificate Details */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Certificate Category</Label>
                            <Select
                                value={formData.title}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, title: val }))}
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
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Course / Description</Label>
                            <Input
                                id="description"
                                placeholder="e.g. Web Development Bootcamp 2025"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                required
                            />
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <Label>Upload Certificate File</Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                {formData.file ? (
                                    <div className="flex flex-col items-center text-primary">
                                        <CheckCircle className="w-8 h-8 mb-2" />
                                        <p className="font-medium">{formData.file.name}</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-muted-foreground mb-4" />
                                        <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PDF, JPG or PNG (max. 10MB)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="btn-primary min-w-[120px]" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
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
