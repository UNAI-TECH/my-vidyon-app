import { useState } from 'react';
import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Building, Bell, Shield, Globe, Save } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function InstitutionSettings() {
    const [activeTab, setActiveTab] = useState('general');

    const handleSave = () => {
        toast.success("Settings saved successfully");
    };

    const tabs = [
        { id: 'general', label: 'General Info', icon: Building },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'integration', label: 'Website Integration', icon: Globe },
        { id: 'system', label: 'System Config', icon: SettingsIcon },
    ];

    return (
        <InstitutionLayout>
            <PageHeader
                title="Settings"
                subtitle="Configure institutional preferences and profile information"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'general' && (
                        <>
                            <div className="dashboard-card pt-6">
                                <h3 className="text-lg font-semibold mb-6">General Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Institution Name</Label>
                                        <Input defaultValue="EduBridge University" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Institution Code</Label>
                                        <Input defaultValue="EBU-2025" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <Input type="email" defaultValue="admin@edubridge.edu" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Contact Number</Label>
                                        <Input type="tel" defaultValue="+1 234 567 8900" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label>Address</Label>
                                        <textarea className="input-field min-h-[100px]" defaultValue="123 Education Lane, Academic City, State 54321, USA" />
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-card pt-6">
                                <h3 className="text-lg font-semibold mb-6">Logo & Branding</h3>
                                <div className="flex items-center gap-8">
                                    <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                                        <Building className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <Button size="sm">Upload Logo</Button>
                                            <Button size="sm" variant="outline">Remove</Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Recommended size: 512x512px. Supported formats: PNG, JPG, SVG.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="dashboard-card pt-6">
                            <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive daily summaries and critical alerts via email.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">SMS Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive instant alerts for urgent matters on your phone.</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Marketing Emails</Label>
                                        <p className="text-sm text-muted-foreground">Receive updates about new features and promotions.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="dashboard-card pt-6">
                            <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Two-Factor Authentication (2FA)</Label>
                                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <Label>Password Rotation Policy</Label>
                                        <Select defaultValue="90">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="30">Every 30 Days</SelectItem>
                                                <SelectItem value="60">Every 60 Days</SelectItem>
                                                <SelectItem value="90">Every 90 Days</SelectItem>
                                                <SelectItem value="never">Never</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Session Timeout (Minutes)</Label>
                                        <Input type="number" defaultValue="30" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integration' && (
                        <div className="dashboard-card pt-6">
                            <h3 className="text-lg font-semibold mb-6">Website Integration</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>API Key</Label>
                                    <div className="flex gap-2">
                                        <Input readOnly value="sk_live_51M..." className="font-mono bg-muted" />
                                        <Button variant="outline">Regenerate</Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Keep this key secret. Do not share it in public repositories.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Webhook URL</Label>
                                    <Input placeholder="https://your-website.com/api/webhook" />
                                    <p className="text-xs text-muted-foreground">We will send event notifications to this URL.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="dashboard-card pt-6">
                            <h3 className="text-lg font-semibold mb-6">System Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>System Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
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
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                                            <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                                            <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between md:col-span-2 pt-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Maintenance Mode</Label>
                                        <p className="text-sm text-muted-foreground">Prevent users from accessing the system during updates.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                        <Button variant="outline">Discard Changes</Button>
                        <Button onClick={handleSave} className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </InstitutionLayout>
    );
}
