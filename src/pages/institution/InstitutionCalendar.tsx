import { useState } from 'react';
import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badge';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const initialEvents = [
    { id: '1', title: 'New Academic Session', date: 'Apr 01, 2026', type: 'academic', category: 'Major Event' },
    { id: '2', title: 'Unit Test I', date: 'May 10-15, 2026', type: 'exam', category: 'Examination' },
    { id: '3', title: 'Annual Sports Day', date: 'Nov 14, 2026', type: 'cultural', category: 'Event' },
    { id: '4', title: 'Summer Vacation', date: 'May 25 - Jun 30, 2026', type: 'holiday', category: 'Holiday' },
    { id: '5', title: 'Annual Function', date: 'Dec 20, 2026', type: 'cultural', category: 'Ceremony' },
];

export function InstitutionCalendar() {
    const [events, setEvents] = useState(initialEvents);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        type: '',
        category: ''
    });

    const handleAddEvent = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            const event = {
                id: (events.length + 1).toString(),
                title: newEvent.title,
                date: newEvent.date,
                type: newEvent.type,
                category: newEvent.category
            };
            setEvents([...events, event]);
            setIsSubmitting(false);
            setIsAddDialogOpen(false);
            setNewEvent({ title: '', date: '', type: '', category: '' });
            toast.success("Event added successfully");
        }, 1000);
    };

    // Calendar Logic
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Default to Jan 2026 as per design

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    return (
        <InstitutionLayout>
            <PageHeader
                title="Academic Calendar"
                subtitle="Schedule and track academic events, exams, and holidays"
                actions={
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Event</DialogTitle>
                                <DialogDescription>
                                    Create a new event in the academic calendar.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input
                                        id="title"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="col-span-3"
                                        placeholder="Event Title"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="date" className="text-right">Date</Label>
                                    <Input
                                        id="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Jan 15, 2026"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">Type</Label>
                                    <div className="col-span-3">
                                        <Select
                                            value={newEvent.type}
                                            onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="academic">Academic</SelectItem>
                                                <SelectItem value="exam">Exam</SelectItem>
                                                <SelectItem value="cultural">Cultural</SelectItem>
                                                <SelectItem value="holiday">Holiday</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">Category</Label>
                                    <Input
                                        id="category"
                                        value={newEvent.category}
                                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Major Event"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddEvent} disabled={!newEvent.title || !newEvent.date || isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Event
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="dashboard-card pt-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg">
                                {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-px bg-border overflow-hidden rounded-lg">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="bg-muted p-2 text-center text-xs font-semibold text-muted-foreground">{day}</div>
                            ))}

                            {/* Empty cells for days before start of month */}
                            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                                <div key={`empty-${i}`} className="bg-background/50 min-h-[100px] border-t border-r last:border-r-0" />
                            ))}

                            {/* Actual days */}
                            {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                                const day = i + 1;
                                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                const dateStr = `${dateObj.toLocaleString('en-US', { month: 'short' })} ${day.toString().padStart(2, '0')}, ${dateObj.getFullYear()}`;

                                const today = new Date();
                                const isToday = day === today.getDate() &&
                                    currentDate.getMonth() === today.getMonth() &&
                                    currentDate.getFullYear() === today.getFullYear();

                                // Enhanced event matching to handle ranges (basic implementation)
                                const dayEvents = events.filter(e => {
                                    if (e.date.includes('-')) {
                                        // Handle simple ranges if needed, currently defaulting to string match for exact dates
                                        // or simple "starts with" logic if simpler
                                        return e.date.includes(dateStr);
                                    }
                                    return e.date === dateStr;
                                });

                                return (
                                    <div key={`day-${day}`} className={`bg-background min-h-[100px] p-2 border-t border-r last:border-r-0 hover:bg-muted/30 transition-colors ${isToday ? 'bg-primary/5' : ''}`}>
                                        <div className="flex justify-between items-start">
                                            <span className={`text-sm ${isToday ? 'font-bold text-primary' : ''}`}>{day}</span>
                                        </div>
                                        <div className="space-y-1 mt-1">
                                            {dayEvents.map((event, idx) => (
                                                <div key={idx} className={`p-1 text-[10px] rounded truncate border ${event.type === 'holiday' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                                        event.type === 'exam' ? 'bg-warning/10 text-warning border-warning/20' :
                                                            'bg-primary/10 text-primary border-primary/20'
                                                    }`} title={event.title}>
                                                    {event.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="dashboard-card">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            Upcoming Events
                        </h3>
                        <div className="space-y-4">
                            {events.map((event, index) => (
                                <div key={index} className="p-3 rounded-lg bg-muted/50 border border-transparent hover:border-primary/20 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-sm">{event.title}</span>
                                        <Badge variant="info" className="text-[10px] uppercase">{event.type}</Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {event.date} • {event.category}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <h3 className="font-semibold mb-4">Calendar Settings</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span>Show Holidays</span>
                                <input type="checkbox" defaultChecked className="switch" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>Show Exam Dates</span>
                                <input type="checkbox" defaultChecked className="switch" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>Public Visibility</span>
                                <input type="checkbox" defaultChecked className="switch" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </InstitutionLayout>
    );
}
