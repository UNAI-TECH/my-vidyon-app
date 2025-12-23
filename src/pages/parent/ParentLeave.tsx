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
import { useTranslation } from '@/i18n/TranslationContext';

// Mock Data (same as dashboard for consistency)
const myChildren = [
    { id: 'STU001', name: 'Alex Johnson', grade: 'Class 10-A' },
    { id: 'STU002', name: 'Emily Johnson', grade: 'Class 6-B' }
];

export function ParentLeave() {
    const { t } = useTranslation();
    const [selectedChild, setSelectedChild] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChild || !startDate || !endDate || !reason) {
            toast.error(t.parent.leave.fillAllFields);
            return;
        }

        const childName = myChildren.find(c => c.id === selectedChild)?.name;
        toast.success(`${t.parent.leave.submittedSuccess} ${childName}`);

        // Reset form
        setSelectedChild('');
        setStartDate('');
        setEndDate('');
        setReason('');
    };

    return (
        <ParentLayout>
            <PageHeader
                title={t.parent.leave.title}
                subtitle={t.parent.leave.subtitle}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Application Form */}
                <div className="space-y-6">
                    <div className="dashboard-card">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <Calendar className="w-5 h-5" />
                            <h3 className="font-semibold text-lg">{t.parent.leave.newRequest}</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t.parent.leave.selectStudent}</Label>
                                <Select value={selectedChild} onValueChange={setSelectedChild}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.parent.leave.selectChildPlaceholder} />
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
                                    <Label>{t.parent.leave.fromDate}</Label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.parent.leave.toDate}</Label>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{t.parent.leave.reason}</Label>
                                <Textarea
                                    placeholder={t.parent.leave.reasonPlaceholder}
                                    className="min-h-[120px]"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                <Send className="w-4 h-4 mr-2" />
                                {t.parent.leave.submitRequest}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* History */}
                <div className="space-y-6">
                    <div className="dashboard-card">
                        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                            <History className="w-5 h-5" />
                            <h3 className="font-semibold text-lg">{t.parent.leave.history}</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Mock History Items */}
                            <div className="p-4 rounded-lg bg-muted/30 border border-border">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium">Alex Johnson</h4>
                                        <span className="text-sm text-muted-foreground">Sick Leave</span>
                                    </div>
                                    <Badge variant="success">{t.parent.leave.approved}</Badge>
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
                                    <Badge variant="warning">{t.parent.leave.pending}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Dec 24, 2025 - Dec 25, 2025 (2 days)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                        <strong>{t.parent.leave.note}:</strong> {t.parent.leave.noteContent}
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
