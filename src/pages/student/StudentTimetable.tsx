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

            <div className="dashboard-card p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <h3 className="font-semibold text-sm sm:text-base">{t.nav.timetable}</h3>
                </div>

                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-4">
                    {timetableData.map((day) => (
                        <div key={day.day} className="bg-muted/30 rounded-lg p-3">
                            <h4 className="font-semibold text-sm mb-2 text-primary">{day.day}</h4>
                            <div className="space-y-2">
                                {day.slots.map((slot, index) => {
                                    const isBreak = slot.subject === 'Break' || slot.subject === 'Free Period';
                                    return (
                                        <div key={index} className={`flex items-start gap-2 ${isBreak ? 'opacity-50' : ''}`}>
                                            <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{slot.time}</span>
                                            {isBreak ? (
                                                <span className="text-xs italic text-muted-foreground">{slot.subject}</span>
                                            ) : (
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium">{slot.subject}</p>
                                                    <p className="text-[10px] text-muted-foreground">{slot.room} • {slot.faculty}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth-touch">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="table-header py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm">Time</th>
                                {timetableData.map((day) => (
                                    <th key={day.day} className="table-header py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm">{day.day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[0, 1, 2, 3].map((slotIndex) => (
                                <tr key={slotIndex} className="border-b border-border hover:bg-muted/50">
                                    <td className="table-cell font-medium text-muted-foreground py-2 sm:py-4 px-2 sm:px-4">
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm whitespace-nowrap">{timetableData[0].slots[slotIndex].time}</span>
                                        </div>
                                    </td>
                                    {timetableData.map((day) => {
                                        const slot = day.slots[slotIndex];
                                        const isBreak = slot.subject === 'Break' || slot.subject === 'Free Period';
                                        return (
                                            <td key={day.day} className="table-cell py-2 sm:py-4 px-2 sm:px-4">
                                                {isBreak ? (
                                                    <div className="text-center text-muted-foreground italic text-xs sm:text-sm">{slot.subject}</div>
                                                ) : (
                                                    <div className="p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/10">
                                                        <div className="font-medium text-xs sm:text-sm">{slot.subject}</div>
                                                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{slot.room}</div>
                                                        <div className="text-[10px] sm:text-xs text-muted-foreground">{slot.faculty}</div>
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
