import { useState, useEffect } from 'react';
import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Eye, Download, Calendar, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function FacultyExams() {
    const { user } = useAuth();
    const [materials, setMaterials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [materialType, setMaterialType] = useState<'exam' | 'study-material'>('exam');

    // Dropdown data
    const [availableClasses, setAvailableClasses] = useState<any[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
    const [availableSections, setAvailableSections] = useState<string[]>([]); // New state for sections

    const [newMaterial, setNewMaterial] = useState({
        title: '',
        subjectId: '',
        classId: '',
        section: '', // New field
        date: new Date().toISOString().split('T')[0],
        file: null as File | null
    });

    useEffect(() => {
        if (user?.institutionId) {
            fetchData();
            fetchDropdownData();
        }
    }, [user?.institutionId]);

    const fetchDropdownData = async () => {
        try {
            // Fetch Classes with Sections
            const { data: groupsWithClasses, error: groupError } = await supabase
                .from('groups')
                .select('classes(id, name, sections)') // Fetch sections array
                .eq('institution_id', user?.institutionId);

            if (!groupError && groupsWithClasses) {
                const flatClasses = groupsWithClasses.flatMap(g => g.classes);
                setAvailableClasses(flatClasses);
            }

            const { data: subjectsData } = await supabase
                .from('subjects')
                .select('id, name')
                .eq('institution_id', user?.institutionId);

            if (subjectsData) setAvailableSubjects(subjectsData);

        } catch (error) {
            console.error('Error fetching dropdowns:', error);
        }
    };

    const handleClassChange = (classId: string) => {
        setNewMaterial({ ...newMaterial, classId, section: '' });
        const selectedClass = availableClasses.find(c => c.id === classId);
        if (selectedClass && selectedClass.sections) {
            setAvailableSections(selectedClass.sections);
        } else {
            setAvailableSections([]);
        }
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('learning_resources')
                .select('*, subjects(name), classes(name)')
                .eq('institution_id', user?.institutionId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMaterials(data || []);
        } catch (error) {
            toast.error('Failed to load materials');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewMaterial({ ...newMaterial, file: e.target.files[0] });
        }
    };

    const handleAddMaterial = async () => {
        if (!newMaterial.title || !newMaterial.subjectId || !newMaterial.classId || !newMaterial.file || !user?.institutionId) {
            toast.error('Please fill all fields and select a file');
            return;
        }

        try {
            setIsUploading(true);
            const file = newMaterial.file;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.institutionId}/${fileName}`;

            // 1. Upload File
            const { error: uploadError } = await supabase.storage
                .from('learning-resources')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL (assuming bucket is public)
            const { data: { publicUrl } } = supabase.storage
                .from('learning-resources')
                .getPublicUrl(filePath);

            // 2. Insert Record
            const { error: insertError } = await supabase
                .from('learning_resources')
                .insert({
                    title: newMaterial.title,
                    institution_id: user.institutionId,
                    uploaded_by: user.id,
                    subject_id: newMaterial.subjectId,
                    class_id: newMaterial.classId,
                    section: newMaterial.section || null, // Insert section
                    resource_type: materialType === 'exam' ? 'question_paper' : 'study_material',
                    file_url: publicUrl,
                    description: '' // Optional
                });

            if (insertError) throw insertError;

            // 3. Notify Students
            try {
                const subjectName = availableSubjects.find(s => s.id === newMaterial.subjectId)?.name || 'Subject';
                const selectedClass = availableClasses.find(c => c.id === newMaterial.classId);
                const className = selectedClass?.name || 'Class';
                const typeLabel = materialType === 'exam' ? 'Question Paper' : 'Study Material';

                if (selectedClass) {
                    let studentQuery = supabase
                        .from('students')
                        .select('profile_id')
                        .eq('institution_id', user.institutionId)
                        .eq('class_name', className); // Using name match convention

                    if (newMaterial.section) {
                        studentQuery = studentQuery.eq('section', newMaterial.section);
                    }

                    const { data: studentsToNotify } = await studentQuery;

                    if (studentsToNotify && studentsToNotify.length > 0) {
                        const notifications = studentsToNotify
                            .filter(s => s.profile_id)
                            .map(s => ({
                                user_id: s.profile_id,
                                title: `New ${typeLabel}: ${subjectName}`,
                                message: `New material uploaded: "${newMaterial.title}" for ${className}${newMaterial.section ? '-' + newMaterial.section : ''}.`,
                                type: 'resource',
                                read: false
                            }));

                        if (notifications.length > 0) {
                            await supabase.from('notifications').insert(notifications);
                        }
                    }
                }
            } catch (notifyError) {
                console.error("Failed to send notifications:", notifyError);
                // Don't block success toast for notification failure
            }

            toast.success('Material uploaded successfully');
            setIsDialogOpen(false);
            setNewMaterial({ title: '', subjectId: '', classId: '', section: '', date: '', file: null });
            fetchData(); // Refresh list

        } catch (error: any) {
            console.error('Upload failed:', error);
            toast.error(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!confirm("Are you sure you want to delete this material?")) return;

        try {
            // Delete from DB
            const { error } = await supabase
                .from('learning_resources')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Deleted successfully');
            fetchData();
        } catch (error: any) {
            toast.error('Delete failed: ' + error.message);
        }
    };

    const filteredMaterials = materials.filter(m =>
        (materialType === 'exam' ? m.resource_type === 'question_paper' : m.resource_type === 'study_material')
    );

    return (
        <FacultyLayout>
            <PageHeader
                title="Materials"
                subtitle="Manage and upload study materials and examination papers"
            />

            {/* Material Type Toggle */}
            <div className="mb-6 flex gap-3">
                <Button
                    variant={materialType === 'exam' ? 'default' : 'outline'}
                    onClick={() => setMaterialType('exam')}
                >
                    Previous Year Question Papers
                </Button>
                <Button
                    variant={materialType === 'study-material' ? 'default' : 'outline'}
                    onClick={() => setMaterialType('study-material')}
                >
                    Study Materials
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMaterials.map((material) => (
                        <div key={material.id} className="dashboard-card group relative">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(material.id, material.file_url)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors truncate" title={material.title}>{material.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {material.subjects?.name || 'Unknown Subject'} • {material.classes?.name || 'Unknown Class'}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Uploaded: {new Date(material.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-border">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-2"
                                    onClick={() => window.open(material.file_url, '_blank')}
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-2"
                                    onClick={() => window.open(material.file_url, '_blank')}
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Upload Card - Trigger Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[250px]">
                                <div className="p-4 bg-muted rounded-full mb-4">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h4 className="font-semibold mb-1">Upload Material</h4>
                                <p className="text-xs text-muted-foreground max-w-[200px]">PDF, Word or Excel files accepted (Max 10MB)</p>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Upload New {materialType === 'exam' ? 'Question Paper' : 'Study Material'}</DialogTitle>
                                <DialogDescription>
                                    Add details for the new resource.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input
                                        id="title"
                                        value={newMaterial.title}
                                        onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Chapter 5 Notes"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="subject" className="text-right">Subject</Label>
                                    <div className="col-span-3">
                                        <Select onValueChange={(val) => setNewMaterial({ ...newMaterial, subjectId: val })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSubjects.map(sub => (
                                                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="class" className="text-right">Class</Label>
                                    <div className="col-span-3">
                                        <Select onValueChange={handleClassChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableClasses.map(cls => (
                                                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="section" className="text-right">Section</Label>
                                    <div className="col-span-3">
                                        <Select
                                            value={newMaterial.section}
                                            onValueChange={(val) => setNewMaterial({ ...newMaterial, section: val })}
                                            disabled={!newMaterial.classId || availableSections.length === 0}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Section (Optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSections.map(sec => (
                                                    <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="file" className="text-right">File</Label>
                                    <div className="col-span-3">
                                        <Input id="file" type="file" onChange={handleFileChange} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddMaterial} disabled={isUploading}>
                                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Upload
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </FacultyLayout>
    );
}
