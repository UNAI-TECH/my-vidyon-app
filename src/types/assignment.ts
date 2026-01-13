export interface Assignment {
    id: string;
    title: string;
    description?: string;
    course: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded' | 'overdue' | 'active' | 'closed';
    grade?: string;
    maxGrade?: string;
    class?: string; // For faculty view
    submissionsCount?: string; // For faculty view
}

export interface Submission {
    id: string;
    assignment_id: string;
    student_id: string; // In a real app, this would be the user's ID
    file_path: string;
    file_name: string;
    submitted_at: string;
    status: 'submitted' | 'graded';
    grade?: string;
    feedback?: string;
    student_name?: string; // For faculty view, joined from profiles
}
