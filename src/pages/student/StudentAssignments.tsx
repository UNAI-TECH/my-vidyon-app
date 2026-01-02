import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { AssignmentCard } from '@/components/cards/AssignmentCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/TranslationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useState } from 'react';
import { Upload } from 'lucide-react';

const assignments = {
  pending: [
    { title: 'Algebra Problem Set', course: 'Mathematics', dueDate: 'Dec 22, 2025', status: 'pending' as const },
    { title: 'Plant Cell Diagram', course: 'Science', dueDate: 'Dec 24, 2025', status: 'pending' as const },
    { title: 'Map Work: Rivers of India', course: 'Social Studies', dueDate: 'Dec 26, 2025', status: 'pending' as const },
  ],
  submitted: [
    { title: 'Essay: My Favourite Holiday', course: 'English', dueDate: 'Dec 20, 2025', status: 'submitted' as const },
    { title: 'Lab Report: Acid & Bases', course: 'Science', dueDate: 'Dec 19, 2025', status: 'submitted' as const },
  ],
  graded: [
    { title: 'Kabir Ke Dohe', course: 'Hindi', dueDate: 'Dec 18, 2025', status: 'graded' as const, grade: '95', maxGrade: '100' },
    { title: 'Geometry Test', course: 'Mathematics', dueDate: 'Dec 15, 2025', status: 'graded' as const, grade: '88', maxGrade: '100' },
    { title: 'History Timeline', course: 'Social Studies', dueDate: 'Dec 12, 2025', status: 'graded' as const, grade: '92', maxGrade: '100' },
  ],
  overdue: [
    { title: 'Grammar Worksheet', course: 'English', dueDate: 'Dec 10, 2025', status: 'overdue' as const },
  ],
};

export function StudentAssignments() {
  const { t } = useTranslation();
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const handleSubmitClick = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsSubmitOpen(true);
  };

  const handleSubmitConfirm = () => {
    toast.success("Assignment submitted successfully!");
    setIsSubmitOpen(false);
  };

  const handleRequestExtension = () => {
    toast.success("Extension request sent to staff!");
  };

  return (
    <StudentLayout>
      <PageHeader
        title={t.nav.assignments}
        subtitle={t.dashboard.overview}
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {assignments.pending.map((assignment, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <AssignmentCard {...assignment} />
              </div>
              <Button className="btn-primary" onClick={() => handleSubmitClick(assignment)}>{t.common.submit}</Button>
            </div>
          ))}

          <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Submit Assignment</DialogTitle>
                <DialogDescription>
                  Upload your work for {selectedAssignment?.title}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="file">Assignment File (Photo/PDF)</Label>
                  <Input id="file" type="file" accept="image/*,.pdf" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitConfirm}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {assignments.submitted.map((assignment, index) => (
            <AssignmentCard key={index} {...assignment} />
          ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {assignments.graded.map((assignment, index) => (
            <AssignmentCard key={index} {...assignment} />
          ))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {assignments.overdue.map((assignment, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <AssignmentCard {...assignment} />
              </div>
              <Button variant="outline" onClick={handleRequestExtension}>Request Extension</Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </StudentLayout>
  );
}
