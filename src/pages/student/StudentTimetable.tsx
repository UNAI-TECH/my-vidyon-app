import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n/TranslationContext';
import { Calendar, Clock } from 'lucide-react';

const timetableData = [
    {
        day: 'Monday', slots: [
            { time: '9:00 - 10:00', subject: 'Mathematics', room: 'Room 10A', faculty: 'Mr. Sharma' },
            { time: '10:00 - 11:00', subject: 'English', room: 'Room 10A', faculty: 'Ms. Davis' },
            { time: '11:00 - 12:00', subject: 'Break', room: '-', faculty: '-' },
            { time: '12:00 - 1:00', subject: 'Physics', room: 'Lab 1', faculty: 'Mrs. Verma' },
        ]
    },
    {
        day: 'Tuesday', slots: [
            { time: '9:00 - 10:00', subject: 'Chemistry', room: 'Lab 2', faculty: 'Mr. Gupta' },
            { time: '10:00 - 11:00', subject: 'Social Science', room: 'Room 10A', faculty: 'Mr. Das' },
            { time: '11:00 - 12:00', subject: 'Break', room: '-', faculty: '-' },
            { time: '12:00 - 1:00', subject: 'Mathematics', room: 'Room 10A', faculty: 'Mr. Sharma' },
        ]
    },
    {
        day: 'Wednesday', slots: [
            { time: '9:00 - 10:00', subject: 'English', room: 'Room 10A', faculty: 'Ms. Davis' },
            { time: '10:00 - 11:00', subject: 'Hindi', room: 'Room 10A', faculty: 'Mrs. Singh' },
            { time: '11:00 - 12:00', subject: 'Break', room: '-', faculty: '-' },
            { time: '12:00 - 1:00', subject: 'Computer Science', room: 'Lab 3', faculty: 'Ms. Iyer' },
        ]
    },
    {
        day: 'Thursday', slots: [
            { time: '9:00 - 10:00', subject: 'Mathematics', room: 'Room 10A', faculty: 'Mr. Sharma' },
            { time: '10:00 - 11:00', subject: 'Biology', room: 'Lab 4', faculty: 'Dr. Reddy' },
            { time: '11:00 - 12:00', subject: 'Break', room: '-', faculty: '-' },
            { time: '12:00 - 1:00', subject: 'Social Science', room: 'Room 10A', faculty: 'Mr. Das' },
        ]
    },
    {
        day: 'Friday', slots: [
            { time: '9:00 - 10:00', subject: 'Geography', room: 'Room 10A', faculty: 'Ms. Iyer' },
            { time: '10:00 - 11:00', subject: 'Physical Education', room: 'Ground', faculty: 'Mr. Khan' },
            { time: '11:00 - 12:00', subject: 'Break', room: '-', faculty: '-' },
            { time: '12:00 - 1:00', subject: 'Free Period', room: '-', faculty: '-' },
        ]
    },
];

export function StudentTimetable() {
    const { t } = useTranslation();

    return (
        <StudentLayout>
            <PageHeader
                title={t.nav.timetable}
                subtitle={t.dashboard.overview}
            />

            <div className="dashboard-card">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">{t.nav.timetable}</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="table-header py-3 px-4 text-left">Time</th>
                                {timetableData.map((day) => (
                                    <th key={day.day} className="table-header py-3 px-4 text-center">{day.day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[0, 1, 2, 3].map((slotIndex) => (
                                <tr key={slotIndex} className="border-b border-border hover:bg-muted/50">
                                    <td className="table-cell font-medium text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {timetableData[0].slots[slotIndex].time}
                                        </div>
                                    </td>
                                    {timetableData.map((day) => {
                                        const slot = day.slots[slotIndex];
                                        const isBreak = slot.subject === 'Break' || slot.subject === 'Free Period';
                                        return (
                                            <td key={day.day} className="table-cell">
                                                {isBreak ? (
                                                    <div className="text-center text-muted-foreground italic">{slot.subject}</div>
                                                ) : (
                                                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                                                        <div className="font-medium text-sm">{slot.subject}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">{slot.room}</div>
                                                        <div className="text-xs text-muted-foreground">{slot.faculty}</div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </StudentLayout>
    );
}
