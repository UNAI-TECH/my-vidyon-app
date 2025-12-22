import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ParentLayout } from '@/layouts/ParentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart } from '@/components/charts/BarChart';
import { toast } from 'sonner';
import {
    GraduationCap,
    BookOpen,
    Calendar,
    ClipboardCheck,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Send
} from 'lucide-react';

// Mock Data
const STUDENT_DATA = {
    'STU001': {
        name: 'Alex Johnson',
        grade: 'Class 10-A',
        attendance: [
            { name: 'Mon', value: 100 },
            { name: 'Tue', value: 100 },
            { name: 'Wed', value: 0 },
            { name: 'Thu', value: 100 },
            { name: 'Fri', value: 100 },
        ],
        marks: [
            { subject: 'Mathematics', unitTest: '18/20', midTerm: '45/50', final: '92/100', grade: 'A1' },
            { subject: 'Science', unitTest: '16/20', midTerm: '42/50', final: '88/100', grade: 'A2' },
            { subject: 'English', unitTest: '19/20', midTerm: '48/50', final: '95/100', grade: 'A1' },
            { subject: 'Social Studies', unitTest: '15/20', midTerm: '40/50', final: '85/100', grade: 'A2' },
            { subject: 'Hindi', unitTest: '17/20', midTerm: '44/50', final: '90/100', grade: 'A1' },
        ],
        assignments: [
            { title: 'Algebra Worksheet', subject: 'Mathematics', dueDate: 'Dec 25, 2025', status: 'pending' },
            { title: 'Physics Lab Report', subject: 'Science', dueDate: 'Dec 22, 2025', status: 'submitted' },
            { title: 'History Essay', subject: 'Social Studies', dueDate: 'Dec 20, 2025', status: 'graded' },
        ]
    },
    'STU002': {
        name: 'Emily Johnson',
        grade: 'Class 6-B',
        attendance: [
            { name: 'Mon', value: 100 },
            { name: 'Tue', value: 100 },
            { name: 'Wed', value: 100 },
            { name: 'Thu', value: 100 },
            { name: 'Fri', value: 50 },
        ],
        marks: [
            { subject: 'Mathematics', score: 78, grade: 'B1', max: 100 },
            { subject: 'Science', score: 82, grade: 'A2', max: 100 },
            { subject: 'English', score: 88, grade: 'A2', max: 100 },
        ],
        assignments: [
            { title: 'Fractions', subject: 'Mathematics', dueDate: 'Dec 26, 2025', status: 'pending' },
            { title: 'Plant Life', subject: 'Science', dueDate: 'Dec 24, 2025', status: 'submitted' },
        ]
    }
};

export function ParentChildDetail() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const student = STUDENT_DATA[studentId as keyof typeof STUDENT_DATA];

    const [leaveRequest, setLeaveRequest] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });

    if (!student) {
        return (
            <ParentLayout>
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <h2 className="text-2xl font-bold mb-4">Student Not Found</h2>
                    <Button onClick={() => navigate('/parent')}>Go Back</Button>
                </div>
            </ParentLayout>
        );
    }

    const handleLeaveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`Leave request submitted for ${student.name}`);
        setLeaveRequest({ startDate: '', endDate: '', reason: '' });
    };

    const marksColumns = [
        { key: 'subject', header: 'Subject' },
        { key: 'unitTest', header: 'Unit Test I' },
        { key: 'midTerm', header: 'Mid Term' },
        { key: 'final', header: 'Final Exam' },
        {
            key: 'grade',
            header: 'Overall Grade',
            render: (row: any) => (
                <Badge variant={row.grade.startsWith('A') ? 'success' : 'info'}>{row.grade}</Badge>
            )
        }
    ];

    const assignmentsColumns = [
        { key: 'title', header: 'Assignment' },
        { key: 'subject', header: 'Subject' },
        { key: 'dueDate', header: 'Due Date' },
        {
            key: 'status',
            header: 'Status',
            render: (row: any) => (
                <Badge variant={
                    row.status === 'graded' ? 'success' :
                        row.status === 'submitted' ? 'info' : 'warning'
                }>
                    {row.status}
                </Badge>
            )
        }
    ];

    return (
        <ParentLayout>
            <PageHeader
                title={student.name}
                subtitle={`${student.grade} • Student Performance Overview`}
                actions={<Button variant="outline" onClick={() => navigate('/parent')}>Back to Dashboard</Button>}
            />

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="leave">Leave Request</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Attendance"
                            value="92%"
                            icon={ClipboardCheck}
                            iconColor="text-success"
                            change="+2% this month"
                            changeType="positive"
                        />
                        <StatCard
                            title="Avg. Grade"
                            value="A2"
                            icon={GraduationCap}
                            iconColor="text-primary"
                        />
                        <StatCard
                            title="Assignments"
                            value={`${student.assignments.filter(a => a.status === 'pending').length} Pending`}
                            icon={FileText}
                            iconColor="text-warning"
                        />
                        <StatCard
                            title="Next Exam"
                            value="Jan 15"
                            icon={Calendar}
                            iconColor="text-info"
                            change="Spring Sem"
                        />
                    </div>

                    <div className="dashboard-card">
                        <h3 className="font-semibold mb-6">Attendance Trend</h3>
                        <BarChart data={student.attendance} color="hsl(var(--primary))" height={300} />
                    </div>
                </TabsContent>

                {/* ACADEMIC TAB */}
                <TabsContent value="academic" className="space-y-6">
                    <div className="dashboard-card">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            Marks & Grades
                        </h3>
                        <DataTable columns={marksColumns} data={student.marks} />
                    </div>

                    <div className="dashboard-card">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Assignments Status
                        </h3>
                        <DataTable columns={assignmentsColumns} data={student.assignments} />
                    </div>
                </TabsContent>

                {/* ATTENDANCE TAB */}
                <TabsContent value="attendance">
                    <div className="dashboard-card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold">Detailed Attendance</h3>
                            <Badge variant="success">Present Today</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
                                <div className="text-3xl font-bold text-primary mb-1">180</div>
                                <div className="text-sm text-muted-foreground">Total Working Days</div>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
                                <div className="text-3xl font-bold text-success mb-1">165</div>
                                <div className="text-sm text-muted-foreground">Days Present</div>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
                                <div className="text-3xl font-bold text-warning mb-1">15</div>
                                <div className="text-sm text-muted-foreground">Days Absent</div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* LEAVE TAB */}
                <TabsContent value="leave">
                    <div className="dashboard-card max-w-2xl mx-auto">
                        <h3 className="font-semibold mb-2">Submit Leave Request</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Submitting a request does not guarantee approval. Please wait for confirmation.
                        </p>

                        <form onSubmit={handleLeaveSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="from">From Date</Label>
                                    <Input
                                        id="from"
                                        type="date"
                                        required
                                        value={leaveRequest.startDate}
                                        onChange={(e) => setLeaveRequest({ ...leaveRequest, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="to">To Date</Label>
                                    <Input
                                        id="to"
                                        type="date"
                                        required
                                        value={leaveRequest.endDate}
                                        onChange={(e) => setLeaveRequest({ ...leaveRequest, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason for Leave</Label>
                                <textarea
                                    id="reason"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Please provide the reason for absence..."
                                    required
                                    value={leaveRequest.reason}
                                    onChange={(e) => setLeaveRequest({ ...leaveRequest, reason: e.target.value })}
                                />
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full md:w-auto flex items-center gap-2">
                                    <Send className="w-4 h-4" />
                                    Submit Request
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 dashboard-card">
                        <h3 className="font-semibold mb-4">Past Leave Requests</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                                <div>
                                    <p className="font-medium text-sm">Sick Leave (2 days)</p>
                                    <p className="text-xs text-muted-foreground">Nov 12 - Nov 13, 2025</p>
                                </div>
                                <Badge variant="success">Approved</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                                <div>
                                    <p className="font-medium text-sm">Family Function (1 day)</p>
                                    <p className="text-xs text-muted-foreground">Oct 05, 2025</p>
                                </div>
                                <Badge variant="success">Approved</Badge>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </ParentLayout>
    );
}
