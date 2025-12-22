import {
    FileText,
    Calendar,
    Clock,
    Megaphone,
    BarChart,
    CreditCard,
    CheckCircle,
    AlertTriangle,
    Info,
    XCircle,
    Bell
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export type NotificationType =
    | 'assignment'
    | 'attendance'
    | 'leave'
    | 'announcement'
    | 'exam'
    | 'fees';

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    date: string;
    read: boolean;
    priority?: 'high' | 'normal' | 'low';
    actionUrl?: string;
}

const mockNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Math Assignment Due',
        message: 'Math Assignment not submitted for Class 7A (Due: 18 Dec)',
        type: 'assignment',
        date: '2 hours ago',
        read: false,
        priority: 'high'
    },
    {
        id: '2',
        title: 'Low Attendance Warning',
        message: 'Attendance dropped below 75% this month for Alex.',
        type: 'attendance',
        date: '5 hours ago',
        read: false,
        priority: 'high'
    },
    {
        id: '3',
        title: 'Leave Approved',
        message: 'Leave request approved for 20–21 Dec.',
        type: 'leave',
        date: '1 day ago',
        read: true,
        priority: 'normal'
    },
    {
        id: '4',
        title: 'School Holiday',
        message: 'School holiday declared on 25 Dec.',
        type: 'announcement',
        date: '2 days ago',
        read: true,
        priority: 'normal'
    },
    {
        id: '5',
        title: 'Exam Results Out',
        message: 'Mid-term exam results are now available.',
        type: 'exam',
        date: '3 days ago',
        read: true,
        priority: 'high'
    },
    {
        id: '6',
        title: 'Fee Due Reminder',
        message: 'Term 2 fees due by 30 Dec.',
        type: 'fees',
        date: '1 week ago',
        read: true,
        priority: 'normal'
    }
];

const TypeIcon = ({ type }: { type: NotificationType }) => {
    switch (type) {
        case 'assignment': return <FileText className="w-5 h-5 text-blue-500" />;
        case 'attendance': return <Clock className="w-5 h-5 text-red-500" />;
        case 'leave': return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'announcement': return <Megaphone className="w-5 h-5 text-purple-500" />;
        case 'exam': return <BarChart className="w-5 h-5 text-orange-500" />;
        case 'fees': return <CreditCard className="w-5 h-5 text-yellow-500" />;
        default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
};

export function NotificationPanel({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                </h3>
                <Badge variant="warning">
                    {mockNotifications.filter(n => !n.read).length} New
                </Badge>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {mockNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={cn(
                                "p-4 transition-all hover:bg-muted/50 cursor-pointer border-l-4",
                                notification.read ? "border-l-transparent" : "border-l-primary bg-primary/5"
                            )}
                        >
                            <div className="flex gap-4">
                                <div className={cn(
                                    "p-2 rounded-full h-fit",
                                    "bg-background border shadow-sm"
                                )}>
                                    <TypeIcon type={notification.type} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={cn("text-sm font-semibold", !notification.read && "text-foreground")}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {notification.date}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>

                                    {/* Optional: Add actionable buttons based on type */}
                                    {notification.type === 'fees' && !notification.read && (
                                        <div className="mt-2">
                                            <Badge variant="warning" className="text-[10px]">Payment Due</Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-muted/20 text-center">
                <button className="text-sm text-primary hover:underline">
                    Mark all as read
                </button>
            </div>
        </div>
    );
}
