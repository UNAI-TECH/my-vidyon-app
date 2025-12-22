export const en = {
    // Common
    common: {
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        download: 'Download',
        upload: 'Upload',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        submit: 'Submit',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        confirm: 'Confirm',
        yes: 'Yes',
        no: 'No',
    },

    // Login Page
    login: {
        title: 'My Vidyon',
        subtitle: 'From classrooms to control panels, everything connected',
        description: 'Comprehensive Education Management Platform',
        welcomeBack: 'Welcome Back',
        signInMessage: 'Sign in to access your dashboard',
        quickDemoLogin: 'Quick Demo Login',
        orContinueWith: 'or continue with email',
        emailAddress: 'Email Address',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign in',
        signingIn: 'Signing in...',
        noAccount: "Don't have an account?",
        contactAdmin: 'Contact your administrator',
        copyright: '© 2025 My Vidyon. All rights reserved.',
        student: 'Student',
        faculty: 'Faculty',
        institution: 'Institution',
        admin: 'Admin',
    },

    // Navigation
    nav: {
        dashboard: 'Dashboard',
        courses: 'My Subject',
        timetable: 'Timetable',
        attendance: 'Attendance',
        assignments: 'Assignments',
        grades: 'Grades',
        materials: 'Materials',
        fees: 'Fees',
        certificates: 'Certificates',
        notifications: 'Notifications',
        aiTutor: 'AI Tutor',
        students: 'Students',
        marks: 'Marks Entry',
        exams: 'Exam Papers',
        analytics: 'Analytics',
        announcements: 'Announcements',
        leave: 'Leave Requests',
        departments: 'Departments',
        faculty: 'Faculty',
        calendar: 'Academic Calendar',
        admissions: 'Admissions',
        feeStructure: 'Fee Structure',
        reports: 'Reports',
        settings: 'Settings',
        institutions: 'Institutions',
        users: 'User Management',
        roles: 'Roles & Permissions',
        api: 'API Management',
        database: 'Database',
        monitoring: 'Monitoring',
        features: 'Feature Flags',
        config: 'Global Config',
    },

    // Dashboard
    dashboard: {
        overview: 'Overview',
        recentActivity: 'Recent Activity',
        upcomingEvents: 'Upcoming Events',
        statistics: 'Statistics',
        quickActions: 'Quick Actions',
    },

    // Student
    student: {
        myProgress: 'My Progress',
        currentGPA: 'Current GPA',
        attendanceRate: 'Attendance Rate',
        pendingAssignments: 'Pending Assignments',
        upcomingExams: 'Upcoming Exams',
    },

    // Faculty
    faculty: {
        myCourses: 'My Courses',
        totalStudents: 'Total Students',
        pendingGrading: 'Pending Grading',
        upcomingClasses: 'Upcoming Classes',
    },

    // Institution
    institution: {
        totalStudents: 'Total Students',
        totalFaculty: 'Total Faculty',
        activeCourses: 'Active Courses',
        departments: 'Departments',
    },

    // Admin
    admin: {
        totalInstitutions: 'Total Institutions',
        totalUsers: 'Total Users',
        systemHealth: 'System Health',
        activeConnections: 'Active Connections',
    },

    // Messages
    messages: {
        loginSuccess: 'Login successful!',
        loginError: 'Invalid credentials. Please try again.',
        saveSuccess: 'Saved successfully!',
        saveError: 'Failed to save. Please try again.',
        deleteSuccess: 'Deleted successfully!',
        deleteError: 'Failed to delete. Please try again.',
        uploadSuccess: 'Uploaded successfully!',
        uploadError: 'Failed to upload. Please try again.',
    },
};

export type TranslationKeys = typeof en;
