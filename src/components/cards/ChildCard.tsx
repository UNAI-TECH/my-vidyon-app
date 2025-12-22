import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap, CalendarCheck } from 'lucide-react';

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
                                {grade} • Roll: {rollNo}
                            </p>
                        </div>
                    </div>
                    <Badge variant={performance === 'Excellent' ? 'success' : performance === 'Good' ? 'info' : 'warning'}>
                        {performance}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-xs text-muted-foreground block mb-1">Attendance</span>
                        <div className="flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-primary" />
                            <span className="font-bold text-lg">{attendance}%</span>
                        </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-xs text-muted-foreground block mb-1">Status</span>
                        <span className="font-semibold text-sm">Active Student</span>
                    </div>
                </div>

                <Button
                    className="w-full group-hover:bg-primary group-hover:text-white transition-all"
                    variant="outline"
                    onClick={() => navigate(`/parent/child/${id}`)}
                >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </Card>
    );
}
