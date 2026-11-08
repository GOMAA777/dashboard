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

export interface ApiTicketStats {
  open?: number;
  open_tickets?: number;
  in_progress?: number;
  in_progress_tickets?: number;
  pending?: number;
  pending_tickets?: number;
  closed?: number;
  closed_tickets?: number;
  total?: number;
  total_tickets?: number;
  satisfaction_rate?: number;
  avg_response_time?: string | number;
  [key: string]: unknown;
}

export interface ApiTicketItem {
  id: number | string;
  ticket_number?: string;
  code?: string;
  number?: string;
  subject?: string;
  title?: string;
  description?: string;
  body?: string;
  status: string;
  priority: string;
  channel?: string;
  channel_label?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  company_id?: number | string;
  department_id?: number | string;
  client_id?: number | string;
  firm_id?: number | string;
  judicial_reference?: string;
  client?: Record<string, unknown>;
  firm?: Record<string, unknown>;
  company?: Record<string, unknown>;
  department?: Record<string, unknown>;
  assignee?: Record<string, unknown>;
  assigned_to?: Record<string, unknown>;
  staff?: Record<string, unknown>;
  messages?: Array<Record<string, unknown>>;
  replies?: Array<Record<string, unknown>>;
  conversation?: Array<Record<string, unknown>>;
  audit_events?: Array<Record<string, unknown>>;
  timeline?: Array<Record<string, unknown>>;
  activity?: Array<Record<string, unknown>>;
  attachments?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface CreateTicketPayload {
  company_id: number;
  subject: string;
  description: string;
  department_id: number;
  priority: "urgent" | "medium" | "low" | "high";
  channel?: "portal" | "email" | "phone" | "whatsapp";
}

export interface ReplyTicketPayload {
  message: string;
  is_internal_note?: boolean;
  notify_client_sms_email?: boolean;
}

export interface AssignTicketPayload {
  staff_id: number;
  reason?: string;
}

export interface UpdateTicketStatusPayload {
  status: "open" | "in_progress" | "pending" | "closed";
}

export interface ApiPlanStats {
  total_plans?: number;
  total?: number;
  plans_count?: number;
  active_plans?: number;
  active?: number;
  active_count?: number;
  subscribed_firms?: number;
  subscribers?: number;
  firms_count?: number;
  mrr?: number;
  monthly_revenue?: number;
  revenue?: number;
  growth_percentage?: number;
  growth?: number;
  [key: string]: unknown;
}

export interface ApiPlanItem {
  id: number | string;
  name: string;
  code?: string;
  description?: string;
  badge?: string;
  badge_color?: string;
  type?: string;
  monthly_price?: number;
  yearly_price?: number;
  yearly_discount_percent?: number;
  max_lawyers?: number;
  max_cases?: number;
  max_power_of_attorney?: number;
  max_clients?: number;
  max_assistants?: number;
  max_documents?: number;
  storage_limit_gb?: number;
  support_level?: string;
  features?: string[] | Array<{ id?: string; title: string; isIncluded?: boolean }>;
  is_popular?: boolean;
  status: "active" | "disabled" | "inactive";
  subscribed_firms_count?: number;
  subscribers_count?: number;
  share_percentage?: string | number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreatePlanPayload {
  name: string;
  description?: string;
  badge?: string;
  badge_color?: string;
  type?: "paid" | "custom" | "trial" | string;
  monthly_price: number;
  yearly_price: number;
  yearly_discount_percent?: number;
  max_lawyers?: number;
  max_cases?: number;
  max_power_of_attorney?: number;
  max_clients?: number;
  max_assistants?: number;
  max_documents?: number;
  storage_limit_gb?: number;
  support_level?: string;
  features?: string[];
  is_popular?: boolean;
  status?: "active" | "disabled" | "inactive";
  [key: string]: unknown;
}

export interface UpdatePlanPayload {
  name?: string;
  description?: string;
  badge?: string;
  badge_color?: string;
  type?: string;
  monthly_price?: number;
  yearly_price?: number;
  yearly_discount_percent?: number;
  max_lawyers?: number;
  max_cases?: number;
  max_power_of_attorney?: number;
  max_clients?: number;
  max_assistants?: number;
  max_documents?: number;
  storage_limit_gb?: number;
  support_level?: string;
  features?: string[];
  is_popular?: boolean;
  status?: "active" | "disabled" | "inactive";
  [key: string]: unknown;
}

export interface UpdatePlanStatusPayload {
  status: "active" | "disabled" | "inactive";
}

export interface ApiPlanSubscriber {
  id: number | string;
  name?: string;
  firm_name?: string;
  owner?: string;
  owner_name?: string;
  license_number?: string;
  city?: string;
  phone?: string;
  email?: string;
  logo?: string;
  tax_number?: string;
  lawyers_used?: number;
  lawyers_limit?: number;
  cases_used?: number;
  cases_limit?: number;
  agents_used?: number;
  agents_limit?: number;
  active_subscription?: {
    id?: number | string;
    subscription_code?: string;
    amount?: number | string;
    billing_cycle?: string;
    payment_method?: string;
    status?: string;
    start_date?: string;
    renewal_date?: string;
    ends_at?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

