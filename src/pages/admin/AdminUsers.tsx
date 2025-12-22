import { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, GraduationCap, Building2, Shield, Plus, Search, MoreHorizontal, Loader2 } from 'lucide-react';
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
import { useSearchParams } from 'react-router-dom';

const initialUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@revoor.edu', role: 'student', institution: 'Revoor Padmanabha Chettys Matriculation School', status: 'active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Dr. Sarah Williams', email: 'sarah.w@beloved.edu', role: 'faculty', institution: 'The Beloved Matriculation School', status: 'active', lastLogin: '1 day ago' },
  { id: 3, name: 'Prof. Michael Chen', email: 'admin@venkateshwara.edu', role: 'institution', institution: 'Venkateshwara Matriculation School', status: 'active', lastLogin: '3 hours ago' },
  { id: 4, name: 'Emily Johnson', email: 'emily.j@mercury.edu', role: 'student', institution: 'Mercury Matriculation School', status: 'inactive', lastLogin: '1 week ago' },
  { id: 5, name: 'Dr. Robert Brown', email: 'r.brown@radhakrishna.edu', role: 'faculty', institution: 'Radha Krishna Matriculation School', status: 'active', lastLogin: '5 hours ago' },
  { id: 6, name: 'System Admin', email: 'superadmin@erp.com', role: 'admin', institution: 'Platform', status: 'active', lastLogin: 'Just now' },
];

export function AdminUsers() {
  const [searchParams] = useSearchParams();
  const institutionFilter = searchParams.get('institution');

  const [users, setUsers] = useState(initialUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    institution: ''
  });

  const filteredUsers = institutionFilter
    ? users.filter(u => u.institution.includes(institutionFilter) || u.institution === institutionFilter)
    : users;

  const handleAddUser = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const user = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        institution: newUser.institution,
        status: 'active',
        lastLogin: 'Never'
      };
      setUsers([...users, user]);
      setIsSubmitting(false);
      setIsAddUserOpen(false);
      setNewUser({ name: '', email: '', role: '', institution: '' });
      toast.success("User added successfully");
    }, 1000);
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (item: typeof initialUsers[0]) => {
        const variants: Record<string, 'info' | 'success' | 'warning' | 'default'> = {
          student: 'info',
          faculty: 'success',
          institution: 'warning',
          admin: 'default',
        };
        return <Badge variant={variants[item.role] as any}>{item.role}</Badge>;
      },
    },
    { key: 'institution', header: 'Institution' },
    {
      key: 'status',
      header: 'Status',
      render: (item: typeof initialUsers[0]) => (
        <Badge variant={item.status === 'active' ? 'success' : 'outline'}>
          {item.status}
        </Badge>
      ),
    },
    { key: 'lastLogin', header: 'Last Login' },
    {
      key: 'actions',
      header: '',
      render: () => (
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="User Management"
        subtitle="Manage users across all institutions"
        actions={
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Full Name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="col-span-3"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <div className="col-span-3">
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="institution">Institution Admin</SelectItem>
                        <SelectItem value="admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="institution" className="text-right">Institution</Label>
                  <Input
                    id="institution"
                    value={newUser.institution}
                    onChange={(e) => setNewUser({ ...newUser, institution: e.target.value })}
                    className="col-span-3"
                    placeholder="Institution Name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddUser} disabled={!newUser.name || !newUser.email || !newUser.role || isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value="12,500"
          icon={GraduationCap}
          iconColor="text-info"
          change="+520 this month"
          changeType="positive"
        />
        <StatCard
          title="Total Faculty"
          value="850"
          icon={Users}
          iconColor="text-success"
          change="+12 this month"
          changeType="positive"
        />
        <StatCard
          title="Institution Admins"
          value="45"
          icon={Building2}
          iconColor="text-warning"
          change="24 institutions"
        />
        <StatCard
          title="Super Admins"
          value="5"
          icon={Shield}
          iconColor="text-admin"
          change="Full access"
        />
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="dashboard-card">
            <DataTable columns={columns} data={filteredUsers} />
          </div>
        </TabsContent>

        <TabsContent value="students">
          <div className="dashboard-card">
            <DataTable columns={columns} data={filteredUsers.filter(u => u.role === 'student')} />
          </div>
        </TabsContent>

        <TabsContent value="faculty">
          <div className="dashboard-card">
            <DataTable columns={columns} data={filteredUsers.filter(u => u.role === 'faculty')} />
          </div>
        </TabsContent>

        <TabsContent value="admins">
          <div className="dashboard-card">
            <DataTable columns={columns} data={filteredUsers.filter(u => u.role === 'institution' || u.role === 'admin')} />
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
