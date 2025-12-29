import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badge';
import { UserPlus, Search, Filter, Download, FileSpreadsheet } from 'lucide-react';

const applications = [
    { id: '1', name: 'Alice Thompson', program: 'Grade 10', date: 'Dec 18, 2025', status: 'pending', score: '92%' },
    { id: '2', name: 'Bob Roberts', program: 'Grade 9', date: 'Dec 15, 2025', status: 'approved', score: '88%' },
    { id: '3', name: 'Charlie Davis', program: 'Grade 11 (Science)', date: 'Dec 14, 2025', status: 'rejected', score: '75%' },
    { id: '4', name: 'Diana Prince', program: 'Grade 8', date: 'Dec 12, 2025', status: 'approved', score: '95%' },
    { id: '5', name: 'Edward Norton', program: 'Grade 11 (Commerce)', date: 'Dec 10, 2025', status: 'pending', score: '82%' },
];

export function InstitutionAdmissions() {
    const columns = [
        { key: 'name', header: 'Applicant Name' },
        { key: 'program', header: 'Class/Grade' },
        { key: 'date', header: 'Applied On' },
        { key: 'score', header: 'Eligibility Score' },
        {
            key: 'status',
            header: 'Status',
            render: (item: typeof applications[0]) => {
                const variants: Record<string, 'warning' | 'success' | 'destructive'> = {
                    pending: 'warning',
                    approved: 'success',
                    rejected: 'destructive',
                };
                return <Badge variant={variants[item.status]}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Badge>;
            },
        },
        {
            key: 'actions',
            header: 'Actions',
            render: () => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Review</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Archive</Button>
                </div>
            ),
        },
    ];

    return (
        <InstitutionLayout>
            <PageHeader
                title="Admissions"
                subtitle="Manage student applications and enrollment process"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search applications..."
                                className="input-field pl-10 w-64"
                            />
                        </div>
                        <Button
                            variant="default" // Changed to default green/primary to make it distinct as requested
                            className="flex items-center gap-2 bg-success hover:bg-success/90 text-white"
                            onClick={() => document.getElementById('excel-upload')?.click()}
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Import Excel File
                        </Button>
                        <input
                            type="file"
                            id="excel-upload"
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.length) {
                                    // Simulated import logic
                                    alert(`Importing details from ${e.target.files[0].name}...`);
                                    // In a real app, parse the excel here
                                }
                            }}
                        />
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                        <Button className="flex items-center gap-2" variant="secondary">
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="dashboard-card bg-primary/5 border-primary/20">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Applications</h4>
                    <span className="text-2xl font-bold">156</span>
                    <p className="text-xs text-primary mt-1">+12% from last week</p>
                </div>
                <div className="dashboard-card bg-success/5 border-success/20">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Approved</h4>
                    <span className="text-2xl font-bold">84</span>
                    <p className="text-xs text-success mt-1">54% conversion rate</p>
                </div>
                <div className="dashboard-card bg-warning/5 border-warning/20">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Pending Review</h4>
                    <span className="text-2xl font-bold">42</span>
                    <p className="text-xs text-warning mt-1">Requires attention</p>
                </div>
            </div>

            <div className="dashboard-card">
                <DataTable columns={columns} data={applications} />
            </div>
        </InstitutionLayout>
    );
}
