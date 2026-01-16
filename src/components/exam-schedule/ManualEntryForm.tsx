import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Simple UUID generator for browser compatibility
const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export interface ExamEntry {
    id: string;
    exam_date: Date;
    day_of_week: string;
    start_time: string;
    end_time: string;
    subject: string;
    syllabus_notes: string;
}

interface ManualEntryFormProps {
    onSubmit: (entries: ExamEntry[]) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function ManualEntryForm({ onSubmit, onCancel, isSubmitting }: ManualEntryFormProps) {
    const [entries, setEntries] = useState<ExamEntry[]>([
        {
            id: generateId(),
            exam_date: new Date(),
            day_of_week: format(new Date(), 'EEEE'),
            start_time: '09:00',
            end_time: '12:00',
            subject: '',
            syllabus_notes: ''
        }
    ]);

    const addEntry = () => {
        const newEntry: ExamEntry = {
            id: generateId(),
            exam_date: new Date(),
            day_of_week: format(new Date(), 'EEEE'),
            start_time: '09:00',
            end_time: '12:00',
            subject: '',
            syllabus_notes: ''
        };
        setEntries([...entries, newEntry]);
    };

    const removeEntry = (id: string) => {
        if (entries.length > 1) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    const updateEntry = (id: string, field: keyof ExamEntry, value: any) => {
        setEntries(entries.map(e => {
            if (e.id === id) {
                const updated = { ...e, [field]: value };
                // Update day_of_week when date changes
                if (field === 'exam_date') {
                    updated.day_of_week = format(value, 'EEEE');
                }
                return updated;
            }
            return e;
        }));
    };

    const handleSubmit = () => {
        // Validate all entries
        const isValid = entries.every(e =>
            e.subject.trim() !== '' &&
            e.start_time !== '' &&
            e.end_time !== ''
        );

        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }

        onSubmit(entries);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Manual Entry</h3>
                    <p className="text-sm text-muted-foreground">Add exam details manually</p>
                </div>
                <Button onClick={addEntry} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exam
                </Button>
            </div>

            <div className="space-y-4">
                {entries.map((entry, index) => (
                    <div key={entry.id} className="p-4 border rounded-lg space-y-4 bg-card">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Exam {index + 1}</h4>
                            {entries.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeEntry(entry.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date Picker */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date & Day</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !entry.exam_date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {entry.exam_date ? (
                                                <>
                                                    {format(entry.exam_date, 'dd MMM yyyy')}
                                                    <span className="ml-2 text-muted-foreground">
                                                        ({entry.day_of_week})
                                                    </span>
                                                </>
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={entry.exam_date}
                                            onSelect={(date) => date && updateEntry(entry.id, 'exam_date', date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject *</label>
                                <Input
                                    placeholder="e.g., Mathematics"
                                    value={entry.subject}
                                    onChange={(e) => updateEntry(entry.id, 'subject', e.target.value)}
                                />
                            </div>

                            {/* Start Time */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start Time *</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="time"
                                        className="pl-10"
                                        value={entry.start_time}
                                        onChange={(e) => updateEntry(entry.id, 'start_time', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* End Time */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">End Time *</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="time"
                                        className="pl-10"
                                        value={entry.end_time}
                                        onChange={(e) => updateEntry(entry.id, 'end_time', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Syllabus/Notes */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Syllabus / Notes</label>
                            <Textarea
                                placeholder="e.g., Chapters 1-5, Thermodynamics & Motion"
                                value={entry.syllabus_notes}
                                onChange={(e) => updateEntry(entry.id, 'syllabus_notes', e.target.value)}
                                rows={2}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Schedule'}
                </Button>
            </div>
        </div>
    );
}
