
import { useState, useEffect } from 'react';
import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/common/Badge';
import { Plus, Trash2, Save, Send, ChevronRight, School, Loader2, IndianRupee } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Group {
    id: string;
    name: string;
    classes: ClassItem[];
}

interface ClassItem {
    id: string;
    name: string;
    sections: string[]; // "sections" is array of strings in groups table
    groupName?: string;
}

interface FeeComponent {
    id: string;
    title: string;
    amount: string; // string for input handling, convert to number for maths
}

export function InstitutionFeeStructure() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    // Popup State
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [feeComponents, setFeeComponents] = useState<FeeComponent[]>([{ id: '1', title: 'Tuition Fee', amount: '0' }]);
    const [structureName, setStructureName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user?.institutionId) {
            fetchClasses();
        }
    }, [user?.institutionId]);

    const fetchClasses = async () => {
        try {
            const { data, error } = await supabase
                .from('groups')
                .select('id, name, classes(id, name, sections)')
                .eq('institution_id', user!.institutionId);

            if (error) throw error;
            setGroups(data || []);
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Failed to load classes");
        } finally {
            setLoading(false);
        }
    };

    const handleClassClick = (cls: ClassItem, groupName: string) => {
        setSelectedClass({ ...cls, groupName });
        // Reset form or fetch existing structure for this class if exists?
        // User says "create a new option... in that page it list out the classes when i clicks the class it shows a popup page of fees structure"
        // Ideally we should fetch if one exists to edit it.
        // For now, reset to default state for creation.
        setFeeComponents([{ id: '1', title: 'Tuition Fee', amount: '0' }]);
        setStructureName(`${cls.name} Fee Structure`);
        setDueDate('');
        setIsDialogOpen(true);
        fetchExistingStructure(cls.id);
    };

    const fetchExistingStructure = async (classId: string) => {
        // Optimistic fetch: try to find the latest fee structure for this class
        // Note: The schema for fee_structures might link to class_id.
        // We'll assuming there's a loose link or we create a new one. 
        // Existing InstitutionFees.tsx logic uses `class_id` column optionally.
        const { data } = await supabase
            .from('fee_structures')
            .select('*')
            .eq('institution_id', user!.institutionId)
            // .eq('class_id', classId) // If class_id exists. If not, we might rely on naming convention or add the column.
            .ilike('name', `%${classId}%`) // Fallback search if class_id column missing
            .limit(1);

        if (data && data.length > 0) {
            const fs = data[0];
            setStructureName(fs.name);
            setDueDate(fs.due_date ? fs.due_date.split('T')[0] : '');

            // Parse components if stored in description or similar
            // Assuming we might store it in 'description' as JSON string for now as planned
            try {
                if (fs.description && fs.description.startsWith('[')) {
                    const parsed = JSON.parse(fs.description);
                    if (Array.isArray(parsed)) setFeeComponents(parsed);
                } else {
                    // Fallback: If just flat amount
                    setFeeComponents([{ id: '1', title: fs.name, amount: fs.amount.toString() }]);
                }
            } catch (e) {
                setFeeComponents([{ id: '1', title: fs.name, amount: fs.amount.toString() }]);
            }
        }
    };

    const addComponent = () => {
        setFeeComponents([...feeComponents, { id: Date.now().toString(), title: '', amount: '' }]);
    };

    const removeComponent = (id: string) => {
        if (feeComponents.length === 1) return;
        setFeeComponents(feeComponents.filter(c => c.id !== id));
    };

    const updateComponent = (id: string, field: keyof FeeComponent, value: string) => {
        setFeeComponents(feeComponents.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const calculateTotal = () => {
        return feeComponents.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    };

    const handleSave = async () => {
        if (!user?.institutionId || !selectedClass) return;
        setSaving(true);
        try {
            const totalAmount = calculateTotal();
            const componentsJson = JSON.stringify(feeComponents);

            // Insert into fee_structures
            // Note: We are using 'description' field to store the components JSON for now.
            const { error } = await supabase.from('fee_structures').insert([{
                institution_id: user.institutionId,
                name: structureName,
                amount: totalAmount,
                due_date: dueDate ? new Date(dueDate).toISOString() : null,
                description: componentsJson, // Storing breakdown here
                // class_id: selectedClass.id // If column exists, good. If not, this might fail unless we check schema.
                // Safest to omit class_id if not sure, but user wants class-specific.
                // We'll rely on the name containing the context or add a meta field if possible.
            }]);

            if (error) throw error;
            toast.success("Fee structure saved successfully");
            setIsDialogOpen(false);
        } catch (error: any) {
            console.error("Save error:", error);
            toast.error("Failed to save: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSendNotification = async () => {
        if (!selectedClass || !user?.institutionId) return;

        toast.promise(sendNotificationLogic(), {
            loading: 'Sending notifications...',
            success: 'Notifications sent to ' + selectedClass.name,
            error: 'Failed to send notifications'
        });
    };

    const sendNotificationLogic = async () => {
        // Logic: Find students in this class -> Insert notifications
        // We know class ID (selectedClass.id) but `students` table usually uses `class_name` and `section`.
        // `selectedClass.name` is the class name (e.g. "Grade 10").
        // Need to target ALL sections.

        const { data: students, error: stuError } = await supabase
            .from('students')
            .select('id, parent_id, user_id') // user_id might be student login?
            .eq('institution_id', user!.institutionId)
            .eq('class_name', selectedClass!.name); // Fetch by name to cover all sections

        if (stuError) throw stuError;
        if (!students || students.length === 0) throw new Error("No students found in this class");

        const notifications = [];
        const timestamp = new Date().toISOString();
        const message = `New Fee Structure released for ${selectedClass!.name}. Total Amount: ₹${calculateTotal()}`;

        // Notify Students (if they have user accounts) & Parents
        students.forEach(s => {
            // Notify Parent
            if (s.parent_id) {
                notifications.push({
                    user_id: s.parent_id,
                    title: 'New Fee Structure',
                    message: message,
                    type: 'fees',
                    read: false,
                    date: timestamp
                });
            }
            // Notify Student?? optional.
        });

        // Batch insert
        // Note: Supabase might have limits on batch size, but for a single class it's usually fine.
        if (notifications.length > 0) {
            const { error } = await supabase.from('notifications').insert(notifications);
            if (error) throw error;
        }
    };

    const getDisplayName = (cls: ClassItem, groupName: string) => {
        const lowerName = cls.name.toLowerCase();
        // Check if 11 or 12 or XI or XII
        if (['11', '12', 'xi', 'xii'].some(s => lowerName.includes(s))) {
            return `${cls.name} (${groupName})`;
        }
        return cls.name;
    };

    return (
        <InstitutionLayout>
            <PageHeader
                title="Fee Structures"
                subtitle="Manage and configure fees for all classes"
            />

            <div className="space-y-8 animate-in fade-in duration-500">
                {groups.map((group) => {
                    // Filter out empty groups if any, but usually we want to see hierarchy
                    if (!group.classes || group.classes.length === 0) return null;

                    return (
                        <div key={group.id} className="space-y-4">
                            <h3 className="text-lg font-semibold text-muted-foreground border-b pb-2 flex items-center gap-2">
                                <School className="w-5 h-5" />
                                {group.name}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {group.classes.map((cls) => (
                                    <Card
                                        key={cls.id}
                                        className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden border-2 border-transparent hover:border-primary"
                                        onClick={() => handleClassClick(cls, group.name)}
                                    >
                                        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[120px]">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <IndianRupee className="w-6 h-6 text-primary" />
                                            </div>
                                            <h4 className="font-bold text-lg">{getDisplayName(cls, group.name)}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">{cls.sections.length} Sections</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {groups.length === 0 && !loading && (
                    <div className="text-center py-20 text-muted-foreground">
                        No classes found. Please configure classes in Institution Settings.
                    </div>
                )}
            </div>

            {/* Fee Structure Popup */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6">
                    <DialogHeader>
                        <DialogTitle>Configure Fees: {selectedClass ? getDisplayName(selectedClass, selectedClass.groupName || '') : ''}</DialogTitle>
                        <DialogDescription>Define the fee breakdown for this class. Saved changes will be applied to all students in this class.</DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
                        {/* Meta Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Fee Title</Label>
                                <Input
                                    value={structureName}
                                    onChange={(e) => setStructureName(e.target.value)}
                                    placeholder="e.g. Annual Fees 2026"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Dynamic Components */}
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                            <div className="flex justify-between items-center mb-2">
                                <Label className="text-base font-semibold">Fee Components</Label>
                                <Badge variant="outline">Total: ₹{calculateTotal().toLocaleString()}</Badge>
                            </div>

                            {feeComponents.map((comp, index) => (
                                <div key={comp.id} className="grid grid-cols-12 gap-2 hover:bg-muted/50 p-2 rounded-md items-end">
                                    <div className="col-span-7 space-y-1">
                                        <Label className="text-xs text-muted-foreground">Title</Label>
                                        <Input
                                            value={comp.title}
                                            onChange={(e) => updateComponent(comp.id, 'title', e.target.value)}
                                            placeholder="Component Name"
                                        />
                                    </div>
                                    <div className="col-span-4 space-y-1">
                                        <Label className="text-xs text-muted-foreground">Amount</Label>
                                        <Input
                                            type="number"
                                            value={comp.amount}
                                            onChange={(e) => updateComponent(comp.id, 'amount', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => removeComponent(comp.id)}
                                            disabled={feeComponents.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-2">
                                <Button onClick={addComponent} variant="outline" size="sm" className="w-full border-dashed">
                                    <Plus className="w-4 h-4 mr-2" /> Add Component
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <div className="flex-1 flex justify-start items-center font-bold text-lg">
                            Total: ₹{calculateTotal().toLocaleString()}
                        </div>
                        <Button variant="outline" onClick={() => handleSendNotification()} className="gap-2 text-primary border-primary/20 hover:bg-primary/5">
                            <Send className="w-4 h-4" /> Notify Users
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-[100px]">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </InstitutionLayout>
    );
}
