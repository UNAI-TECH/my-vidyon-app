import { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/common/Badge';
import { Flag, Rocket, Settings2, ShieldCheck } from 'lucide-react';

const initialFlags = [
    { id: 'new-dashboard', name: 'New Dashboard UI', description: 'Enable the redesigned faculty dashboard', category: 'UI/UX', enabled: true },
    { id: 'beta-ai-tutor', name: 'AI Tutor (Beta)', description: 'Enable AI tutoring features for students', category: 'Beta', enabled: true },
    { id: 'maintenance-mode', name: 'Maintenance Mode', description: 'Put the entire site into maintenance mode', category: 'System', enabled: false },
    { id: 'parent-portal', name: 'Parent Portal V2', description: 'Enable improved parent communication features', category: 'Features', enabled: true },
    { id: 'dark-mode', name: 'Force Dark Mode', description: 'Force dark mode for all mobile users', category: 'UI/UX', enabled: false },
    { id: 'strict-auth', name: 'Strict 2FA', description: 'Enforce 2FA for all institution admins', category: 'Security', enabled: false },
];

export function AdminFeatures() {
    const [flags, setFlags] = useState(initialFlags);

    const toggleFlag = (id: string) => {
        setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    };

    return (
        <AdminLayout>
            <PageHeader
                title="Feature Flags"
                subtitle="Manage feature toggles and rollouts"
            />

            <div className="grid gap-6">
                {['System', 'Features', 'UI/UX', 'Beta', 'Security'].map(category => {
                    const categoryFlags = flags.filter(f => f.category === category);
                    if (categoryFlags.length === 0) return null;

                    return (
                        <div key={category} className="dashboard-card">
                            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                                {category === 'System' && <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />}
                                {category === 'Beta' && <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
                                {category === 'Security' && <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-success" />}
                                {category}
                            </h3>
                            <div className="space-y-4 sm:space-y-6">
                                {categoryFlags.map(flag => (
                                    <div key={flag.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-1">
                                                <p className="font-medium text-sm sm:text-base">{flag.name}</p>
                                                <Badge variant="outline" className="text-[10px] sm:text-xs font-normal font-mono">{flag.id}</Badge>
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground">{flag.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto mt-1 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/50">
                                            <span className={`text-xs sm:text-sm ${flag.enabled ? 'text-success font-medium' : 'text-muted-foreground'}`}>
                                                {flag.enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                            <Switch
                                                checked={flag.enabled}
                                                onCheckedChange={() => toggleFlag(flag.id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
