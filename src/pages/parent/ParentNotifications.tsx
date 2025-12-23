import { ParentLayout } from '@/layouts/ParentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { useTranslation } from '@/i18n/TranslationContext';

export function ParentNotifications() {
    const { t } = useTranslation();

    return (
        <ParentLayout>
            <PageHeader
                title={t.parent.notifications.title}
                subtitle={t.parent.notifications.subtitle}
            />

            <div className="max-w-4xl bg-white rounded-xl border border-border shadow-sm min-h-[600px] overflow-hidden">
                <NotificationPanel />
            </div>
        </ParentLayout>
    );
}
