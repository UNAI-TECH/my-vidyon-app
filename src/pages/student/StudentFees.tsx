import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/TranslationContext';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Calendar } from 'lucide-react';

const feeStructure = [
    { item: 'Tuition Fee', amount: 15000, status: 'paid' as const },
    { item: 'Library Fee', amount: 500, status: 'paid' as const },
    { item: 'Lab Fee', amount: 2000, status: 'paid' as const },
    { item: 'Sports Fee', amount: 300, status: 'pending' as const },
    { item: 'Exam Fee', amount: 1200, status: 'pending' as const },
];

const paymentHistory = [
    { date: 'Nov 15, 2025', description: 'Semester Fee - Installment 1', amount: 10000, method: 'Credit Card', status: 'completed' },
    { date: 'Oct 10, 2025', description: 'Registration Fee', amount: 5000, method: 'Debit Card', status: 'completed' },
    { date: 'Sep 5, 2025', description: 'Admission Fee', amount: 3000, method: 'Bank Transfer', status: 'completed' },
];

const totalFees = feeStructure.reduce((sum, item) => sum + item.amount, 0);
const paidFees = feeStructure.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0);
const pendingFees = totalFees - paidFees;

export function StudentFees() {
    const { t } = useTranslation();
    return (
        <StudentLayout>
            <PageHeader
                title={t.nav.fees}
                subtitle={t.dashboard.overview}
            />

            {/* Fee Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="dashboard-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Fees</p>
                            <h3 className="text-2xl font-bold">₹{totalFees.toLocaleString()}</h3>
                        </div>
                        <CreditCard className="w-10 h-10 text-muted-foreground" />
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Paid</p>
                            <h3 className="text-2xl font-bold text-success">₹{paidFees.toLocaleString()}</h3>
                        </div>
                        <CheckCircle className="w-10 h-10 text-success" />
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Pending</p>
                            <h3 className="text-2xl font-bold text-warning">₹{pendingFees.toLocaleString()}</h3>
                        </div>
                        <AlertCircle className="w-10 h-10 text-warning" />
                    </div>
                </div>
            </div>

            {/* Fee Structure */}
            <div className="dashboard-card mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Fee Structure - Fall 2025</h3>
                    <Button className="btn-primary flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Pay Now
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="table-header text-left">Fee Item</th>
                                <th className="table-header text-right">Amount</th>
                                <th className="table-header text-center">Status</th>
                                <th className="table-header text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeStructure.map((fee, index) => (
                                <tr key={index} className="border-b border-border hover:bg-muted/50">
                                    <td className="table-cell font-medium">{fee.item}</td>
                                    <td className="table-cell text-right">₹{fee.amount.toLocaleString()}</td>
                                    <td className="table-cell text-center">
                                        <Badge variant={fee.status === 'paid' ? 'success' : 'warning'}>
                                            {fee.status === 'paid' ? 'Paid' : 'Pending'}
                                        </Badge>
                                    </td>
                                    <td className="table-cell text-center">
                                        {fee.status === 'pending' ? (
                                            <Button variant="outline" size="sm">Pay</Button>
                                        ) : (
                                            <Button variant="outline" size="sm" className="flex items-center gap-1 mx-auto">
                                                <Download className="w-3 h-3" />
                                                Receipt
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-border font-semibold">
                                <td className="table-cell">Total</td>
                                <td className="table-cell text-right">₹{totalFees.toLocaleString()}</td>
                                <td colSpan={2}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Payment History */}
            <div className="dashboard-card">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Payment History</h3>
                </div>

                <div className="space-y-3">
                    {paymentHistory.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div>
                                <p className="font-medium">{payment.description}</p>
                                <p className="text-sm text-muted-foreground">
                                    {payment.date} • {payment.method}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                                <Badge variant="success" className="mt-1">Completed</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </StudentLayout>
    );
}
