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
                            <h3 className="font-semibold text-lg">January 2026</h3>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
                                <Button variant="outline" size="sm"><ChevronRight className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-px bg-border overflow-hidden rounded-lg">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="bg-muted p-2 text-center text-xs font-semibold text-muted-foreground">{day}</div>
                            ))}
                            {Array.from({ length: 31 }).map((_, i) => (
                                <div key={i} className={`bg-background min-h-[100px] p-2 border-t border-r last:border-r-0 ${i + 1 === 15 ? 'bg-primary/5' : ''}`}>
                                    <span className={`text-sm ${i + 1 === 15 ? 'font-bold text-primary' : ''}`}>{i + 1}</span>
                                    {i + 1 === 15 && (
                                        <div className="mt-1 p-1 text-[10px] bg-primary/20 text-primary-foreground rounded truncate">
                                            New Session
                                        </div>
                                    )}
                                    {i + 1 === 26 && (
                                        <div className="mt-1 p-1 text-[10px] bg-success/20 text-success-foreground rounded truncate">
                                            Republic Day
                                        </div>
                                    )}
                                </div>
                            ))}
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
