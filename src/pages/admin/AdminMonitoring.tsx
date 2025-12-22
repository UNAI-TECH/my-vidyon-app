import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { Activity, AlertTriangle, CheckCircle, Server, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const logs = [
    { id: 1, type: 'error', message: 'Connection timeout: DB_MAIN', timestamp: '2025-12-22 14:20:05', service: 'Database' },
    { id: 2, type: 'info', message: 'Backup completed successfully', timestamp: '2025-12-22 14:00:00', service: 'Backup' },
    { id: 3, type: 'warning', message: 'High memory usage detected (85%)', timestamp: '2025-12-22 13:45:12', service: 'Worker' },
    { id: 4, type: 'info', message: 'User batch import: 500 records', timestamp: '2025-12-22 12:30:00', service: 'API' },
    { id: 5, type: 'error', message: 'Payment gateway timeout', timestamp: '2025-12-22 11:15:30', service: 'Billing' },
];

export function AdminMonitoring() {
    return (
        <AdminLayout>
            <PageHeader
                title="System Monitoring"
                subtitle="Real-time system performance and error logs"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="dashboard-card border-l-4 border-l-success">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-success/10 rounded-lg">
                            <Server className="w-5 h-5 text-success" />
                        </div>
                        <h3 className="font-semibold">System Status</h3>
                    </div>
                    <p className="text-2xl font-bold text-success mb-1">Operational</p>
                    <p className="text-sm text-muted-foreground">All systems normal</p>
                </div>

                <div className="dashboard-card border-l-4 border-l-warning">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-warning/10 rounded-lg">
                            <Activity className="w-5 h-5 text-warning" />
                        </div>
                        <h3 className="font-semibold">Avg Response Time</h3>
                    </div>
                    <p className="text-2xl font-bold text-warning mb-1">245ms</p>
                    <p className="text-sm text-muted-foreground">Spike detected at 13:00</p>
                </div>

                <div className="dashboard-card border-l-4 border-l-info">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-info/10 rounded-lg">
                            <FileText className="w-5 h-5 text-info" />
                        </div>
                        <h3 className="font-semibold">Request Rate</h3>
                    </div>
                    <p className="text-2xl font-bold text-info mb-1">1,250 rpm</p>
                    <p className="text-sm text-muted-foreground">Currently stable</p>
                </div>
            </div>

            <div className="dashboard-card">
                <h3 className="font-semibold text-lg mb-4">System Logs</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Level</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {log.type === 'error' && <AlertTriangle className="w-4 h-4 text-destructive" />}
                                        {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-warning" />}
                                        {log.type === 'info' && <CheckCircle className="w-4 h-4 text-info" />}
                                        <span className={`uppercase text-xs font-bold ${log.type === 'error' ? 'text-destructive' : log.type === 'warning' ? 'text-warning' : 'text-info'}`}>
                                            {log.type}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{log.service}</TableCell>
                                <TableCell>{log.message}</TableCell>
                                <TableCell className="text-muted-foreground font-mono text-xs">{log.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
