import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badge';
import { IndianRupee, Plus, Download, Edit } from 'lucide-react';

const feeStructures = [
    { id: '1', category: 'Tuition Fee - Engineering', frequency: 'Annual', amount: '₹12,000', lastUpdated: 'Dec 01, 2025', status: 'active' },
    { id: '2', category: 'Tuition Fee - Business', frequency: 'Annual', amount: '₹10,000', lastUpdated: 'Dec 01, 2025', status: 'active' },
    { id: '3', category: 'Library & Lab Fees', frequency: 'Semester', amount: '₹1,200', lastUpdated: 'Nov 15, 2025', status: 'active' },
    { id: '4', category: 'Examination Fee', frequency: 'Per Exam', amount: '₹200', lastUpdated: 'Nov 10, 2025', status: 'active' },
    { id: '5', category: 'Hostel & Mess', frequency: 'Annual', amount: '₹4,500', lastUpdated: 'Dec 05, 2025', status: 'active' },
];

export function InstitutionFees() {
    const columns = [
        { key: 'category', header: 'Fee Category' },
        { key: 'frequency', header: 'Frequency' },
        { key: 'amount', header: 'Amount' },
        { key: 'lastUpdated', header: 'Last Updated' },
        {
            key: 'status',
            header: 'Status',
            render: (item: typeof feeStructures[0]) => (
                <Badge variant="success">Active</Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: () => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">History</Button>
                </div>
            ),
        },
    ];

    return (
        <InstitutionLayout>
            <PageHeader
                title="Fee Structure"
                subtitle="Manage and configure fee categories for different programs"
                actions={
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download Schedule
                        </Button>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Fee Category
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-success/10 rounded-lg text-success">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Total Revenue (YTD)</span>
                    </div>
                    <span className="text-2xl font-bold">₹12.5M</span>
                </div>
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Outstanding</span>
                    </div>
                    <span className="text-2xl font-bold">₹1.2M</span>
                </div>
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-info/10 rounded-lg text-info">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Scholarships</span>
                    </div>
                    <span className="text-2xl font-bold">₹450K</span>
                </div>
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-warning/10 rounded-lg text-warning">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Refunds</span>
                    </div>
                    <span className="text-2xl font-bold">₹85K</span>
                </div>
            </div>

            <div className="dashboard-card">
                <DataTable columns={columns} data={feeStructures} />
            </div>
        </InstitutionLayout>
    );
}
