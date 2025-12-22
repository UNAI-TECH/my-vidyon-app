import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/common/StatCard';
import { Badge } from '@/components/common/Badge';
import { Database, HardDrive, Share2, Download, RefreshCw } from 'lucide-react';

export function AdminDatabase() {
    return (
        <AdminLayout>
            <PageHeader
                title="Database Management"
                subtitle="Monitor database health, backups, and connections"
                actions={
                    <Button variant="outline" className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh Status
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Database Status" value="Healthy" icon={Database} iconColor="text-success" change="Uptime: 99.99%" />
                <StatCard title="Active Connections" value="450" icon={Share2} iconColor="text-primary" change="Peak: 620" />
                <StatCard title="Storage Used" value="452 GB" icon={HardDrive} iconColor="text-warning" change="of 1 TB (45%)" />
                <StatCard title="Last Backup" value="2h ago" icon={Download} iconColor="text-info" change="Size: 12 GB" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="dashboard-card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Recent Backups</h3>
                        <Button size="sm">Backup Now</Button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <Database className="w-5 h-5 text-primary" />
                                    <div>
                                        <div className="font-medium">Daily Automated Backup</div>
                                        <div className="text-xs text-muted-foreground">Nov {20 - i}, 2025 • 03:00 AM</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">12.5 GB</span>
                                    <Badge variant="success">Success</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3 className="font-semibold text-lg mb-6">Database Metrics</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>CPU Usage</span>
                                <span className="font-medium">12%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-success w-[12%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>Memory Usage</span>
                                <span className="font-medium">64%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[64%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>IOPS</span>
                                <span className="font-medium">2,400</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-info w-[40%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>Storage</span>
                                <span className="font-medium">45%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-warning w-[45%]" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg">
                        <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
                        <p className="text-sm text-muted-foreground mb-4">Be careful with these actions.</p>
                        <div className="flex gap-4">
                            <Button variant="destructive" size="sm">Restart Database</Button>
                            <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" size="sm">Clear Cache</Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
