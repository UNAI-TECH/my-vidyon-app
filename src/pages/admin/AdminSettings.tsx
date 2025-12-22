import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Lock, User } from 'lucide-react';

export function AdminSettings() {
    return (
        <AdminLayout>
            <PageHeader
                title="Admin Settings"
                subtitle="Manage your admin account preferences"
            />

            <div className="max-w-3xl space-y-8">
                <div className="dashboard-card">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <User className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Profile Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input defaultValue="System" />
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input defaultValue="Admin" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Email Address</Label>
                            <Input defaultValue="superadmin@erp.com" readOnly className="bg-muted" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button>Update Profile</Button>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Lock className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Security</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input type="password" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm Password</Label>
                                <Input type="password" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button variant="outline">Change Password</Button>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Bell className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Notifications</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Alerts</Label>
                                <p className="text-sm text-muted-foreground">Receive daily summaries and critical alerts via email</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Security Notifications</Label>
                                <p className="text-sm text-muted-foreground">Get notified about new logins and suspicious activity</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>System Health Reports</Label>
                                <p className="text-sm text-muted-foreground">Weekly system performance reports</p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
