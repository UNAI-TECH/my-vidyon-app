export type UserRole = 'student' | 'faculty' | 'institution' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  institutionId?: string;
  departmentId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  faculty: 'Faculty',
  institution: 'Institution',
  admin: 'Super Admin',
};

export const ROLE_ROUTES: Record<UserRole, string> = {
  student: '/student',
  faculty: '/faculty',
  institution: '/institution',
  admin: '/admin',
};
