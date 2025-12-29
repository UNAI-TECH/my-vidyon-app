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
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group touch-active">
            <div className="p-4 sm:p-6">
                {/* Header - Stacks on very small screens */}
                <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-primary/10 flex-shrink-0">
                            <AvatarImage src={image} />
                            <AvatarFallback className="text-sm sm:text-lg bg-primary/5 text-primary">
                                {name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                                {name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{grade} • {t.parent.dashboard.roll}: {rollNo}</span>
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant={performance === 'Excellent' ? 'success' : performance === 'Good' ? 'info' : 'warning'}
                        className="self-start xs:self-auto flex-shrink-0"
                    >
                        {performanceLabel}
                    </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                        <span className="text-[10px] sm:text-xs text-muted-foreground block mb-0.5 sm:mb-1">{t.parent.dashboard.attendance}</span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                            <span className="font-bold text-base sm:text-lg">{attendance}%</span>
                        </div>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                        <span className="text-[10px] sm:text-xs text-muted-foreground block mb-0.5 sm:mb-1">{t.parent.dashboard.status}</span>
                        <span className="font-semibold text-xs sm:text-sm">{t.parent.dashboard.activeStudent}</span>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    className="w-full group-hover:bg-primary group-hover:text-white transition-all min-h-[44px]"
                    variant="outline"
                    onClick={() => navigate(`/parent/child/${id}`)}
                >
                    <span className="text-sm">{t.parent.dashboard.viewDetails}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </Card>
    );
}

