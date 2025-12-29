import { useState } from 'react';
import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Upload, Eye, Download, Calendar } from 'lucide-react';

const initialExamPapers = [
    { id: 1, title: 'Term 2 Final Exam', subject: 'Mathematics', class: 'Grade 10', date: 'Dec 22, 2025', status: 'ready' },
    { id: 2, title: 'Unit Test - II', subject: 'Science', class: 'Grade 9', date: 'Dec 15, 2025', status: 'archived' },
    { id: 3, title: 'Half Yearly Examination', subject: 'English', class: 'Grade 10', date: 'Oct 10, 2025', status: 'archived' },
];

export function FacultyExams() {
    const [papers, setPapers] = useState(initialExamPapers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPaper, setNewPaper] = useState({
        title: '',
        subject: '',
        class: 'Grade 10',
        date: ''
    });

    const handleAddPaper = () => {
        if (!newPaper.title || !newPaper.subject || !newPaper.date) return;

        const paper = {
            id: Math.max(...papers.map(p => p.id), 0) + 1,
            title: newPaper.title,
            subject: newPaper.subject,
            class: newPaper.class,
            date: new Date(newPaper.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'ready'
        };

        setPapers([paper, ...papers]);
        setIsDialogOpen(false);
        setNewPaper({ title: '', subject: '', class: 'Grade 10', date: '' });
    };

    return (
        <FacultyLayout>
            <PageHeader
                title="Exam Papers"
                subtitle="Manage and upload examination question papers"
                actions={
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-primary flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Upload New Paper
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Upload New Exam Paper</DialogTitle>
                                <DialogDescription>
                                    Add details for the new examination paper.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        Exam Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={newPaper.title}
                                        onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                                        className="col-span-3"
                                        placeholder="Final Semester Exam"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="subject" className="text-right">
                                        Subject
                                    </Label>
                                    <Input
                                        id="subject"
                                        value={newPaper.subject}
                                        onChange={(e) => setNewPaper({ ...newPaper, subject: e.target.value })}
                                        className="col-span-3"
                                        placeholder="Mathematics"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="class" className="text-right">
                                        Class
                                    </Label>
                                    <Input
                                        id="class"
                                        value={newPaper.class}
                                        onChange={(e) => setNewPaper({ ...newPaper, class: e.target.value })}
                                        className="col-span-3"
                                        placeholder="Grade 10"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="date" className="text-right">
                                        Date
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newPaper.date}
                                        onChange={(e) => setNewPaper({ ...newPaper, date: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="file" className="text-right">
                                        File
                                    </Label>
                                    <div className="col-span-3">
                                        <Input id="file" type="file" className="cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddPaper}>Upload Paper</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papers.map((paper) => (
                    <div key={paper.id} className="dashboard-card group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${paper.status === 'ready' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                                }`}>
                                {paper.status}
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{paper.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{paper.subject} • {paper.class}</p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Exam Date: {paper.date}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-border">
                            <Button variant="outline" size="sm" className="flex-1 gap-2">
                                <Eye className="w-4 h-4" />
                                Preview
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-2">
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Upload Card - Trigger Dialog */}
                <div onClick={() => setIsDialogOpen(true)} className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="p-4 bg-muted rounded-full mb-4">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold mb-1">Upload Exam Paper</h4>
                    <p className="text-xs text-muted-foreground max-w-[200px]">PDF, Word or Excel files accepted (Max 10MB)</p>
                </div>
            </div>
        </FacultyLayout>
    );
}
