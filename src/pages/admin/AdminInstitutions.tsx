import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { InstitutionCard } from '@/components/cards/InstitutionCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const institutions = {
  active: [
    {
      id: 'RPC001',
      name: 'Revoor Padmanabha Chattys Matriculation School',
      code: 'RPC001',
      location: 'Chennai, Tamil Nadu',
      students: 1250,
      faculty: 68,
      status: 'active' as const,
      type: 'Matriculation',
      classes: 15,
      sections: 28
    },
    {
      id: 'TBM001',
      name: 'The Beloved Matriculation School',
      code: 'TBM001',
      location: 'Coimbatore, Tamil Nadu',
      students: 980,
      faculty: 52,
      status: 'active' as const,
      type: 'Matriculation',
      classes: 12,
      sections: 24
    },
    {
      id: 'VMS001',
      name: 'Venkateshwara Matriculation School',
      code: 'VMS001',
      location: 'Madurai, Tamil Nadu',
      students: 1450,
      faculty: 75,
      status: 'active' as const,
      type: 'Matriculation',
      classes: 15,
      sections: 30
    },
    {
      id: 'MMS001',
      name: 'Mercury Matriculation School',
      code: 'MMS001',
      location: 'Trichy, Tamil Nadu',
      students: 820,
      faculty: 45,
      status: 'active' as const,
      type: 'Matriculation',
      classes: 12,
      sections: 20
    },
    {
      id: 'RKM001',
      name: 'Radha Krishna Matriculation School',
      code: 'RKM001',
      location: 'Salem, Tamil Nadu',
      students: 1120,
      faculty: 58,
      status: 'active' as const,
      type: 'Matriculation',
      classes: 14,
      sections: 26
    },
  ],
  pending: [],
  suspended: [],
};

export function AdminInstitutions() {
  const navigate = useNavigate();

  const handleAddInstitution = () => {
    navigate('/admin/add-institution');
  };

  const handleViewInstitution = (institutionId: string) => {
    navigate(`/admin/institutions/${institutionId}`);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Institution Management"
        subtitle="Manage and monitor all registered institutions"
        actions={
          <Button
            className="btn-primary flex items-center gap-2"
            onClick={handleAddInstitution}
          >
            <Plus className="w-4 h-4" />
            Add Institution
          </Button>
        }
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search institutions..."
            className="input-field pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active ({institutions.active.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({institutions.pending.length})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({institutions.suspended.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {institutions.active.map((institution) => (
              <InstitutionCard
                key={institution.code}
                {...institution}
                onClick={() => handleViewInstitution(institution.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No pending institutions</p>
          </div>
        </TabsContent>

        <TabsContent value="suspended">
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No suspended institutions</p>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
