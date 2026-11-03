export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export interface AdminUser {
  id: number | string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface LoginResponseData {
  token?: string;
  access_token?: string;
  admin_token?: string;
  user?: AdminUser;
  admin?: AdminUser;
  [key: string]: unknown;
}

export interface FirmListItem {
  id: number | string;
  name?: string;
  owner_name?: string;
  owner?: string;
  license_number?: string;
  email?: string;
  phone?: string;
  landline?: string | null;
  address?: string | null;
  city?: string | null;
  logo?: string | null;
  color?: string | null;
  theme_color?: string | null;
  primary_color?: string | null;
  subscription_plan?: string;
  plan_id?: number | null;
  billing_cycle?: string | null;
  tax_number?: string | null;
  auto_renew?: boolean;
  used_storage_gb?: string;
  subscription_start?: string | null;
  subscription_end?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  plan?: ApiFirmPlan | string;
  active_subscription?: ApiActiveSubscription | null;
  [key: string]: unknown;
}

export interface ApiFirmStats {
  total_firms: number;
  active_firms: number;
  active_percentage: number;
  trial_firms: number;
  trial_avg_days_left: number;
  suspended_firms: number;
  suspended_awaiting_payment: number;
}

export interface ApiFirmPlan {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  badge?: string;
  badge_color?: string;
  type?: string;
  monthly_price?: string;
  yearly_price?: string;
  yearly_discount_percent?: number;
  max_lawyers?: number;
  max_cases?: number;
  max_power_of_attorney?: number;
  max_clients?: number;
  max_assistants?: number;
  storage_limit_gb?: number;
  support_level?: string;
  features?: string[];
  is_popular?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiActiveSubscription {
  id?: number;
  subscription_code?: string;
  company_id?: number;
  plan_id?: number;
  plan_name?: string;
  billing_cycle?: string;
  monthly_equivalent?: number;
  amount?: string;
  payment_method?: string;
  auto_renew?: boolean;
  start_date?: string;
  renewal_date?: string;
  status?: string;
  rejection_reason?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiFirmResourceUsage {
  lawyers_used: number;
  lawyers_limit: number;
  lawyers_percent: number;
  storage_used_gb: string;
  storage_limit_gb: number;
  storage_percent: number;
  active_cases: number;
}

export interface ApiFirmDetail {
  firm: FirmListItem;
  active_subscription?: ApiActiveSubscription | null;
  resource_usage?: ApiFirmResourceUsage;
  recent_invoices?: unknown[];
  recent_tickets?: unknown[];
  internal_notes?: Array<{
    id: number;
    author_name?: string;
    author_role?: string;
    note: string;
    created_at?: string;
  }>;
}

export interface Paginated<T> {
  data?: T[];
  items?: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  [key: string]: unknown;
}
