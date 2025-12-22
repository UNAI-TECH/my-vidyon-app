import { ParentLayout } from '@/layouts/ParentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';

export function ParentNotifications() {
    return (
        <ParentLayout>
            <PageHeader
                title="Notifications & Alerts"
                subtitle="Stay updated with school announcements and academic alerts"
            />

            <div className="max-w-4xl bg-white rounded-xl border border-border shadow-sm min-h-[600px] overflow-hidden">
                <NotificationPanel />
            </div>
        </ParentLayout>
    );
}
