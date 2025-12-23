import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import {
    LayoutDashboard,
    Bell,
    CreditCard,
    Settings,
    CalendarDays,
} from 'lucide-react';

import { useTranslation } from '@/i18n/TranslationContext';

export function ParentLayout({ children }: { children: ReactNode }) {
    const { t } = useTranslation();

    const parentNavItems = [
        { label: t.nav.dashboard, href: '/parent', icon: LayoutDashboard },
        { label: t.nav.notifications, href: '/parent/notifications', icon: Bell },
        { label: t.nav.fees, href: '/parent/fees', icon: CreditCard },
        { label: t.nav.leave, href: '/parent/leave', icon: CalendarDays },
        { label: t.nav.settings, href: '/parent/settings', icon: Settings },
    ];

    return (
        <DashboardLayout navItems={parentNavItems} roleColor="text-primary">
            {children}
        </DashboardLayout>
    );
}
