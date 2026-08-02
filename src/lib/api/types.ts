// Mirrors the shapes returned by the BoaFie NestJS API (see boafie_schema.sql).
// Kept intentionally loose (optional fields) since the API's `select()` calls
// vary by endpoint — treat these as "the fields you can rely on", not exhaustive.

export type UserRole = 'client' | 'artisan' | 'freelancer' | 'admin';
export type VerifyStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type JobStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  status?: string;
  plan?: 'free' | 'verified_pro' | 'business';
  diaspora_mode?: boolean;
  country_of_residence?: string | null;
  preferred_currency?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'artisan' | 'freelancer' | 'both';
  icon?: string | null;
}

export interface ArtisanProfile {
  id: string;
  user_id: string;
  trade_category: string;
  trade_subcategories?: string[];
  years_experience?: number | null;
  hourly_rate_ghs?: number | null;
  daily_rate_ghs?: number | null;
  availability: 'available' | 'busy' | 'unavailable';
  location_text?: string | null;
  region?: string | null;
  city?: string | null;
  total_jobs_done: number;
  ai_bio?: string | null;
  users?: Pick<User, 'id' | 'full_name' | 'avatar_url' | 'bio' | 'status'>;
}

export interface FreelancerProfile {
  id: string;
  user_id: string;
  title: string;
  skills?: string[];
  hourly_rate_ghs?: number | null;
  availability: 'available' | 'busy' | 'unavailable';
  remote_only?: boolean;
  location_text?: string | null;
  total_jobs_done: number;
  ai_bio?: string | null;
  users?: Pick<User, 'id' | 'full_name' | 'avatar_url' | 'bio' | 'status'>;
}

export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string | null;
  skills_required?: string[];
  location_text?: string | null;
  is_remote?: boolean;
  budget_min_ghs?: number | null;
  budget_max_ghs?: number | null;
  budget_type?: 'fixed' | 'hourly' | 'daily';
  currency?: string;
  deadline?: string | null;
  urgency?: 'emergency' | 'urgent' | 'normal';
  status: JobStatus;
  is_diaspora_job?: boolean;
  diaspora_country?: string | null;
  view_count?: number;
  proposal_count?: number;
  created_at: string;
  client?: Pick<User, 'id' | 'full_name' | 'avatar_url'>;
}

export interface Proposal {
  id: string;
  job_id: string;
  worker_id: string;
  cover_letter: string;
  proposed_rate: number;
  rate_type?: string;
  estimated_days?: number | null;
  status: ProposalStatus;
  created_at: string;
  job?: Pick<Job, 'id' | 'title' | 'status' | 'budget_min_ghs' | 'budget_max_ghs'>;
  worker?: Pick<User, 'id' | 'full_name' | 'avatar_url' | 'role'>;
}

export interface Contract {
  id: string;
  job_id: string;
  client_id: string;
  worker_id: string;
  title: string;
  agreed_amount: number;
  currency?: string;
  status: JobStatus;
  created_at: string;
  client?: Pick<User, 'id' | 'full_name' | 'avatar_url'>;
  worker?: Pick<User, 'id' | 'full_name' | 'avatar_url'>;
  job?: Pick<Job, 'id' | 'title'>;
}

export interface Milestone {
  id: string;
  contract_id: string;
  title: string;
  description?: string | null;
  amount_ghs: number;
  due_date?: string | null;
  status: MilestoneStatus;
  submission_note?: string | null;
  submission_media?: string[];
  sort_order?: number;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance_ghs: number;
  pending_ghs: number;
  lifetime_earned: number;
  currency: string;
}

export interface Verification {
  id: string;
  user_id: string;
  phone_status: VerifyStatus;
  id_status: VerifyStatus;
  selfie_status: VerifyStatus;
  location_status: VerifyStatus;
  trade_cert_status: VerifyStatus;
  overall_verified: boolean;
}

export interface WorkerMatch {
  type: 'artisan' | 'freelancer';
  score: number;
  profile: ArtisanProfile | FreelancerProfile;
}

export interface DashboardSummary {
  role: UserRole;
  active_jobs?: number;
  open_contracts?: number;
  active_proposals?: number;
  unread_notifications: number;
  wallet?: { balance_ghs: number; pending_ghs: number; lifetime_earned: number } | null;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
}
