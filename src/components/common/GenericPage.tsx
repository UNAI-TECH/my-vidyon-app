import { ReactNode } from 'react';
import { PageHeader } from '@/components/common/PageHeader';

interface GenericPageProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    Layout: React.ComponentType<{ children: ReactNode }>;
}

export function GenericPage({ title, subtitle, children, Layout }: GenericPageProps) {
    return (
        <Layout>
            <PageHeader title={title} subtitle={subtitle} />

            <div className="dashboard-card">
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-muted-foreground mb-6">
                        This page is under development. Content will be available soon.
                    </p>
                    {children}
                </div>
            </div>
        </Layout>
    );
}
