import { ParentLayout } from '@/layouts/ParentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { ChildCard } from '@/components/cards/ChildCard';

// Mock Data for Children
const myChildren = [
    {
        id: 'STU001',
        name: 'Alex Johnson',
        grade: 'Class 10-A',
        rollNo: '24',
        attendance: 92,
        performance: 'Excellent' as const,
    },
    {
        id: 'STU002',
        name: 'Emily Johnson',
        grade: 'Class 6-B',
        rollNo: '12',
        attendance: 85,
        performance: 'Good' as const,
    }
];

export function ParentDashboard() {
    const { user } = useAuth();

    return (
        <ParentLayout>
            <PageHeader
                title={`Welcome, ${user?.name}!`}
                subtitle="Manage and monitor your children's academic progress"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {myChildren.map((child) => (
                    <ChildCard key={child.id} {...child} />
                ))}
            </div>
        </ParentLayout>
    );
}
