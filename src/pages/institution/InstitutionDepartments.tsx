import { useState } from 'react';
import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badge';
import { Building2, Plus, Search, Loader2 } from 'lucide-react';
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

const initialDepartments = [
    { id: '1', name: 'Science', head: 'Dr. James Smith', faculty: 24, students: 450, courses: 12, status: 'active' },
    { id: '2', name: 'Mathematics', head: 'Dr. Robert Brown', faculty: 18, students: 380, courses: 10, status: 'active' },
    { id: '3', name: 'Social Studies', head: 'Dr. Michael Wilson', faculty: 15, students: 320, courses: 8, status: 'active' },
    { id: '4', name: 'English', head: 'Dr. Sarah Davis', faculty: 20, students: 400, courses: 9, status: 'active' },
    { id: '5', name: 'Hindi', head: 'Dr. David Miller', faculty: 12, students: 250, courses: 7, status: 'inactive' },
];

export function InstitutionDepartments() {
    const [departments, setDepartments] = useState(initialDepartments);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newDept, setNewDept] = useState({
        name: '',
        head: '',
        status: 'active'
    });

    const handleAddDepartment = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            const department = {
                id: (departments.length + 1).toString(),
                name: newDept.name,
                head: newDept.head,
                faculty: 0,
                students: 0,
                courses: 0,
                status: newDept.status
            };
            setDepartments([...departments, department]);
            setIsSubmitting(false);
            setIsAddDialogOpen(false);
            setNewDept({ name: '', head: '', status: 'active' });
            toast.success("Department added successfully");
        }, 1000);
    };

    const columns = [
        { key: 'name', header: 'Department Name' },
        { key: 'head', header: 'Head of Department' },
        { key: 'faculty', header: 'Faculty Count' },
        { key: 'students', header: 'Student Count' },
        { key: 'courses', header: 'Courses' },
        {
            key: 'status',
            header: 'Status',
            render: (item: typeof departments[0]) => (
                <Badge variant={item.status === 'active' ? 'success' : 'outline'}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: () => (
                <Button variant="ghost" size="sm">Edit</Button>
            ),
        },
    ];

    return (
        <InstitutionLayout>
            <PageHeader
                title="Departments"
                subtitle="Manage academic departments and their administration"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search departments..."
                                className="input-field pl-10 w-64"
                            />
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Department
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Department</DialogTitle>
                                    <DialogDescription>
                                        Create a new academic department. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newDept.name}
                                            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                            className="col-span-3"
                                            placeholder="e.g. Psychology"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="head" className="text-right">
                                            Head
                                        </Label>
                                        <Input
                                            id="head"
                                            value={newDept.head}
                                            onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
                                            className="col-span-3"
                                            placeholder="e.g. Dr. Emily White"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right">
                                            Status
                                        </Label>
                                        <div className="col-span-3">
                                            <Select
                                                value={newDept.status}
                                                onValueChange={(value) => setNewDept({ ...newDept, status: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleAddDepartment} disabled={!newDept.name || !newDept.head || isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                }
            />

            <div className="dashboard-card">
                <DataTable columns={columns} data={departments} />
            </div>
        </InstitutionLayout>
    );
}
