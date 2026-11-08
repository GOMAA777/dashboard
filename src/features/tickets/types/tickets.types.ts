export type TicketPriority = "urgent" | "medium" | "low";
export type TicketStatus = "open" | "in_progress" | "pending" | "closed";
export type TicketChannel = "portal" | "email" | "phone" | "whatsapp";

export interface TicketAttachment {
  id: string;
  name: string;
  size: string;
  typeLabel: string;
  category: "json" | "image" | "log" | "pdf";
  verifiedStatus: string;
  downloadUrl?: string;
}

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderInitials: string;
  isStaff: boolean;
  isInternalNote?: boolean;
  avatar?: string;
  timestamp: string;
  content: string;
  attachments?: TicketAttachment[];
}

export interface TicketAuditEvent {
  id: string;
  action: string;
  performer: string;
  timestamp: string;
  details?: string;
}

export interface TicketClient {
  id: string;
  name: string;
  firm: string;
  email: string;
  phone: string;
  crNumber: string;
  lawyersCount?: number;
  avatar?: string;
}

export interface TicketAssignee {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  activeTicketsCount: number;
  isAvailable: boolean;
  isRecommended?: boolean;
  avatar?: string;
}

export interface TicketDepartment {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  activeTicketsCount: number;
  consultantsCount: number;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. #TCK-2024-8842
  title: string;
  description: string;
  client: TicketClient;
  department: {
    id: string;
    name: string;
    code: string;
  };
  assignee: TicketAssignee;
  priority: TicketPriority;
  status: TicketStatus;
  channel: TicketChannel;
  channelLabel: string;
  category: string;
  judicialReference?: string;
  createdAt: string;
  updatedAt: string;
  highlightStat?: string;
  attachments: TicketAttachment[];
  messages: TicketMessage[];
  auditEvents: TicketAuditEvent[];
}

export type TicketTabType = "tickets" | "departments";
export type TicketFilterStatus = "all" | "open" | "in_progress" | "closed";
export type DepartmentFilterStatus = "all" | "active" | "inactive";
