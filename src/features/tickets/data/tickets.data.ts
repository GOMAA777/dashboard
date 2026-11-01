import {
  Ticket,
  TicketDepartment,
  TicketAssignee,
  TicketClient,
} from "../types/tickets.types";

export const initialDepartments: TicketDepartment[] = [
  {
    id: "dep-1",
    code: "DEP-01",
    name: "قسم القضايا العمالية والنزاعات",
    description: "النزاعات الوظيفية، صياغة لوائح العمل، ومحاكم التنفيذ العمالي",
    status: "active",
    activeTicketsCount: 0,
    consultantsCount: 0,
  },
  {
    id: "dep-2",
    code: "DEP-02",
    name: "قسم الشركات والاستشارات التجارية",
    description: "حوكمة الشركات، عمليات الاستحواذ، والاندماجات القانونية",
    status: "active",
    activeTicketsCount: 0,
    consultantsCount: 0,
  },
  {
    id: "dep-3",
    code: "DEP-03",
    name: "قسم الملكية الفكرية وبراءات الاختراع",
    description: "تسجيل العلامات التجارية، حماية الابتكارات، ومكافحة التعديات",
    status: "inactive",
    activeTicketsCount: 0,
    consultantsCount: 0,
  },
  {
    id: "dep-4",
    code: "DEP-04",
    name: "قسم الترافع والتمثيل القضائي",
    description: "المحاكم الإدارية، ديوان المظالم، والاستئناف الجنائي",
    status: "active",
    activeTicketsCount: 0,
    consultantsCount: 0,
  },
  {
    id: "dep-5",
    code: "DEP-05",
    name: "قسم التوثيق والعقود العقارية",
    description: "الإفراغ العقاري، صفقات التطوير، وتوثيق المحررات الرسمية",
    status: "active",
    activeTicketsCount: 0,
    consultantsCount: 0,
  },
  {
    id: "dep-6",
    code: "DEP-06",
    name: "قسم الدعم الفني والربط التقني",
    description: "الدعم التشغيلي، ربط الأنظمة الخارجية، ومزامنة بوابات المحاكم",
    status: "active",
    activeTicketsCount: 0,
    consultantsCount: 0,
  },
];

export const availableAssignees: TicketAssignee[] = [];

export const sampleClients: TicketClient[] = [];

export const initialTickets: Ticket[] = [];
