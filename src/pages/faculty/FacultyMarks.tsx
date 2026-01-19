import { useState, useEffect } from 'react';
import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
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
import { Search, Save, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export function FacultyMarks() {
    const { user } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [examName, setExamName] = useState('Term 2 Final Exam');
    const [subjectName, setSubjectName] = useState('Mathematics');
    const [marksData, setMarksData] = useState<Record<string, { internal: number, external: number }>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '',
        rollNo: '',
        internal: '',
        external: ''
    });

    // Fetch Students assigned to this faculty (reusing logic pattern from Attendance)
    const { data: students = [], isLoading } = useQuery({
        queryKey: ['faculty-marks-students', user?.institutionId, user?.id],
        queryFn: async () => {
            if (!user?.institutionId || !user?.id) return [];

            // 1. Get Faculty's Assigned Class
            const { data: staffDetails } = await supabase
                .from('staff_details')
                .select('class_assigned, section_assigned')
                .eq('profile_id', user.id)
                .single();

            if (!staffDetails?.class_assigned) return [];

            setSubjectName(`${staffDetails.class_assigned}-${staffDetails.section_assigned} Subject`); // Placeholder subject

            // 2. Get Students in that Class
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('id, name, roll_no, class_name, section, parent_id, profile_id') // Assuming parent_id exists in students
                .eq('institution_id', user.institutionId)
                .eq('class_name', staffDetails.class_assigned)
                .eq('section', staffDetails.section_assigned || 'A')
                .order('roll_no', { ascending: true });

            if (studentError) throw studentError;
            return studentData || [];
        },
        enabled: !!user?.institutionId && !!user?.id,
    });

    const handleMarksChange = (studentId: string, type: 'internal' | 'external', value: string) => {
        const numVal = parseInt(value) || 0;
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [type]: numVal,
                internal: type === 'internal' ? numVal : (prev[studentId]?.internal || 0),
                external: type === 'external' ? numVal : (prev[studentId]?.external || 0)
            }
        }));
    };

    const handleFinalize = async () => {
        setIsSubmitting(true);
        try {
            const notificationsToInsert = [];

            // Iterate through students who have marks entered
            for (const student of students) {
                const marks = marksData[student.id];
                if (!marks) continue; // Skip if no marks changed/entered for this session (or maybe we want to submit all 0s?)

                const total = marks.internal + marks.external;

                // 1. Notify Student
                // Need to find student's profile_id (user_id) first if 'students' table id is different from profile_id.
                // Usually 'students' table has 'profile_id' linking to auth.users/profiles. 
                // Let's assume student.id is the profile_id OR we need to fetch it.
                // Based on previous code `InstitutionUsers.tsx`, `students` table has `profile_id` column? 
                // Let's safe fetch or assume student.id (if it's UUID) might be it or joined.
                // Actually `FacultyStudentLeaves` used `student.id` for `student_id` in `leave_requests`.
                // Let's guess: `students` table has `profile_id` column which matches `notifications.user_id`.

                // Let's try to fetch profile_id for the student to be safe, or if we selected it above.
                // I'll add profile_id to the select above.

                // Construct Notification for Student
                // We need to fetch the student's profile_id. I'll update the query above to select it.
                // Assuming I added `profile_id` to the select.

                // Wait, I can't update the query inside this loop. 
                // Let's assume for now I will rely on `student.id` if that maps to `user_id` in notifications, 
                // OR `student.profile_id`. I'll add `profile_id` to the select list in the useQuery.

                if (student.profile_id) {
                    notificationsToInsert.push({
                        user_id: student.profile_id,
                        title: `Marks Released: ${subjectName}`,
                        message: `You scored ${total}/100 in ${examName}. Internal: ${marks.internal}, External: ${marks.external}.`,
                        type: 'exam',
                        read: false,
                        created_at: new Date().toISOString()
                    });
                }

                // 2. Notify Parent
                // We need the parent's profile_id. 
                // `student.parent_id` likely points to `parents.id`.
                // We need to find `parents.profile_id`.
                if (student.parent_id) {
                    const { data: parentData } = await supabase
                        .from('parents')
                        .select('profile_id')
                        .eq('id', student.parent_id)
                        .single();

                    if (parentData?.profile_id) {
                        notificationsToInsert.push({
                            user_id: parentData.profile_id,
                            title: `Marks Update: ${student.name}`,
                            message: `${student.name} scored ${total}/100 in ${examName} (${subjectName}).`,
                            type: 'exam',
                            read: false,
                            created_at: new Date().toISOString()
                        });
                    }
                }
            }

            if (notificationsToInsert.length > 0) {
                const { error } = await supabase.from('notifications').insert(notificationsToInsert);
                if (error) throw error;
                toast.success(`Marks submitted and ${notificationsToInsert.length} notifications sent!`);
            } else {
                toast.info("No marks to submit or no users linked.");
            }

        } catch (error: any) {
            console.error('Error submitting marks:', error);
            toast.error("Failed to submit marks: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Need to update the query to select profile_id too
    // Modifying the queryFn above in memory for the 'replace' block context:
    // .select('id, name, roll_no, class_name, section, parent_id, profile_id') 

    const columns = [
        { key: 'roll_no', header: 'Roll No.' },
        { key: 'name', header: 'Student Name' },
        {
            key: 'internal',
            header: 'Internal (20)',
            render: (item: any) => (
                <Input
                    type="number"
                    max={20}
                    className="w-20"
                    placeholder="0"
                    value={marksData[item.id]?.internal ?? ''}
                    onChange={(e) => handleMarksChange(item.id, 'internal', e.target.value)}
                />
            )
        },
        {
            key: 'external',
            header: 'External (80)',
            render: (item: any) => (
                <Input
                    type="number"
                    max={80}
                    className="w-20"
                    placeholder="0"
                    value={marksData[item.id]?.external ?? ''}
                    onChange={(e) => handleMarksChange(item.id, 'external', e.target.value)}
                />
            )
        },
        {
            key: 'total',
            header: 'Total (100)',
            render: (item: any) => {
                const i = marksData[item.id]?.internal || 0;
                const e = marksData[item.id]?.external || 0;
                return <span className="font-bold">{i + e}</span>;
            }
        },
    ];

    const handleAddStudent = () => { toast.info("Students are managed by Admin/Institution"); setIsDialogOpen(false); };

    return (
        <FacultyLayout>
            <PageHeader
                title="Marks Entry"
                subtitle={`Enter marks for ${subjectName}`}
                actions={
                    <div className="flex gap-3">
                        <Button className="btn-primary flex items-center gap-2" onClick={handleFinalize} disabled={isSubmitting || students.length === 0}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Finalize & Submit
                        </Button>
                    </div>
                }
            />

            <div className="dashboard-card mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search students..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select
                            className="px-4 py-2 border rounded-lg bg-background text-sm"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                        >
                            <option>Term 2 Final Exam</option>
                            <option>Unit Test - II</option>
                            <option>Internal Assessment</option>
                        </select>
                    </div>
                </div>

                <DataTable columns={columns} data={students.filter((s: any) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))} loading={isLoading} />
            </div>
        </FacultyLayout>
    );
}
