import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CheckCircle, XCircle, Search, Filter, UserPlus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useEffect } from 'react';

const students = [
    { id: 1, rollNo: '101', name: 'John Smith', class: 'Grade 10-A', lastAttendance: '92%', status: 'present' },
    { id: 2, rollNo: '102', name: 'Emily Johnson', class: 'Grade 10-A', lastAttendance: '88%', status: 'present' },
    { id: 3, rollNo: '103', name: 'Michael Brown', class: 'Grade 10-A', lastAttendance: '95%', status: 'absent' },
    { id: 4, rollNo: '104', name: 'Sarah Davis', class: 'Grade 10-A', lastAttendance: '72%', status: 'present' },
    { id: 5, rollNo: '105', name: 'James Wilson', class: 'Grade 10-A', lastAttendance: '98%', status: 'present' },
];

export function FacultyAttendance() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [newStudent, setNewStudent] = useState({
        name: '',
        rollNo: '',
        class: 'Grade 10-A'
    });

    const institutionId = user?.institutionId;
    const today = new Date().toISOString().split('T')[0];

    // 1. Fetch Students & Their Attendance for today
    const { data: students = [], isLoading } = useQuery({
        queryKey: ['faculty-attendance-list', institutionId, today],
        queryFn: async () => {
            if (!institutionId) return [];

            // Get students
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('*')
                .eq('institution_id', institutionId);

            if (studentError) throw studentError;

            // Get today's attendance
            const { data: attendanceData, error: attendanceError } = await supabase
                .from('student_attendance')
                .select('*')
                .eq('institution_id', institutionId)
                .eq('attendance_date', today);

            if (attendanceError) throw attendanceError;

            // Map attendance to students
            return (studentData || []).map(student => {
                const att = attendanceData?.find(a => a.student_id === student.id);
                return {
                    ...student,
                    status: att ? att.status : 'absent',
                    attendanceId: att?.id
                };
            });
        },
        enabled: !!institutionId,
    });

    // 2. Multi-table Real-time Sync
    useEffect(() => {
        if (!institutionId) return;

        const channel = supabase.channel('faculty-attendance-live')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'student_attendance',
                filter: `institution_id=eq.${institutionId}`
            }, () => {
                queryClient.invalidateQueries({ queryKey: ['faculty-attendance-list'] });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [institutionId, queryClient]);

    const toggleStatus = async (studentId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'present' ? 'absent' : 'present';

        try {
            if (newStatus === 'present') {
                const { error } = await supabase
                    .from('student_attendance')
                    .upsert({
                        student_id: studentId,
                        institution_id: institutionId,
                        attendance_date: today,
                        status: 'present'
                    });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('student_attendance')
                    .delete()
                    .eq('student_id', studentId)
                    .eq('attendance_date', today);
                if (error) throw error;
            }
            toast.success(`Marked as ${newStatus}`);
            queryClient.invalidateQueries({ queryKey: ['faculty-attendance-list'] });
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleAddStudent = async () => {
        if (!newStudent.name || !newStudent.rollNo) return;
        // ... handled via Institution Dashboard usually, but keeping local logic if needed
        toast.info("Use Institution Dashboard to manage registered students");
        setIsDialogOpen(false);
    };

    // Filter students
    const filteredAttendance = students.filter(s => {
        const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.register_number?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const columns = [
        { key: 'register_number', header: 'Reg No.' },
        { key: 'name', header: 'Student Name' },
        { key: 'class_name', header: 'Class' },
        {
            key: 'lastAttendance',
            header: 'Today',
            render: (item: any) => (
                <span className="text-xs text-muted-foreground">
                    {item.status === 'present' ? 'Recognized' : 'Pending'}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (item: any) => (
                <Badge variant={item.status === 'present' ? 'success' : 'destructive'}>
                    {item.status.toUpperCase()}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant={item.status === 'present' ? 'default' : 'outline'}
                        onClick={() => toggleStatus(item.id, item.status)}
                        className="h-8 w-8 p-0"
                    >
                        <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={item.status === 'absent' ? 'destructive' : 'outline'}
                        onClick={() => toggleStatus(item.id, item.status)}
                        className="h-8 w-8 p-0"
                    >
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <FacultyLayout>
            <PageHeader
                title="Attendance Management"
                subtitle="Mark and manage student attendance for your subjects"
                actions={
                    <div className="flex items-center gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-success hover:bg-success/90 text-white flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Add Student
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Student</DialogTitle>
                                    <DialogDescription>
                                        Enter student details to add them to the attendance list.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newStudent.name}
                                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                            className="col-span-3"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="rollNo" className="text-right">
                                            Roll No
                                        </Label>
                                        <Input
                                            id="rollNo"
                                            value={newStudent.rollNo}
                                            onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                                            className="col-span-3"
                                            placeholder="106"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="class" className="text-right">
                                            Class
                                        </Label>
                                        <Input
                                            id="class"
                                            value={newStudent.class}
                                            onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                                            className="col-span-3"
                                            placeholder="Grade 10-A"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleAddStudent}>Add Student</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filter: {filterStatus === 'all' ? 'All' : filterStatus === 'present' ? 'Present' : 'Absent'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                                    All Students
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus('present')}>
                                    Present Only
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus('absent')}>
                                    Absent Only
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button className="btn-primary">
                            Save Attendance
                        </Button>
                    </div>
                }
            />

            <div className="dashboard-card mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search students..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Institution: <strong>Live View</strong></span>
                        <span>•</span>
                        <span>Date: <strong>{new Date().toLocaleDateString()}</strong></span>
                    </div>
                </div>

                <DataTable columns={columns} data={filteredAttendance} loading={isLoading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card bg-success/5 border-success/20">
                    <h4 className="text-sm font-medium text-success mb-1">Present</h4>
                    <p className="text-2xl font-bold text-success">{students.filter(s => s.status === 'present').length}</p>
                </div>
                <div className="dashboard-card bg-destructive/5 border-destructive/20">
                    <h4 className="text-sm font-medium text-destructive mb-1">Absent</h4>
                    <p className="text-2xl font-bold text-destructive">{students.filter(s => s.status === 'absent').length}</p>
                </div>
                <div className="dashboard-card bg-info/5 border-info/20">
                    <h4 className="text-sm font-medium text-info mb-1">Total Strength</h4>
                    <p className="text-2xl font-bold text-info">{students.length}</p>
                </div>
            </div>
        </FacultyLayout>
    );
}
