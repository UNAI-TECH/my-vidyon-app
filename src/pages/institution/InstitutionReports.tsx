import { useState, useEffect } from 'react';
import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/common/Badge';
import {
    FileText,
    Download,
    Filter,
    Plus,
    Calendar,
    Search,
    Loader2,
    FileSpreadsheet
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export function InstitutionReports() {
    const { user } = useAuth();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [generating, setGenerating] = useState(false);

    const [newReport, setNewReport] = useState({
        type: 'Attendance',
        period: 'Monthly',
        format: 'PDF'
    });

    useEffect(() => {
        if (!user?.institutionId) return;

        const fetchReports = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('institution_id', user.institutionId)
                    .order('generated_at', { ascending: false });

                if (error) throw error;
                setReports(data || []);
            } catch (err: any) {
                console.error("Error fetching reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();

        const channel = supabase.channel('reports_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reports', filter: `institution_id=eq.${user.institutionId}` }, () => fetchReports())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user?.institutionId]);

    const handleGenerateReport = async () => {
        if (!user?.institutionId) return;
        setGenerating(true);

        // Simulate "Processing" time
        setTimeout(async () => {
            try {
                const title = `${newReport.type} Report - ${newReport.period} (${newReport.format})`;
                const { error } = await supabase.from('reports').insert([{
                    institution_id: user.institutionId,
                    title: title,
                    type: newReport.type,
                    status: 'completed',
                    url: '#' // Mock URL
                }]);

                if (error) throw error;
                toast.success("Report generated successfully");
                setIsGenerateOpen(false);
            } catch (err: any) {
                toast.error("Failed to generate report");
            } finally {
                setGenerating(false);
            }
        }, 1500);
    };

    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <InstitutionLayout>
            <PageHeader
                title="Reports & Analytics"
                subtitle="Generate and download institution reports"
                actions={
                    <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Generate Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Generate New Report</DialogTitle>
                                <DialogDescription>Select parameters for your report.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Report Type</Label>
                                    <Select value={newReport.type} onValueChange={(v) => setNewReport({ ...newReport, type: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Attendance">Attendance Report</SelectItem>
                                            <SelectItem value="Academic">Academic Performance</SelectItem>
                                            <SelectItem value="Financial">Financial Statement</SelectItem>
                                            <SelectItem value="Staff">Staff Activity</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Period</Label>
                                    <Select value={newReport.period} onValueChange={(v) => setNewReport({ ...newReport, period: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                                            <SelectItem value="Yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Format</Label>
                                    <Select value={newReport.format} onValueChange={(v) => setNewReport({ ...newReport, format: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PDF">PDF Document</SelectItem>
                                            <SelectItem value="Excel">Excel Spreadsheet</SelectItem>
                                            <SelectItem value="CSV">CSV File</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleGenerateReport} disabled={generating}>
                                    {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {generating ? 'Generating...' : 'Generate'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reports..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <Card className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Report Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date Generated</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : filteredReports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No reports found. Generate one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        {report.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{report.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(report.generated_at), 'MMM dd, yyyy HH:mm')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={report.status === 'completed' ? 'success' : 'warning'}>
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <Download className="w-4 h-4 mr-2" /> Download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </InstitutionLayout>
    );
}
