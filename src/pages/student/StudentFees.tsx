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
            <div className="stats-grid mb-6 sm:mb-8">
                <div className="dashboard-card p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Fees</p>
                            <h3 className="text-xl sm:text-2xl font-bold truncate">₹{totalFees.toLocaleString()}</h3>
                        </div>
                        <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground flex-shrink-0" />
                    </div>
                </div>

                <div className="dashboard-card p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Paid</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-success truncate">₹{paidFees.toLocaleString()}</h3>
                        </div>
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-success flex-shrink-0" />
                    </div>
                </div>

                <div className="dashboard-card p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Pending</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-warning truncate">₹{pendingFees.toLocaleString()}</h3>
                        </div>
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-warning flex-shrink-0" />
                    </div>
                </div>
            </div>

            {/* Fee Structure */}
            <div className="dashboard-card p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <h3 className="font-semibold text-sm sm:text-base">Fee Structure - Fall 2025</h3>
                    <Button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center min-h-[44px]">
                        <CreditCard className="w-4 h-4" />
                        Pay Now
                    </Button>
                </div>

                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-3">
                    {feeStructure.map((fee, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">{fee.item}</p>
                                <p className="text-lg font-semibold mt-1">₹{fee.amount.toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-3">
                                <Badge variant={fee.status === 'paid' ? 'success' : 'warning'}>
                                    {fee.status === 'paid' ? 'Paid' : 'Pending'}
                                </Badge>
                                <Button variant="outline" size="sm" className="min-h-[36px]">
                                    {fee.status === 'pending' ? 'Pay' : 'Receipt'}
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border-2 border-primary/20">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">₹{totalFees.toLocaleString()}</span>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="table-header text-left py-2 sm:py-3 px-2 sm:px-4">Fee Item</th>
                                <th className="table-header text-right py-2 sm:py-3 px-2 sm:px-4">Amount</th>
                                <th className="table-header text-center py-2 sm:py-3 px-2 sm:px-4">Status</th>
                                <th className="table-header text-center py-2 sm:py-3 px-2 sm:px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeStructure.map((fee, index) => (
                                <tr key={index} className="border-b border-border hover:bg-muted/50">
                                    <td className="table-cell font-medium py-3 sm:py-4 px-2 sm:px-4">{fee.item}</td>
                                    <td className="table-cell text-right py-3 sm:py-4 px-2 sm:px-4">₹{fee.amount.toLocaleString()}</td>
                                    <td className="table-cell text-center py-3 sm:py-4 px-2 sm:px-4">
                                        <Badge variant={fee.status === 'paid' ? 'success' : 'warning'}>
                                            {fee.status === 'paid' ? 'Paid' : 'Pending'}
                                        </Badge>
                                    </td>
                                    <td className="table-cell text-center py-3 sm:py-4 px-2 sm:px-4">
                                        {fee.status === 'pending' ? (
                                            <Button variant="outline" size="sm" className="min-h-[36px]">Pay</Button>
                                        ) : (
                                            <Button variant="outline" size="sm" className="flex items-center gap-1 mx-auto min-h-[36px]">
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
                                <td className="table-cell py-3 sm:py-4 px-2 sm:px-4">Total</td>
                                <td className="table-cell text-right py-3 sm:py-4 px-2 sm:px-4">₹{totalFees.toLocaleString()}</td>
                                <td colSpan={2}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Payment History */}
            <div className="dashboard-card p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <h3 className="font-semibold text-sm sm:text-base">Payment History</h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    {paymentHistory.map((payment, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
                            <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{payment.description}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {payment.date} • {payment.method}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-semibold text-sm sm:text-base">₹{payment.amount.toLocaleString()}</p>
                                <Badge variant="success" className="mt-1">Completed</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </StudentLayout>
    );
}
