import { ParentLayout } from '@/layouts/ParentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n/TranslationContext';
import { ChildCard } from '@/components/cards/ChildCard';
import { Phone, Shield, School, User } from 'lucide-react';

// Mock Data for Children
const myChildren = [
    {
        id: 'STU001',
        name: 'Vinoth',
        grade: 'Class 12-A',
        rollNo: '24',
        attendance: 92,
        performance: 'Excellent' as const,
        teacherName: 'Mr. Raman',
        teacherPhone: '+91 98765 11111'
    },
    {
        id: 'STU002',
        name: 'Sujatha',
        grade: 'Class 9-B',
        rollNo: '12',
        attendance: 88,
        performance: 'Good' as const,
        teacherName: 'Mrs. Geetha',
        teacherPhone: '+91 98765 22222'
    }
];

export function ParentDashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <ParentLayout>
            <PageHeader
                title={`${t.common.welcome}, ${user?.name}!`}
                subtitle={t.parent.dashboard.subtitle}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6 mb-8">
                {myChildren.map((child) => (
                    <ChildCard key={child.id} {...child} />
                ))}
            </div>

            {/* Emergency Contacts Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-destructive" />
                    Emergency Contacts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* School Office */}
                    <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                            <School className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">School Office</p>
                            <a href="tel:+914412345678" className="font-semibold text-foreground hover:text-primary transition-colors block">
                                044-1234 5678
                            </a>
                        </div>
                    </div>

                    {/* Main Guard */}
                    <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-2.5 bg-red-100 dark:bg-red-900/20 rounded-full text-red-600 dark:text-red-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Main Guard (Security)</p>
                            <a href="tel:+919876500000" className="font-semibold text-foreground hover:text-primary transition-colors block">
                                +91 98765 00000
                            </a>
                        </div>
                    </div>

                    {/* Class Teachers */}
                    {myChildren.map((child) => (
                        <div key={child.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-2.5 bg-green-100 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">{child.name}'s Teacher</p>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-foreground">{child.teacherName}</span>
                                    <a href={`tel:${child.teacherPhone}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                                        {child.teacherPhone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ParentLayout>
    );
}
