export type WebsiteSettingsTab =
  | "theme-options"
  | "menu"
  | "use-case"
  | "nav-more"
  | "section-titles"
  | "small-title"
  | "hero"
  | "partner-logo"
  | "story"
  | "unique-feature"
  | "feature"
  | "ai-chat"
  | "testimonials"
  | "advantage"
  | "faq"
  | "cta"
  | "flow-builder"
  | "highlighted-feature"
  | "footer-content"
  | "seo"
  | "custom-js"
  | "custom-css"
  | "google-setup"
  | "facebook-pixel";

export interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export interface UseCaseItem {
  id: string;
  orderNumber: number;
  title: string;
  description: string;
  status: boolean;
}

export interface NavMoreItem {
  id: string;
  orderNumber: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: boolean;
}

export interface SectionTitlesData {
  partnerSectionTitle: string;
  storySectionTitle: string;
  storySectionSubtitle: string;
  uniqueFeatureSectionTitle: string;
  featureSectionTitle: string;
  featureSectionSubtitle: string;
  testimonialSectionTitle: string;
  testimonialSectionSubtitle: string;
  pricingSectionTitle: string;
  pricingSectionSubtitle: string;
  advantageSectionTitle: string;
  advantageSectionSubtitle: string;
  faqSectionTitle: string;
}

export interface SmallTitleItem {
  id: string;
  orderNumber: number;
  sectionNameAr: string;
  sectionNameEn: string;
  status: boolean;
}

export interface HeroSectionData {
  title: string;
  subtitle: string;
  description: string;
  actionButtonEnabled: boolean;
  actionButtonLabel: string;
  actionButtonUrl: string;
  secondaryActionButtonEnabled: boolean;
  secondaryActionButtonLabel: string;
  secondaryActionButtonUrl: string;
  currentImageName: string;
}

export interface PartnerLogoItem {
  id: string;
  orderNumber: number;
  name: string;
  iconName: string;
  bgColor: string;
  status: boolean;
}

export interface StoryItem {
  id: string;
  orderNumber: number;
  title: string;
  description: string;
  iconName: string;
  status: boolean;
}

export interface UniqueFeatureItem {
  id: string;
  orderNumber: number;
  title: string;
  iconName: string;
  badgeBg: string;
  badgeColor: string;
  status: boolean;
}

export interface FeatureItem {
  id: string;
  orderNumber: number;
  titleAr: string;
  titleEn: string;
  platform: string;
  status: boolean;
}

export interface AIChatData {
  title: string;
  description: string;
  actionButtonLabel: string;
  actionButtonUrl: string;
}

export interface SeoData {
  language: string;
  authorName: string;
  metaTitle: string;
  metaKeywords: string;
  metaImageName: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageName: string;
}
