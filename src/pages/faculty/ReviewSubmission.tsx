import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badge';
import { toast } from 'sonner';
import {
    ArrowLeft,
    FileText,
    User,
    BookOpen,
    Clock,
    CheckCircle,
    XCircle,
    Download,
} from 'lucide-react';

interface SubmissionData {
    id: number;
    student: string;
    assignment: string;
    course: string;
    submitted: string;
    status: string;
}

export function ReviewSubmission() {
    const navigate = useNavigate();
    const location = useLocation();
    const submission = location.state?.submission as SubmissionData;

    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If no submission data, redirect back
    if (!submission) {
        navigate('/faculty');
        return null;
    }

    const handleApprove = async () => {
        if (!grade) {
            toast.error('Please enter a grade before approving');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success(`Submission approved with grade: ${grade}`);
        setIsSubmitting(false);
        navigate('/faculty');
    };

    const handleReject = async () => {
        if (!feedback) {
            toast.error('Please provide feedback before rejecting');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.error('Submission rejected');
        setIsSubmitting(false);
        navigate('/faculty');
    };

    return (
        <FacultyLayout>
            <PageHeader
                title="Review Submission"
                subtitle="Evaluate student work and provide feedback"
                actions={
                    <Button
                        variant="outline"
                        onClick={() => navigate('/faculty')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                }
            />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Submission Details Card */}
                <div className="dashboard-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Submission Details</h2>
                        <Badge variant="warning">Pending Review</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Student Name</p>
                                <p className="font-medium">{submission.student}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Assignment</p>
                                <p className="font-medium">{submission.assignment}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Course</p>
                                <p className="font-medium">{submission.course}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Submitted</p>
                                <p className="font-medium">{submission.submitted}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submitted Work Card */}
                <div className="dashboard-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Submitted Work</h3>

                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                <span className="font-medium">assignment_submission.pdf</span>
                            </div>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">PDF Document • 2.4 MB</p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">Student Notes:</p>
                        <p className="text-sm">
                            This is a placeholder for student's submission notes or comments.
                            In a real application, this would contain the actual content submitted by the student.
                        </p>
                    </div>
                </div>

                {/* Grading Card */}
                <div className="dashboard-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Grading & Feedback</h3>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium mb-2">
                                Grade / Marks
                            </label>
                            <input
                                id="grade"
                                type="text"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                placeholder="e.g., A+, 95/100, Excellent"
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label htmlFor="feedback" className="block text-sm font-medium mb-2">
                                Feedback & Comments
                            </label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Provide detailed feedback for the student..."
                                rows={6}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                        <XCircle className="w-4 h-4" />
                        Reject Submission
                    </Button>
                    <Button
                        onClick={handleApprove}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-success hover:bg-success/90"
                    >
                        <CheckCircle className="w-4 h-4" />
                        {isSubmitting ? 'Submitting...' : 'Approve & Submit Grade'}
                    </Button>
                </div>
            </div>
        </FacultyLayout>
    );
}
