import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import {
    LayoutDashboard,
    Bell,
    CreditCard,
    Settings,
    CalendarDays,
} from 'lucide-react';

export function ParentLayout({ children }: { children: ReactNode }) {
    const parentNavItems = [
        { label: 'Dashboard', href: '/parent', icon: LayoutDashboard },
        { label: 'Notifications', href: '/parent/notifications', icon: Bell },
        { label: 'Fees & Payments', href: '/parent/fees', icon: CreditCard },
        { label: 'Leave Request', href: '/parent/leave', icon: CalendarDays },
        { label: 'Settings', href: '/parent/settings', icon: Settings },
    ];

    return (
        <DashboardLayout navItems={parentNavItems} roleColor="text-primary">
            {children}
        </DashboardLayout>
    );
}
