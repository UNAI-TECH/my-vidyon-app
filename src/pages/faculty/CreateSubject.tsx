import { useState } from 'react';
import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BookOpen, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CreateSubject() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        class: '',
        schedule: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const newSubject = {
                title: formData.title,
                code: formData.code,
                instructor: 'You',
                students: 0,
                schedule: formData.schedule,
                status: 'active'
            };

            const existingSubjects = JSON.parse(localStorage.getItem('facultySubjects') || '[]');
            localStorage.setItem('facultySubjects', JSON.stringify([...existingSubjects, newSubject]));

            setIsSubmitting(false);
            toast.success('Subject created successfully!');
            navigate('/faculty/courses');
        }, 1500);
    };

    return (
        <FacultyLayout>
            <PageHeader
                title="Create New Subject"
                subtitle="Add a new subject to your curriculum"
            />

            <div className="max-w-2xl mx-auto dashboard-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Subject Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. Mathematics"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="code">Subject Code/ID</Label>
                            <Input
                                id="code"
                                name="code"
                                placeholder="e.g. MATH10"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="class">Class</Label>
                            <Select
                                value={formData.class}
                                onValueChange={(value) => handleSelectChange('class', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="9">Class 9</SelectItem>
                                    <SelectItem value="10">Class 10</SelectItem>
                                    <SelectItem value="11">Class 11</SelectItem>
                                    <SelectItem value="12">Class 12</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="schedule">Schedule</Label>
                        <Input
                            id="schedule"
                            name="schedule"
                            placeholder="e.g. Mon, Wed 10:00 AM"
                            value={formData.schedule}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="btn-primary min-w-[120px]" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>Creating...</>
                            ) : (
                                <>
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Create Subject
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </FacultyLayout>
    );
}
