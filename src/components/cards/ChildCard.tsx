import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap, CalendarCheck } from 'lucide-react';
import { useTranslation } from '@/i18n/TranslationContext';

interface ChildCardProps {
    id: string;
    name: string;
    grade: string;
    rollNo: string;
    attendance: number;
    performance: 'Average' | 'Good' | 'Excellent';
    image?: string;
}

export function ChildCard({ id, name, grade, rollNo, attendance, performance, image }: ChildCardProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const performanceLabel = performance === 'Excellent' ? t.parent.dashboard.performance.excellent :
        performance === 'Good' ? t.parent.dashboard.performance.good : t.parent.dashboard.performance.average;

    return (
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border-2 border-primary/10">
                            <AvatarImage src={image} />
                            <AvatarFallback className="text-lg bg-primary/5 text-primary">
                                {name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                {name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                {grade} • {t.parent.dashboard.roll}: {rollNo}
                            </p>
                        </div>
                    </div>
                    <Badge variant={performance === 'Excellent' ? 'success' : performance === 'Good' ? 'info' : 'warning'}>
                        {performanceLabel}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-xs text-muted-foreground block mb-1">{t.parent.dashboard.attendance}</span>
                        <div className="flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-primary" />
                            <span className="font-bold text-lg">{attendance}%</span>
                        </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-xs text-muted-foreground block mb-1">{t.parent.dashboard.status}</span>
                        <span className="font-semibold text-sm">{t.parent.dashboard.activeStudent}</span>
                    </div>
                </div>

                <Button
                    className="w-full group-hover:bg-primary group-hover:text-white transition-all"
                    variant="outline"
                    onClick={() => navigate(`/parent/child/${id}`)}
                >
                    {t.parent.dashboard.viewDetails}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </Card>
    );
}
