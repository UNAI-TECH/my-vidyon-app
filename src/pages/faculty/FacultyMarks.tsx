import { useState } from 'react';
import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Save, Plus, UserPlus } from 'lucide-react';

const initialStudents = [
    { id: 1, name: 'John Smith', rollNo: '101', internal: 18, external: 72, total: 90 },
    { id: 2, name: 'Emily Johnson', rollNo: '102', internal: 19, external: 68, total: 87 },
    { id: 3, name: 'Michael Brown', rollNo: '103', internal: 15, external: 60, total: 75 },
    { id: 4, name: 'Sarah Davis', rollNo: '104', internal: 17, external: 75, total: 92 },
    { id: 5, name: 'James Wilson', rollNo: '105', internal: 20, external: 78, total: 98 },
];

export function FacultyMarks() {
    const [studentsData, setStudentsData] = useState(initialStudents);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '',
        rollNo: '',
        internal: '',
        external: ''
    });

    const handleAddStudent = () => {
        if (!newStudent.name || !newStudent.rollNo) return;

        const internal = Number(newStudent.internal) || 0;
        const external = Number(newStudent.external) || 0;

        const student = {
            id: Math.max(...studentsData.map(s => s.id), 0) + 1,
            name: newStudent.name,
            rollNo: newStudent.rollNo,
            internal,
            external,
            total: internal + external
        };

        setStudentsData([...studentsData, student]);
        setIsDialogOpen(false);
        setNewStudent({ name: '', rollNo: '', internal: '', external: '' });
    };

    const columns = [
        { key: 'rollNo', header: 'Roll No.' },
        { key: 'name', header: 'Student Name' },
        {
            key: 'internal',
            header: 'Internal Marks (20)',
            render: (item: any) => (
                <input
                    type="number"
                    defaultValue={item.internal}
                    className="w-20 px-2 py-1 border rounded focus:ring-1 focus:ring-primary outline-none"
                    onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        // In a real app, update state here. Visual only for now as requested.
                    }}
                />
            )
        },
        {
            key: 'external',
            header: 'External Marks (80)',
            render: (item: any) => (
                <input
                    type="number"
                    defaultValue={item.external}
                    className="w-20 px-2 py-1 border rounded focus:ring-1 focus:ring-primary outline-none"
                />
            )
        },
        { key: 'total', header: 'Total (100)' },
    ];

    return (
        <FacultyLayout>
            <PageHeader
                title="Marks Entry"
                subtitle="Manage and enter student marks for assessments"
                actions={
                    <div className="flex gap-3">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-success hover:bg-success/90 text-white flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Add Student
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Student</DialogTitle>
                                    <DialogDescription>
                                        Enter student details and initial marks to add them to the list.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newStudent.name}
                                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                            className="col-span-3"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="rollNo" className="text-right">
                                            Roll No
                                        </Label>
                                        <Input
                                            id="rollNo"
                                            value={newStudent.rollNo}
                                            onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                                            className="col-span-3"
                                            placeholder="106"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="internal" className="text-right">
                                            Internal
                                        </Label>
                                        <Input
                                            id="internal"
                                            type="number"
                                            value={newStudent.internal}
                                            onChange={(e) => setNewStudent({ ...newStudent, internal: e.target.value })}
                                            className="col-span-3"
                                            placeholder="Max 20"
                                            max={20}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="external" className="text-right">
                                            External
                                        </Label>
                                        <Input
                                            id="external"
                                            type="number"
                                            value={newStudent.external}
                                            onChange={(e) => setNewStudent({ ...newStudent, external: e.target.value })}
                                            className="col-span-3"
                                            placeholder="Max 80"
                                            max={80}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleAddStudent}>Add Student</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button className="btn-primary flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Marks
                        </Button>
                    </div>
                }
            />

            <div className="dashboard-card mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search students..."
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        <select className="px-4 py-2 border rounded-lg bg-background text-sm flex-shrink-0">
                            <option>Mathematics - Class 10-A</option>
                            <option>Mathematics - Class 10-B</option>
                            <option>Science - Class 9-A</option>
                        </select>
                        <select className="px-4 py-2 border rounded-lg bg-background text-sm flex-shrink-0">
                            <option>Term 2 Final Exam</option>
                            <option>Unit Test - II</option>
                            <option>Internal Assessment</option>
                        </select>
                    </div>
                </div>

                <DataTable columns={columns} data={studentsData} />
            </div>

            <div className="flex justify-end gap-3 pb-8">
                <Button variant="outline">Discard Changes</Button>
                <Button className="btn-primary">Finalize & Submit</Button>
            </div>
        </FacultyLayout>
    );
}
