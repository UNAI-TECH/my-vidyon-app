import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/common/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/common/Badge';
import { Plug, Key, RefreshCw, Copy } from 'lucide-react';

const apiKeys = [
    { id: 1, name: 'Mobile App V1', key: 'pk_live_...9f2a', created: '2025-01-15', lastUsed: 'Just now', status: 'active' },
    { id: 2, name: 'Website Client', key: 'pk_live_...a8b3', created: '2025-01-10', lastUsed: '5 mins ago', status: 'active' },
    { id: 3, name: 'Integration Partner', key: 'sk_test_...3c4d', created: '2025-02-01', lastUsed: '1 day ago', status: 'active' },
    { id: 4, name: 'Legacy System', key: 'sk_live_...e5f6', created: '2024-12-01', lastUsed: '1 week ago', status: 'inactive' },
];

export function AdminAPI() {
    return (
        <AdminLayout>
            <PageHeader
                title="API Management"
                subtitle="Manage API keys and access tokens"
                actions={
                    <Button className="btn-primary flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Generate New Key
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Active Keys" value="12" icon={Key} iconColor="text-primary" change="3 created this month" />
                <StatCard title="API Requests (24h)" value="1.2M" icon={Plug} iconColor="text-success" change="+5% from yesterday" changeType="positive" />
                <StatCard title="Error Rate" value="0.05%" icon={RefreshCw} iconColor="text-success" change="-0.01% improvement" changeType="positive" />
            </div>

            <div className="dashboard-card">
                <h3 className="font-semibold mb-4">API Keys</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client Name</TableHead>
                            <TableHead>API Key Prefix</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Used</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {apiKeys.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="font-mono text-muted-foreground">{item.key}</TableCell>
                                <TableCell>{item.created}</TableCell>
                                <TableCell>{item.lastUsed}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'active' ? 'success' : 'default'}>{item.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" title="Copy Key">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
