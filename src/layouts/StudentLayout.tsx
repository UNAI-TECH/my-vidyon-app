import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { useTranslation } from '@/i18n/TranslationContext';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  GraduationCap,
  CreditCard,
  Award,
  Bell,
  FolderOpen,
  MessageSquare,
  Settings,
} from 'lucide-react';

export function StudentLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  const studentNavItems = [
    { label: t.nav.dashboard, href: '/student', icon: LayoutDashboard },
    { label: t.nav.courses, href: '/student/courses', icon: BookOpen },
    { label: t.nav.timetable, href: '/student/timetable', icon: Calendar },
    { label: 'Academic Calendar', href: '/student/calendar', icon: Calendar },
    { label: t.nav.attendance, href: '/student/attendance', icon: ClipboardCheck },
    { label: t.nav.assignments, href: '/student/assignments', icon: FileText },
    { label: t.nav.grades, href: '/student/grades', icon: GraduationCap },
    { label: t.nav.materials, href: '/student/materials', icon: FolderOpen },
    { label: t.nav.certificates, href: '/student/certificates', icon: Award },
    { label: t.nav.notifications, href: '/student/notifications', icon: Bell },
    { label: t.nav.aiTutor, href: '/student/ai-tutor', icon: MessageSquare },
    { label: t.nav.settings, href: '/student/settings', icon: Settings },
  ];

  return (
    <DashboardLayout navItems={studentNavItems} roleColor="text-student">
      {children}
    </DashboardLayout>
  );
}
