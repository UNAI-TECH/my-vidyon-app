import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import {
    Building2,
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    TrendingUp,
    DollarSign,
    Bell,
    MapPin,
    Mail,
    Phone,
    Edit,
    Power,
    RotateCcw,
    Download,
    Activity,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react';

// Mock data - in real app, this would come from API based on institutionId
const institutionData = {
    RPC001: {
        id: 'RPC001',
        name: 'Revoor Padmanabha Chattys Matriculation School',
        code: 'RPC001',
        type: 'Matriculation',
        location: 'Chennai, Tamil Nadu',
        address: '123 Anna Salai, Nungambakkam, Chennai - 600034',
        contactEmail: 'principal@rpc.edu.in',
        contactPhone: '+91 44 2833 1234',
        academicYear: '2024-2025',
        status: 'active',
        students: 1250,
        faculty: 68,
        classes: 15,
        sections: 28,
        attendance: 94.5,
        performance: 87.2,
        activeUsers: 1318,
    },
    TBM001: {
        id: 'TBM001',
        name: 'The Beloved Matriculation School',
        code: 'TBM001',
        type: 'Matriculation',
        location: 'Coimbatore, Tamil Nadu',
        address: '456 Avinashi Road, Coimbatore - 641018',
        contactEmail: 'admin@beloved.edu.in',
        contactPhone: '+91 422 2234 567',
        academicYear: '2024-2025',
        status: 'active',
        students: 980,
        faculty: 52,
        classes: 12,
        sections: 24,
        attendance: 92.8,
        performance: 85.6,
        activeUsers: 1032,
    },
};

const studentsData = [
    { id: 1, name: 'Aarav Kumar', registerNo: 'RPC2024001', class: '10', section: 'A', attendance: '96%', performance: 'A+' },
    { id: 2, name: 'Diya Sharma', registerNo: 'RPC2024002', class: '10', section: 'A', attendance: '94%', performance: 'A' },
    { id: 3, name: 'Arjun Patel', registerNo: 'RPC2024003', class: '10', section: 'B', attendance: '92%', performance: 'A' },
    { id: 4, name: 'Ananya Reddy', registerNo: 'RPC2024004', class: '9', section: 'A', attendance: '98%', performance: 'A+' },
    { id: 5, name: 'Rohan Singh', registerNo: 'RPC2024005', class: '9', section: 'B', attendance: '90%', performance: 'B+' },
];

const staffData = [
    { id: 1, name: 'Dr. Rajesh Kumar', staffId: 'RPC-T001', role: 'Teacher', subject: 'Mathematics', class: '10 A, B', email: 'rajesh@rpc.edu.in' },
    { id: 2, name: 'Mrs. Priya Sharma', staffId: 'RPC-T002', role: 'Teacher', subject: 'English', class: '9 A, B', email: 'priya@rpc.edu.in' },
    { id: 3, name: 'Mr. Suresh Babu', staffId: 'RPC-T003', role: 'Teacher', subject: 'Science', class: '10 A', email: 'suresh@rpc.edu.in' },
    { id: 4, name: 'Ms. Lakshmi Devi', staffId: 'RPC-A001', role: 'Admin', subject: 'N/A', class: 'N/A', email: 'lakshmi@rpc.edu.in' },
];

const classesData = [
    { id: 1, class: 'LKG', sections: ['A', 'B'], students: 60, subjects: 5 },
    { id: 2, class: 'UKG', sections: ['A', 'B'], students: 58, subjects: 5 },
    { id: 3, class: '1', sections: ['A', 'B', 'C'], students: 90, subjects: 6 },
    { id: 4, class: '10', sections: ['A', 'B'], students: 80, subjects: 8 },
    { id: 5, class: '12', sections: ['A', 'B'], students: 75, subjects: 6 },
];

const attendanceData = [
    { id: 1, date: '2024-12-19', class: '10 A', present: 38, absent: 2, total: 40, percentage: '95%' },
    { id: 2, date: '2024-12-19', class: '10 B', present: 36, absent: 4, total: 40, percentage: '90%' },
    { id: 3, date: '2024-12-18', class: '9 A', present: 42, absent: 3, total: 45, percentage: '93%' },
    { id: 4, date: '2024-12-18', class: '9 B', present: 40, absent: 2, total: 42, percentage: '95%' },
];

const performanceData = [
    { id: 1, exam: 'Mid-Term 2024', class: '10', avgScore: 87.5, passRate: '98%', topScore: 98 },
    { id: 2, exam: 'Mid-Term 2024', class: '9', avgScore: 85.2, passRate: '96%', topScore: 96 },
    { id: 3, exam: 'Quarterly 2024', class: '10', avgScore: 82.8, passRate: '95%', topScore: 95 },
];

const feeStatusData = [
    { id: 1, class: '10', totalStudents: 80, paid: 72, pending: 8, collectionRate: '90%' },
    { id: 2, class: '9', totalStudents: 87, paid: 80, pending: 7, collectionRate: '92%' },
    { id: 3, class: '8', totalStudents: 92, paid: 88, pending: 4, collectionRate: '96%' },
];

const notificationsData = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2024-12-20', type: 'event', status: 'scheduled' },
    { id: 2, title: 'Annual Day Celebration', date: '2024-12-25', type: 'event', status: 'scheduled' },
    { id: 3, title: 'Fee Payment Reminder', date: '2024-12-15', type: 'reminder', status: 'sent' },
];

export function InstitutionDetail() {
    const { institutionId } = useParams<{ institutionId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const institution = institutionData[institutionId as keyof typeof institutionData];

    if (!institution) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Institution Not Found</h3>
                    <p className="text-muted-foreground mb-4">The institution you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
                </div>
            </AdminLayout>
        );
    }

    const studentColumns = [
        { key: 'name', header: 'Name' },
        { key: 'registerNo', header: 'Register No.' },
        { key: 'class', header: 'Class' },
        { key: 'section', header: 'Section' },
        { key: 'attendance', header: 'Attendance' },
        { key: 'performance', header: 'Performance' },
    ];

    const staffColumns = [
        { key: 'name', header: 'Name' },
        { key: 'staffId', header: 'Staff ID' },
        { key: 'role', header: 'Role' },
        { key: 'subject', header: 'Subject' },
        { key: 'class', header: 'Class' },
        { key: 'email', header: 'Email' },
    ];

    const classColumns = [
        { key: 'class', header: 'Class' },
        {
            key: 'sections',
            header: 'Sections',
            render: (item: typeof classesData[0]) => item.sections.join(', ')
        },
        { key: 'students', header: 'Students' },
        { key: 'subjects', header: 'Subjects' },
    ];

    const attendanceColumns = [
        { key: 'date', header: 'Date' },
        { key: 'class', header: 'Class' },
        { key: 'present', header: 'Present' },
        { key: 'absent', header: 'Absent' },
        { key: 'total', header: 'Total' },
        { key: 'percentage', header: 'Percentage' },
    ];

    const performanceColumns = [
        { key: 'exam', header: 'Exam' },
        { key: 'class', header: 'Class' },
        { key: 'avgScore', header: 'Avg Score' },
        { key: 'passRate', header: 'Pass Rate' },
        { key: 'topScore', header: 'Top Score' },
    ];

    const feeColumns = [
        { key: 'class', header: 'Class' },
        { key: 'totalStudents', header: 'Total Students' },
        { key: 'paid', header: 'Paid' },
        { key: 'pending', header: 'Pending' },
        { key: 'collectionRate', header: 'Collection Rate' },
    ];

    const notificationColumns = [
        { key: 'title', header: 'Title' },
        { key: 'date', header: 'Date' },
        { key: 'type', header: 'Type' },
        {
            key: 'status',
            header: 'Status',
            render: (item: typeof notificationsData[0]) => (
                <Badge variant={item.status === 'sent' ? 'success' : 'info'}>
                    {item.status}
                </Badge>
            ),
        },
    ];

    const handleEdit = () => {
        console.log('Edit institution:', institutionId);
        // Navigate to edit page
    };

    const handleToggleStatus = () => {
        console.log('Toggle status for:', institutionId);
        // API call to toggle status
    };

    const handleReset = () => {
        console.log('Reset institution data:', institutionId);
        // API call to reset
    };

    const handleExport = () => {
        console.log('Export reports for:', institutionId);
        // Generate and download reports
    };

    return (
        <AdminLayout>
            <PageHeader
                title={institution.name}
                subtitle={`${institution.code} • ${institution.type}`}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleEdit}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleToggleStatus}>
                            <Power className="w-4 h-4 mr-2" />
                            {institution.status === 'active' ? 'Disable' : 'Enable'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleReset}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Data
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                }
            />

            {/* Institution Info Card */}
            <Card className="p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="font-medium">{institution.address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{institution.contactEmail}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{institution.contactPhone}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Students"
                    value={institution.students.toLocaleString()}
                    icon={GraduationCap}
                    iconColor="text-info"
                    change="+45 this month"
                    changeType="positive"
                />
                <StatCard
                    title="Total Staff"
                    value={institution.faculty.toString()}
                    icon={Users}
                    iconColor="text-success"
                    change="+3 this month"
                    changeType="positive"
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${institution.attendance}%`}
                    icon={CheckCircle}
                    iconColor="text-primary"
                    change="+2.3% from last month"
                    changeType="positive"
                />
                <StatCard
                    title="Performance"
                    value={`${institution.performance}%`}
                    icon={TrendingUp}
                    iconColor="text-warning"
                    change="+5.1% from last term"
                    changeType="positive"
                />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 flex-wrap h-auto">
                    <TabsTrigger value="overview">
                        <Activity className="w-4 h-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="students">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Students
                    </TabsTrigger>
                    <TabsTrigger value="staff">
                        <Users className="w-4 h-4 mr-2" />
                        Staff
                    </TabsTrigger>
                    <TabsTrigger value="classes">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Classes & Subjects
                    </TabsTrigger>
                    <TabsTrigger value="attendance">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Attendance
                    </TabsTrigger>
                    <TabsTrigger value="performance">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Performance
                    </TabsTrigger>
                    <TabsTrigger value="fees">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Fee Status
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Total Classes</span>
                                    <span className="font-semibold">{institution.classes}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Total Sections</span>
                                    <span className="font-semibold">{institution.sections}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Active Users</span>
                                    <span className="font-semibold">{institution.activeUsers}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Academic Year</span>
                                    <span className="font-semibold">{institution.academicYear}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant={institution.status === 'active' ? 'success' : 'destructive'}>
                                        {institution.status}
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Attendance marked for Class 10 A</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Fee payment reminder sent</p>
                                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Users className="w-5 h-5 text-info mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">New staff member added</p>
                                        <p className="text-xs text-muted-foreground">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="students">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Student List</h3>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                        <DataTable columns={studentColumns} data={studentsData} />
                    </Card>
                </TabsContent>

                <TabsContent value="staff">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Staff List</h3>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                        <DataTable columns={staffColumns} data={staffData} />
                    </Card>
                </TabsContent>

                <TabsContent value="classes">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Classes & Subjects</h3>
                        </div>
                        <DataTable columns={classColumns} data={classesData} />
                    </Card>
                </TabsContent>

                <TabsContent value="attendance">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Attendance Records</h3>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                        <DataTable columns={attendanceColumns} data={attendanceData} />
                    </Card>
                </TabsContent>

                <TabsContent value="performance">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Academic Performance</h3>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                        <DataTable columns={performanceColumns} data={performanceData} />
                    </Card>
                </TabsContent>

                <TabsContent value="fees">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Fee Collection Status</h3>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                        <DataTable columns={feeColumns} data={feeStatusData} />
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Notifications</h3>
                            <Button variant="outline" size="sm">
                                <Bell className="w-4 h-4 mr-2" />
                                Send New
                            </Button>
                        </div>
                        <DataTable columns={notificationColumns} data={notificationsData} />
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
