import { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/common/Badge';
import { Shield, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
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

const initialRoles = [
    { id: 1, name: 'Super Admin', users: 5, permissions: 'All Access', status: 'active' },
    { id: 2, name: 'Institution Admin', users: 24, permissions: 'Institution Level', status: 'active' },
    { id: 3, name: 'Faculty', users: 850, permissions: 'Academic Access', status: 'active' },
    { id: 4, name: 'Student', users: 12500, permissions: 'Read Only (Self)', status: 'active' },
    { id: 5, name: 'Parent', users: 8000, permissions: 'Read Only (Child)', status: 'active' },
];

export function AdminRoles() {
    const [roles, setRoles] = useState(initialRoles);
    const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [newRole, setNewRole] = useState({
        name: '',
        permissions: ''
    });

    const handleCreateOrUpdateRole = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            if (isEditMode && selectedRoleId) {
                setRoles(roles.map(role =>
                    role.id === selectedRoleId
                        ? { ...role, name: newRole.name, permissions: newRole.permissions }
                        : role
                ));
                toast.success("Role updated successfully");
            } else {
                const role = {
                    id: roles.length + 1,
                    name: newRole.name,
                    users: 0,
                    permissions: newRole.permissions,
                    status: 'active'
                };
                setRoles([...roles, role]);
                toast.success("Role created successfully");
            }
            setIsSubmitting(false);
            setIsAddRoleOpen(false);
            setNewRole({ name: '', permissions: '' });
            setIsEditMode(false);
            setSelectedRoleId(null);
        }, 1000);
    };

    const handleEditRole = (role: typeof initialRoles[0]) => {
        setNewRole({ name: role.name, permissions: role.permissions });
        setSelectedRoleId(role.id);
        setIsEditMode(true);
        setIsAddRoleOpen(true);
    };

    const openAddDialog = () => {
        setNewRole({ name: '', permissions: '' });
        setIsEditMode(false);
        setSelectedRoleId(null);
        setIsAddRoleOpen(true);
    };

    return (
        <AdminLayout>
            <PageHeader
                title="Roles & Permissions"
                subtitle="Manage user roles and access control policies"
                actions={
                    <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-primary flex items-center gap-2" onClick={openAddDialog}>
                                <Plus className="w-4 h-4" />
                                Create Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEditMode ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                                <DialogDescription>
                                    {isEditMode ? 'Modify the role details and permissions.' : 'Define a new role and its permission scope.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Role Name</Label>
                                    <Input
                                        id="name"
                                        value={newRole.name}
                                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Librarian"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="permissions" className="text-right">Permissions</Label>
                                    <Input
                                        id="permissions"
                                        value={newRole.permissions}
                                        onChange={(e) => setNewRole({ ...newRole, permissions: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Library Access"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleCreateOrUpdateRole} disabled={!newRole.name || !newRole.permissions || isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEditMode ? 'Update Role' : 'Create Role'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="dashboard-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Active Users</TableHead>
                            <TableHead>Permissions Scope</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    {role.name}
                                </TableCell>
                                <TableCell>{role.users}</TableCell>
                                <TableCell>{role.permissions}</TableCell>
                                <TableCell>
                                    <Badge variant="success">Active</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        {role.name !== 'Super Admin' && (
                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
