import { useState } from 'react';
import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badge';
import { BookOpen, Plus, Search, Filter, Loader2 } from 'lucide-react';
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
import { useInstitution } from '@/context/InstitutionContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function InstitutionCourses() {
    const { subjects } = useInstitution(); // Contains assignments info
    const { user } = useAuth();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newCourse, setNewCourse] = useState({
        name: '',
        code: '',
        department: '',
        instructor: '' // Unused for now in creation, as verifying instructor assignment is separate
    });
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddCourse = async () => {
        if (!user?.institutionId) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('subjects')
                .insert([{
                    institution_id: user.institutionId,
                    name: newCourse.name,
                    code: newCourse.code,
                    department: newCourse.department
                }]);

            if (error) throw error;

            toast.success("Course added successfully");
            setIsAddDialogOpen(false);
            setNewCourse({ name: '', code: '', department: '', instructor: '' });
            // Context realtime subscription will auto-update the list
        } catch (error: any) {
            console.error('Error adding course:', error);
            toast.error(error.message || 'Failed to add course');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter subjects based on search
    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        { key: 'code', header: 'Code' },
        { key: 'name', header: 'Course Name' },
        { key: 'department', header: 'Subject Group' },
        {
            key: 'instructor',
            header: 'Assigned Staff',
            render: (item: any) => {
                // item is a Subject from context which has .staff array
                if (!item.staff || item.staff.length === 0) return <span className="text-muted-foreground text-xs">Unassigned</span>;
                // Unique staff names
                const uniqueNames = Array.from(new Set(item.staff.map((s: any) => s.name)));
                if (uniqueNames.length > 2) {
                    return <span>{uniqueNames.slice(0, 2).join(', ')} +{uniqueNames.length - 2} more</span>;
                }
                return <span>{uniqueNames.join(', ')}</span>;
            }
        },
        {
            key: 'actions',
            header: 'Actions',
            render: () => (
                <Button variant="ghost" size="sm">Manage</Button>
            ),
        },
    ];

    // Transform context data for table
    const tableData = filteredSubjects.map(s => ({
        ...s,
        // Ensure default values for missing fields to avoid table errors
        code: s.code || '-',
        department: s.department || 'General'
    }));

    return (
        <InstitutionLayout>
            <PageHeader
                title="Courses"
                subtitle="Complete catalog of courses offered by the institution"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-10 w-64"
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Course
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[550px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Course</DialogTitle>
                                    <DialogDescription>
                                        Create a new course/subject in the catalog.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="code" className="text-right">Code</Label>
                                        <Input
                                            id="code"
                                            value={newCourse.code}
                                            onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                                            className="col-span-3"
                                            placeholder="e.g. MATH10"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input
                                            id="name"
                                            value={newCourse.name}
                                            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                            className="col-span-3"
                                            placeholder="e.g. Mathematics"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="department" className="text-right">Department</Label>
                                        <div className="col-span-3">
                                            <Select
                                                value={newCourse.department}
                                                onValueChange={(value) => setNewCourse({ ...newCourse, department: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                                                    <SelectItem value="Science">Science (Phy/Chem/Bio)</SelectItem>
                                                    <SelectItem value="English">English</SelectItem>
                                                    <SelectItem value="Languages">Languages</SelectItem>
                                                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                                                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                                                    <SelectItem value="Arts">Arts</SelectItem>
                                                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleAddCourse} disabled={!newCourse.name || isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Course
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                }
            />

            <div className="dashboard-card">
                <DataTable columns={columns} data={tableData} />
            </div>
        </InstitutionLayout>
    );
}
