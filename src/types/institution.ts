// Institution Types and Interfaces

export type InstitutionType = 'Matriculation' | 'CBSE' | 'ICSE';
export type InstitutionStatus = 'Active' | 'Inactive';
export type StaffRole = 'Teacher' | 'Admin' | 'Support';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Institution {
    id: string;
    name: string;
    type: InstitutionType;
    address: string;
    city: string;
    state: string;
    contactEmail: string;
    contactPhone: string;
    academicYear: string;
    logo?: string;
    status: InstitutionStatus;
    totalStudents: number;
    totalStaff: number;
    totalClasses: number;
    totalSections: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Group {
    id: string;
    name: string;
    institutionId: string;
    classes: ClassInfo[];
}

export interface ClassInfo {
    id: string;
    name: string;
    sections: string[];
    groupId: string;
}

export interface Subject {
    id: string;
    name: string;
    code: string;
    classId: string;
    groupId: string;
    institutionId: string;
}

export interface Student {
    id: string;
    name: string;
    registerNumber: string;
    classId: string;
    section: string;
    dateOfBirth: Date;
    gender: Gender;
    parentName: string;
    parentContact: string;
    email: string;
    address: string;
    institutionId: string;
}

export interface Staff {
    id: string;
    name: string;
    staffId: string;
    role: StaffRole;
    subjectAssigned?: string;
    classAssigned?: string;
    email: string;
    phoneNumber: string;
    institutionId: string;
}

export interface InstitutionFormData {
    // Step 1: Basic Details
    basicDetails: {
        name: string;
        type: InstitutionType;
        address: string;
        city: string;
        state: string;
        contactEmail: string;
        contactPhone: string;
        academicYear: string;
        logo?: File;
        status: InstitutionStatus;
    };
    // Step 2: Groups and Classes
    groups: Group[];
    // Step 3: Subjects
    subjects: Subject[];
    // Step 4: Students
    students: Student[];
    // Step 5: Staff
    staff: Staff[];
    // Step 6: Role Assignment (auto-generated)
    roleAssignments: {
        studentAccess: boolean;
        staffAccess: boolean;
        institutionHeadAccess: boolean;
    };
}

export interface QuickAction {
    label: string;
    icon: any;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
}
