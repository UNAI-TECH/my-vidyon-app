import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

export function AdminConfig() {
    return (
        <AdminLayout>
            <PageHeader
                title="Global Configuration"
                subtitle="System-wide settings and parameters"
                actions={
                    <Button className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="dashboard-card">
                    <h3 className="font-semibold text-lg mb-6">General Settings</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Platform Name</Label>
                            <Input defaultValue="Edubridge Hub" />
                        </div>
                        <div className="space-y-2">
                            <Label>Support Email</Label>
                            <Input defaultValue="support@edubridge.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Default Language</Label>
                            <Select defaultValue="en">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English (US)</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Select defaultValue="utc">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                                    <SelectItem value="ist">IST (GMT+5:30)</SelectItem>
                                    <SelectItem value="est">EST (GMT-5)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3 className="font-semibold text-lg mb-6">Legal & Policy</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Terms of Service URL</Label>
                            <Input defaultValue="/terms" />
                        </div>
                        <div className="space-y-2">
                            <Label>Privacy Policy URL</Label>
                            <Input defaultValue="/privacy" />
                        </div>
                        <div className="space-y-2">
                            <Label>Footer Text</Label>
                            <Textarea defaultValue="© 2025 Edubridge Hub. All rights reserved." />
                        </div>
                    </div>
                </div>

                <div className="dashboard-card md:col-span-2">
                    <h3 className="font-semibold text-lg mb-6">SMTP Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>SMTP Host</Label>
                            <Input defaultValue="smtp.mailprovider.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Port</Label>
                            <Input defaultValue="587" />
                        </div>
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input defaultValue="mailer@edubridge.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" value="****************" readOnly />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
