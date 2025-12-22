import { useState } from 'react';
import { ParentLayout } from '@/layouts/ParentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Send, History } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/common/Badge';

// Mock Data (same as dashboard for consistency)
const myChildren = [
    { id: 'STU001', name: 'Alex Johnson', grade: 'Class 10-A' },
    { id: 'STU002', name: 'Emily Johnson', grade: 'Class 6-B' }
];

export function ParentLeave() {
    const [selectedChild, setSelectedChild] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChild || !startDate || !endDate || !reason) {
            toast.error('Please fill in all fields');
            return;
        }

        const childName = myChildren.find(c => c.id === selectedChild)?.name;
        toast.success(`Leave request submitted for ${childName}`);

        // Reset form
        setSelectedChild('');
        setStartDate('');
        setEndDate('');
        setReason('');
    };

    return (
        <ParentLayout>
            <PageHeader
                title="Leave Application"
                subtitle="Apply for leave on behalf of your children"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Application Form */}
                <div className="space-y-6">
                    <div className="dashboard-card">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <Calendar className="w-5 h-5" />
                            <h3 className="font-semibold text-lg">New Leave Request</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Student</Label>
                                <Select value={selectedChild} onValueChange={setSelectedChild}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select child..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {myChildren.map(child => (
                                            <SelectItem key={child.id} value={child.id}>
                                                {child.name} ({child.grade})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>From Date</Label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>To Date</Label>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Reason for Leave</Label>
                                <Textarea
                                    placeholder="Please allow leave because..."
                                    className="min-h-[120px]"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                <Send className="w-4 h-4 mr-2" />
                                Submit Request
                            </Button>
                        </form>
                    </div>
                </div>

                {/* History */}
                <div className="space-y-6">
                    <div className="dashboard-card">
                        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                            <History className="w-5 h-5" />
                            <h3 className="font-semibold text-lg">Leave History</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Mock History Items */}
                            <div className="p-4 rounded-lg bg-muted/30 border border-border">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium">Alex Johnson</h4>
                                        <span className="text-sm text-muted-foreground">Sick Leave</span>
                                    </div>
                                    <Badge variant="success">Approved</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Nov 12, 2025 - Nov 13, 2025 (2 days)
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-muted/30 border border-border">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium">Emily Johnson</h4>
                                        <span className="text-sm text-muted-foreground">Family Function</span>
                                    </div>
                                    <Badge variant="warning">Pending</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Dec 24, 2025 - Dec 25, 2025 (2 days)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                        <strong>Note:</strong> Leave applications should ideally be submitted at least 2 days in advance, except for medical emergencies.
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
