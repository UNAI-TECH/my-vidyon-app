import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/TranslationContext';
import { Bell, Filter } from 'lucide-react';
import { useState } from 'react';

const allNotifications = [
    { title: 'Assignment Graded', message: 'Your React Portfolio Project has been graded. You scored 95/100.', type: 'success' as const, time: '2 hours ago', category: 'grades' },
    { title: 'New Material Uploaded', message: 'New class notes for Database Management have been uploaded.', type: 'info' as const, time: '5 hours ago', category: 'materials' },
    { title: 'Fee Payment Reminder', message: 'Your semester fee payment is due in 5 days.', type: 'warning' as const, time: '1 day ago', category: 'fees' },
    { title: 'Exam Schedule Released', message: 'Mid-semester exam schedule has been published. Check your timetable.', type: 'info' as const, time: '1 day ago', category: 'exams' },
    { title: 'Assignment Due Soon', message: 'Binary Tree Implementation assignment is due in 2 days.', type: 'warning' as const, time: '2 days ago', category: 'assignments' },
    { title: 'Course Registration Open', message: 'Registration for Spring 2026 semester is now open.', type: 'info' as const, time: '3 days ago', category: 'registration' },
    { title: 'Library Book Overdue', message: 'You have 1 overdue book. Please return it to avoid fines.', type: 'warning' as const, time: '3 days ago', category: 'library' },
    { title: 'Attendance Alert', message: 'Your attendance in CS301 is below 75%. Please improve.', type: 'warning' as const, time: '4 days ago', category: 'attendance' },
    { title: 'Scholarship Opportunity', message: 'New scholarship applications are open for meritorious students.', type: 'success' as const, time: '5 days ago', category: 'scholarships' },
    { title: 'Event Invitation', message: 'You are invited to the Annual Tech Fest on Dec 25, 2025.', type: 'info' as const, time: '1 week ago', category: 'events' },
];

export function StudentNotifications() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<string>('all');

    const filteredNotifications = filter === 'all'
        ? allNotifications
        : allNotifications.filter(n => n.category === filter);

    const categories = ['all', 'grades', 'assignments', 'fees', 'exams', 'materials', 'events'];

    return (
        <StudentLayout>
            <PageHeader
                title={t.nav.notifications}
                subtitle={t.dashboard.overview}
                actions={
                    <Button variant="outline" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Mark All as Read
                    </Button>
                }
            />

            {/* Filter Buttons */}
            <div className="dashboard-card mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filter by Category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={filter === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(category)}
                            className={filter === category ? 'bg-primary text-primary-foreground' : ''}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Notifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotifications.map((notification, index) => (
                    <NotificationCard key={index} {...notification} />
                ))}
            </div>

            {filteredNotifications.length === 0 && (
                <div className="dashboard-card text-center py-12">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications in this category</p>
                </div>
            )}
        </StudentLayout>
    );
}
