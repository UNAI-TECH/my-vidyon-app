import { ParentLayout } from '@/layouts/ParentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { Download, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const feesData = [
    {
        id: 1,
        student: 'Alex Johnson',
        type: 'Annual Tuition Fee',
        amount: '₹ 45,000',
        dueDate: 'Apr 10, 2025',
        status: 'paid',
        paymentDate: 'Apr 05, 2025',
        invoice: 'INV-2025-001'
    },
    {
        id: 2,
        student: 'Alex Johnson',
        type: 'Transport Fee (Q1)',
        amount: '₹ 8,000',
        dueDate: 'Apr 10, 2025',
        status: 'paid',
        paymentDate: 'Apr 05, 2025',
        invoice: 'INV-2025-002'
    },
    {
        id: 3,
        student: 'Alex Johnson',
        type: 'Term 2 Tuition Fee',
        amount: '₹ 45,000',
        dueDate: 'Oct 10, 2025',
        status: 'pending',
        invoice: 'INV-2025-056'
    },
    {
        id: 4,
        student: 'Emily Johnson',
        type: 'Annual Tuition Fee',
        amount: '₹ 35,000',
        dueDate: 'Apr 10, 2025',
        status: 'paid',
        paymentDate: 'Apr 02, 2025',
        invoice: 'INV-2025-003'
    }
];

export function ParentFees() {
    const handleDownload = (invoice: string) => {
        toast.success(`Downloading receipt ${invoice}...`);
    };

    return (
        <ParentLayout>
            <PageHeader
                title="Fees & Payments"
                subtitle="Track payment status and download receipts"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Due</p>
                            <h3 className="text-2xl font-bold">₹ 45,000</h3>
                        </div>
                    </div>
                </div>
                <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-success/10 text-success">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Paid This Year</p>
                            <h3 className="text-2xl font-bold">₹ 88,000</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="font-semibold text-lg">Fee Records</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Student</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Fee Type</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Amount</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Due Date</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feesData.map((item) => (
                                <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium">{item.student}</td>
                                    <td className="py-3 px-4 text-sm">{item.type}</td>
                                    <td className="py-3 px-4 text-sm font-semibold">{item.amount}</td>
                                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.dueDate}</td>
                                    <td className="py-3 px-4">
                                        <Badge variant={item.status === 'paid' ? 'success' : 'warning'} className="capitalize">
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                        {item.status === 'paid' ? (
                                            <Button variant="ghost" size="sm" onClick={() => handleDownload(item.invoice)}>
                                                <Download className="w-4 h-4 mr-2" />
                                                Receipt
                                            </Button>
                                        ) : (
                                            <Button size="sm" className="bg-primary text-white">
                                                Pay Now
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ParentLayout>
    );
}
