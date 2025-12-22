import { useState } from 'react';
import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Search, Mail, Loader2 } from 'lucide-react';
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
import { toast } from "sonner";

const initialFaculty = [
    { id: '1', name: 'Mr. Rajesh Sharma', role: 'PGT - Mathematics', department: 'Mathematics', email: 'r.sharma@school.edu', phone: '+91 98765 43210', joinDate: 'Apr 2018' },
    { id: '2', name: 'Mrs. Sunita Verma', role: 'PGT - Physics', department: 'Science', email: 's.verma@school.edu', phone: '+91 98765 43211', joinDate: 'Jun 2019' },
    { id: '3', name: 'Ms. Anita Das', role: 'TGT - English', department: 'English', email: 'a.das@school.edu', phone: '+91 98765 43212', joinDate: 'Jan 2021' },
    { id: '4', name: 'Mr. Vikram Singh', role: 'TGT - Social Studies', department: 'Social Studies', email: 'v.singh@school.edu', phone: '+91 98765 43213', joinDate: 'Apr 2022' },
    { id: '5', name: 'Dr. Manoj Gupta', role: 'PGT - Chemistry', department: 'Science', email: 'm.gupta@school.edu', phone: '+91 98765 43214', joinDate: 'Mar 2020' },
];

export function InstitutionFaculty() {
    const [faculty, setFaculty] = useState(initialFaculty);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newFaculty, setNewFaculty] = useState({
        name: '',
        role: '',
        department: '',
        email: '',
        phone: ''
    });

    const handleAddFaculty = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            const member = {
                id: (faculty.length + 1).toString(),
                name: newFaculty.name,
                role: newFaculty.role,
                department: newFaculty.department,
                email: newFaculty.email,
                phone: newFaculty.phone,
                joinDate: new Date().toLocaleString('default', { month: 'short', year: 'numeric' })
            };
            setFaculty([...faculty, member]);
            setIsSubmitting(false);
            setIsAddDialogOpen(false);
            setNewFaculty({ name: '', role: '', department: '', email: '', phone: '' });
            toast.success("Faculty member added successfully");
        }, 1000);
    };

    const columns = [
        {
            key: 'name',
            header: 'Faculty Member',
            render: (item: typeof faculty[0]) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{item.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.role}</span>
                    </div>
                </div>
            ),
        },
        { key: 'department', header: 'Department' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'joinDate', header: 'Joining Date' },
        {
            key: 'actions',
            header: 'Actions',
            render: () => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">View Profile</Button>
                </div>
            ),
        },
    ];

    return (
        <InstitutionLayout>
            <PageHeader
                title="Faculty Members"
                subtitle="Manage teaching staff and academic personnel"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search faculty..."
                                className="input-field pl-10 w-64"
                            />
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Faculty
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Add Faculty Member</DialogTitle>
                                    <DialogDescription>
                                        Add a new faculty member to the system.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input
                                            id="name"
                                            value={newFaculty.name}
                                            onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                                            className="col-span-3"
                                            placeholder="e.g. Dr. John Doe"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">Role</Label>
                                        <Input
                                            id="role"
                                            value={newFaculty.role}
                                            onChange={(e) => setNewFaculty({ ...newFaculty, role: e.target.value })}
                                            className="col-span-3"
                                            placeholder="e.g. PGT/TGT"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="department" className="text-right">Dept</Label>
                                        <Input
                                            id="department"
                                            value={newFaculty.department}
                                            onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                                            className="col-span-3"
                                            placeholder="e.g. Science"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={newFaculty.email}
                                            onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                                            className="col-span-3"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phone" className="text-right">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={newFaculty.phone}
                                            onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                                            className="col-span-3"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleAddFaculty} disabled={!newFaculty.name || !newFaculty.email || isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Member
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                }
            />

            <div className="dashboard-card">
                <DataTable columns={columns} data={faculty} />
            </div>
        </InstitutionLayout>
    );
}
