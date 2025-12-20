import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { useTranslation } from '@/i18n/TranslationContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  Plug,
  Database,
  Activity,
  Flag,
  Settings,
  Globe,
} from 'lucide-react';

export function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  const adminNavItems = [
    { label: t.nav.dashboard, href: '/admin', icon: LayoutDashboard },
    { label: t.nav.institutions, href: '/admin/institutions', icon: Building2 },
    { label: t.nav.users, href: '/admin/users', icon: Users },
    { label: t.nav.roles, href: '/admin/roles', icon: Shield },
    { label: t.nav.api, href: '/admin/api', icon: Plug },
    { label: t.nav.database, href: '/admin/database', icon: Database },
    { label: t.nav.monitoring, href: '/admin/monitoring', icon: Activity },
    { label: t.nav.features, href: '/admin/features', icon: Flag },
    { label: t.nav.config, href: '/admin/config', icon: Globe },
    { label: t.nav.settings, href: '/admin/settings', icon: Settings },
  ];

  return (
    <DashboardLayout navItems={adminNavItems} roleColor="text-admin">
      {children}
    </DashboardLayout>
  );
}
