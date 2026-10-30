import {
  MenuItem,
  UseCaseItem,
  NavMoreItem,
  SectionTitlesData,
  SmallTitleItem,
  HeroSectionData,
  PartnerLogoItem,
  StoryItem,
  UniqueFeatureItem,
  FeatureItem,
  AIChatData,
  SeoData,
} from "../types/website-settings.types";

export const initialMenuItems: MenuItem[] = [
  { id: "1", label: "Home", url: "/" },
  { id: "2", label: "Price", url: "#pricing" },
  { id: "3", label: "Features", url: "#features" },
];

export const initialUseCases: UseCaseItem[] = [
  { id: "1", orderNumber: 1, title: "Retargeting", description: "Retarget your existing customers", status: true },
  { id: "2", orderNumber: 2, title: "Founders", description: "Reach more people & create awareness", status: true },
  { id: "3", orderNumber: 3, title: "Influencers", description: "Build strong community and sale", status: true },
  { id: "4", orderNumber: 4, title: "Ecommerce stores", description: "Scale sales by mass marketing", status: true },
  { id: "5", orderNumber: 5, title: "Youtubers", description: "Increase your video views", status: true },
  { id: "6", orderNumber: 6, title: "Digital sellers", description: "Sell any digital goods", status: true },
  { id: "7", orderNumber: 7, title: "Facebook sellers", description: "Retarget your facfbook customer", status: true },
  { id: "8", orderNumber: 8, title: "SME", description: "Reach out & start getting first customers", status: true },
  { id: "9", orderNumber: 9, title: "Enterprises", description: "Mass marketing and grow on scale", status: true },
  { id: "10", orderNumber: 10, title: "Marketers", description: "Run marketing campaigns for your agency", status: true },
];

export const initialNavMoreItems: NavMoreItem[] = [
  {
    id: "1",
    orderNumber: 1,
    titleAr: "المميزات",
    titleEn: "Features",
    descriptionAr: "كافة المزايا والخصائص اللازمة للنمو والتطوير",
    descriptionEn: "All the features you need to grow",
    status: true,
  },
  {
    id: "2",
    orderNumber: 2,
    titleAr: "الأسئلة الشائعة",
    titleEn: "FAQ",
    descriptionAr: "الأسئلة المتكررة وإجاباتها الفورية",
    descriptionEn: "Frequently Asked Questions",
    status: true,
  },
  {
    id: "3",
    orderNumber: 3,
    titleAr: "التوثيق والدليل",
    titleEn: "Documentations",
    descriptionAr: "ابدأ رحلتك مع المنصة بخطوات واضحة وتفاعلية",
    descriptionEn: "Get started with SaleBot",
    status: true,
  },
  {
    id: "4",
    orderNumber: 4,
    titleAr: "المدونة",
    titleEn: "Blogs",
    descriptionAr: "أحدث المقالات والرؤى المعرفية للنمو القانوني والمهني",
    descriptionEn: "All the features you need to grow",
    status: true,
  },
  {
    id: "5",
    orderNumber: 5,
    titleAr: "خارطة الطريق",
    titleEn: "Roadmaps",
    descriptionAr: "استكشف المزايا والمراحل القادمة للتطبيق",
    descriptionEn: "Check your upcoming features",
    status: true,
  },
  {
    id: "6",
    orderNumber: 6,
    titleAr: "التحديثات القادمة",
    titleEn: "Upcoming Updates",
    descriptionAr: "تعرف على أحدث الخدمات والإمكانيات المستقبلية المخططة",
    descriptionEn: "Let's find out future facilities",
    status: true,
  },
  {
    id: "7",
    orderNumber: 7,
    titleAr: "المجتمع والنقاشات",
    titleEn: "Community",
    descriptionAr: "تواصل مع نخبة المهنيين وشبكة الأعمال الكبرى",
    descriptionEn: "Connect with big network",
    status: true,
  },
];

export const initialSectionTitles: SectionTitlesData = {
  partnerSectionTitle: "موثوق به من قبل رواد الأعمال والشركات التي تنمو معك",
  storySectionTitle: "مع خبراتنا الذكية للتسويق عبر واتساب",
  storySectionSubtitle: "اجعل تواصلك مع عملائك أسهل وأسرع وأكثر أماناً",
  uniqueFeatureSectionTitle: "ميزاتنا الاستثنائية والفريدة (Our Unique Features)",
  featureSectionTitle: "مرحباً بكم في الحلول الذكية للتسويق وإدارة القضايا",
  featureSectionSubtitle: "أدوات متطورة تساعدك على إدارة أعمالك القانونية والتسويقية بكل سهولة ويسر مع أتمتة دقيقة لكافة الإجراءات.",
  testimonialSectionTitle: "آراء وانطباعات شركاء النجاح (Testimonial Section Title)",
  testimonialSectionSubtitle: "تعرف على تجارب عملائنا وكيف ساهمت المنصة في تحسين أعمالهم",
  pricingSectionTitle: "باقات وأسعار مرنة ومناسبة للجميع (For Everyone)",
  pricingSectionSubtitle: "أسعار واضحة وباقات مدروسة بدون أي رسوم خفية",
  advantageSectionTitle: "لماذا تختار منصة الجودي لمنشأتك القانونية؟",
  advantageSectionSubtitle: "أعلى معايير الأمان والامتثال والسرعة لضمان أفضل تجربة عمل قانونية متكاملة",
  faqSectionTitle: "الأسئلة الأكثر شيوعاً وإجاباتها الفورية",
};

export const initialSmallTitles: SmallTitleItem[] = [
  { id: "1", orderNumber: 1, sectionNameAr: "قسم الهيرو", sectionNameEn: "Hero Section", status: true },
  { id: "2", orderNumber: 2, sectionNameAr: "قسم المميزات", sectionNameEn: "Features Section", status: false },
  { id: "3", orderNumber: 3, sectionNameAr: "قسم المزايا التنافسية", sectionNameEn: "Advantages Section", status: false },
  { id: "4", orderNumber: 4, sectionNameAr: "قسم مسار المحادثة الذكية", sectionNameEn: "Chat Flow Section", status: false },
  { id: "5", orderNumber: 5, sectionNameAr: "قسم الباقات والأسعار", sectionNameEn: "Pricing Section", status: false },
  { id: "6", orderNumber: 6, sectionNameAr: "قسم الأسئلة الشائعة", sectionNameEn: "FAQ Section", status: false },
];

export const initialHeroSection: HeroSectionData = {
  title: "التسويق الفوري عبر واتساب لعملك",
  subtitle: "تمتع بتواصل مباشر وسريع مع عملائك عبر واتساب، وحقق أقصى تأثير لحملاتك التسويقية بفعالية واحترافية.",
  description: "تمتع بتواصل مباشر وسريع مع عملائك عبر واتساب، وحقق أقصى تأثير لحملاتك التسويقية بفعالية واحترافية.",
  actionButtonEnabled: true,
  actionButtonLabel: "ابدأ الآن",
  actionButtonUrl: "#",
  secondaryActionButtonEnabled: false,
  secondaryActionButtonLabel: "",
  secondaryActionButtonUrl: "",
  currentImageName: "campaign3d.png",
};

export const initialPartnerLogos: PartnerLogoItem[] = [
  { id: "1", orderNumber: 1, name: "1", iconName: "globe", bgColor: "#2e1065", status: true },
  { id: "2", orderNumber: 2, name: "2", iconName: "zap", bgColor: "#064e3b", status: true },
  { id: "3", orderNumber: 3, name: "3", iconName: "landmark", bgColor: "#fef3c7", status: true },
  { id: "4", orderNumber: 4, name: "4", iconName: "crown", bgColor: "#fef3c7", status: true },
  { id: "5", orderNumber: 5, name: "5", iconName: "download", bgColor: "#18181b", status: true },
  { id: "6", orderNumber: 6, name: "6", iconName: "gavel", bgColor: "#78350f", status: true },
  { id: "7", orderNumber: 7, name: "7", iconName: "scale", bgColor: "#fffbeb", status: true },
  { id: "8", orderNumber: 8, name: "8", iconName: "shield", bgColor: "#0f172a", status: true },
];

export const initialStories: StoryItem[] = [
  {
    id: "1",
    orderNumber: 1,
    title: "التواصل السريع والمباشر",
    description: "أرسل رسائلك إلى عملائك دون تأخير، بضغطة واحدة",
    iconName: "clock",
    status: true,
  },
  {
    id: "2",
    orderNumber: 2,
    title: "الأمان والخصوصية",
    description: "منصة آمنة بالكامل لحماية بياناتك وبيانات عملائك",
    iconName: "shield",
    status: true,
  },
  {
    id: "3",
    orderNumber: 3,
    title: "تحليل الأداء",
    description: "احصل على تقارير فورية حول نتائج حملاتك ومستوى تفاعل عملائك",
    iconName: "bar-chart",
    status: true,
  },
  {
    id: "4",
    orderNumber: 4,
    title: "إدارة الحملات الترويجية",
    description: "نظام سهل الاستخدام يسمح لك بتخصيص رسائلك وجدولة إرسالها",
    iconName: "megaphone",
    status: true,
  },
];

export const initialUniqueFeatures: UniqueFeatureItem[] = [
  {
    id: "1",
    orderNumber: 1,
    title: "إنشاء وإرسال الإشعارات",
    iconName: "send",
    badgeBg: "#e6fffa",
    badgeColor: "#0d9488",
    status: true,
  },
  {
    id: "2",
    orderNumber: 2,
    title: "إضافة أو إستيراد جهات الاتصال",
    iconName: "user",
    badgeBg: "#eff6ff",
    badgeColor: "#2563eb",
    status: true,
  },
  {
    id: "3",
    orderNumber: 3,
    title: "إنشاء قالب رسالة",
    iconName: "file-text",
    badgeBg: "#fefce8",
    badgeColor: "#ca8a04",
    status: true,
  },
  {
    id: "4",
    orderNumber: 4,
    title: "إعداد رقم هاتفك",
    iconName: "smartphone",
    badgeBg: "#faf5ff",
    badgeColor: "#9333ea",
    status: true,
  },
];

export const initialFeatures: FeatureItem[] = [
  {
    id: "1",
    orderNumber: 1,
    titleAr: "من نحن",
    titleEn: "About Us Feature Section",
    platform: "WhatsApp",
    status: true,
  },
];

export const initialAIChat: AIChatData = {
  title: "Test the AI Chat System",
  description:
    "Scan the QR code or click on the button and it will open your whatsapp or telegram. Then start a chat with the bot.",
  actionButtonLabel: "Get Started Now",
  actionButtonUrl: "#",
};

export const initialSeo: SeoData = {
  language: "English",
  authorName: "منصة الجودي للأنظمة القانونية | Al Judy Legal SaaS",
  metaTitle: "الجودي | المنظومة السحابية الرائدة لإدارة مكاتب المحاماة والشركات القانونية",
  metaKeywords: "محاماة، إدارة مكاتب المحاماة، استشارات قانونية، قضايا، نظام الجودي ، عقود ذكية",
  metaImageName: "aljudy-seo-meta-banner-1200x630.png",
  metaDescription:
    "نظام الجودي السحابي هو الحل التقني الأكثر تطوراً للمحامين والشركات القانونية في المملكة العربية السعودية والخليج. يدير القضايا، المواعيد، الجلسات، الفواتير الإلكترونية، والمستندات بأعلى معايير الأمان والامتثال للأنظمة العدلية.",
  ogTitle: "منصة الجودي | النظام الرقمي الأذكى لإدارة مكاتب المحاماة",
  ogDescription: "انضم إلى نخبة مكاتب المحاماة الرائدة في إدارة القضايا والعملاء والعقود عبر منصة سحابية واحدة بمعايير أمان بنكية.",
  ogImageName: "",
};
