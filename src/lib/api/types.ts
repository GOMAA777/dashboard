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
  email?: string;
  phone?: string;
  city?: string;
  license_number?: string;
  plan_name?: string;
  plan?: string;
  status?: string;
  account_status?: string;
  subscription_status?: string;
  created_at?: string;
  registration_date?: string;
  [key: string]: unknown;
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
