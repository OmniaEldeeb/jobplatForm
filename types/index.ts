// ─── API Response shapes ───────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  result: true;
  message?: string;
  data: T;
}

export interface ApiError {
  result: false;
  code: string;
  message: string;
  meta?: {
    errors?: Record<string, string[]>;
    retry_after?: number;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── User / Auth ───────────────────────────────────────────────────────────

export type UserRole = "candidate" | "company" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthData {
  token: string;
  user: User;
  role: UserRole;
}

export interface CandidateProfile {
  headline?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  profile_image_url?: string;
  open_to_work?: boolean;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  certifications?: Certification[];
}

export interface Experience {
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface Education {
  degree: string;
  school: string;
  start_date: string;
  end_date?: string;
}

export interface Project {
  name: string;
  description?: string;
  url?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

// ─── Form field errors (from meta.errors) ─────────────────────────────────

export type FieldErrors = Record<string, string[]>;