export type NotificationStatus = "sent" | "active" | "scheduled" | "draft";

export type AudienceType = "all" | "specific";

export type NotificationPriority = "high" | "normal" | "mandatory";

export interface NotificationItem {
  id: string;
  code: string;
  title: string;
  description: string;
  status: NotificationStatus;
  statusLabel: string;
  sentAt: string;
  scheduledFor?: string;
  audienceType: AudienceType;
  targetAudienceLabel: string;
  targetCount: number;
  actionUrl: string;
  imageUrl?: string;
  imageFileName?: string;
  imageFileSize?: string;
  imageDimensions?: string;
  priority?: NotificationPriority;
  categoryBadge?: string;
  actionButtonText?: string;
}

export interface NotificationTabCounts {
  all: number;
  activeAndReceived: number;
  scheduled: number;
  drafts: number;
}

export interface NotificationFilterState {
  tab: "all" | "active" | "scheduled" | "draft";
  search: string;
  pageSize: number;
  page: number;
}
