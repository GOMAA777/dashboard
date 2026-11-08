import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchTicketsStats,
  fetchTickets,
  createTicket,
  fetchTicketById,
  replyTicket,
  assignTicket,
  updateTicketStatus,
  closeTicket,
} from "./tickets";
import { mapTicketFromApi, mapTicketsResponse } from "./mappers";
import * as http from "./http";

vi.mock("./http", () => ({
  apiRequest: vi.fn(),
  ApiError: class ApiError extends Error {
    status?: number;
    body?: unknown;
    constructor(message: string, status?: number, body?: unknown) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.body = body;
    }
  },
}));

describe("08. Support Tickets (تذاكر الدعم الفني) - API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Stats
  it("01. fetchTicketsStats calls GET /admin/tickets/stats", async () => {
    const mockEnvelope = {
      status: true,
      data: {
        open: 12,
        in_progress: 8,
        pending: 3,
        closed: 45,
        satisfaction_rate: 96,
      },
    };
    vi.mocked(http.apiRequest).mockResolvedValueOnce(mockEnvelope);

    const result = await fetchTicketsStats();
    expect(http.apiRequest).toHaveBeenCalledWith("/admin/tickets/stats", {
      method: "GET",
    });
    expect(result).toEqual(mockEnvelope);
  });

  // 2. List & Filters
  it("02. fetchTickets calls GET /admin/tickets with filters and pagination", async () => {
    const mockListResponse = {
      status: true,
      data: [
        {
          id: 1,
          ticket_number: "#TCK-2024-001",
          subject: "تعطل مزامنة صك حكم قضائي",
          status: "open",
          priority: "urgent",
        },
      ],
    };
    vi.mocked(http.apiRequest).mockResolvedValueOnce(mockListResponse);

    const result = await fetchTickets({
      status: "open",
      priority: "urgent",
      search: "مزامنة",
      page: 1,
      per_page: 10,
    });

    expect(http.apiRequest).toHaveBeenCalledWith("/admin/tickets", {
      method: "GET",
      query: {
        status: "open",
        priority: "urgent",
        search: "مزامنة",
        page: 1,
        per_page: 10,
      },
    });
    expect(result).toEqual(mockListResponse);
  });

  it("02. fetchTickets handles empty response gracefully", async () => {
    vi.mocked(http.apiRequest).mockResolvedValueOnce({
      status: true,
      data: [],
    });

    const result = await fetchTickets();
    expect(result).toEqual({ status: true, data: [] });
  });

  // 3. Create Ticket
  it("03. createTicket calls POST /admin/tickets with exact payload", async () => {
    const payload = {
      company_id: 1,
      subject: "تعذر مزامنة صك حكم قضائي من بوابة ناجز التابعة لوزارة العدل",
      description: "توقف استرجاع الجلسات والبيانات الصادرة من محكمة الاستئناف التجارية بالرياض عند الساعة 10:00 ص.",
      department_id: 6,
      priority: "urgent" as const,
      channel: "portal" as const,
    };

    const mockCreated = {
      status: true,
      message: "Ticket created successfully",
      data: {
        id: 101,
        ticket_number: "#TCK-2024-101",
        subject: payload.subject,
        status: "open",
      },
    };
    vi.mocked(http.apiRequest).mockResolvedValueOnce(mockCreated);

    const result = await createTicket(payload);

    expect(http.apiRequest).toHaveBeenCalledWith("/admin/tickets", {
      method: "POST",
      body: payload,
    });
    expect(result).toEqual(mockCreated);
  });

  it("03. createTicket propagates 422 validation errors", async () => {
    const errorBody = {
      message: "The given data was invalid.",
      errors: {
        subject: ["حقل الموضوع مطلوب"],
        department_id: ["القسم المحدد غير موجود"],
      },
    };
    vi.mocked(http.apiRequest).mockRejectedValueOnce(
      new http.ApiError("Validation error", 422, errorBody)
    );

    await expect(
      createTicket({
        company_id: 1,
        subject: "",
        description: "وصف",
        department_id: 999,
        priority: "urgent",
      })
    ).rejects.toThrow("Validation error");
  });

  // 4. Ticket Details
  it("04. fetchTicketById calls GET /admin/tickets/:id", async () => {
    const mockDetail = {
      status: true,
      data: {
        id: 52,
        ticket_number: "#TCK-2024-052",
        subject: "مشكلة تسجيل الدخول لمكتب الشمري",
        description: "تفاصيل المشكلة",
        status: "in_progress",
        priority: "medium",
        messages: [
          {
            id: 1,
            sender_name: "م. عبد العزيز",
            message: "جاري الفحص",
            is_staff: true,
          },
        ],
      },
    };
    vi.mocked(http.apiRequest).mockResolvedValueOnce(mockDetail);

    const result = await fetchTicketById(52);

    expect(http.apiRequest).toHaveBeenCalledWith("/admin/tickets/52", {
      method: "GET",
    });
    expect(result).toEqual(mockDetail);
  });

  // 5. Reply to client
  it("05. replyTicket sends public reply with client notification", async () => {
    const replyPayload = {
      message: "تم التواصل مع فريق الربط التقني بوزارة العدل وتم تحديث مفاتيح الـ SSL وباتت المزامنة تعمل بنجاح الآن.",
      is_internal_note: false,
      notify_client_sms_email: true,
    };
    vi.mocked(http.apiRequest).mockResolvedValueOnce({
      status: true,
      message: "Reply sent successfully",
    });

    const result = await replyTicket(52, replyPayload);

    expect(http.apiRequest).toHaveBeenCalledWith("/admin/tickets/52/reply", {
      method: "POST",
      body: replyPayload,
    });
    expect(result).toEqual({ status: true, message: "Reply sent successfully" });
  });

  // 6. Internal Note
  it("06. replyTicket sends private internal note for technical team only", async () => {
    const notePayload = {
      message: "ملاحظة خاصة: الخلل كان بسبب انتهاء التوكن المؤقت لبوابة ناجز، قمنا بتجديد الاتصال يدوياً.",
      is_internal_note: true,
    };
    vi.mocked(http.apiRequest).mockResolvedValueOnce({
      status: true,
      message: "Internal note saved",
    });

    const result = await replyTicket(52, notePayload);

    expect(http.apiRequest).toHaveBeenCalledWith("/admin/tickets/52/reply", {
      method: "POST",
      body: notePayload,
    });
    expect(result).toEqual({ status: true, message: "Internal note saved" });
  });

  // 7. Assign Ticket
  it("07. assignTicket calls POST /admin/tickets/:id/assign with staff_id and reason", async () => {
    const assignPayload = {
      staff_id: 2,
      reason: "اختصاص تكامل واجهات ناجز",
    };
    vi.mocked(http.apiRequest).mockResolvedValueOnce({
      status: true,
      message: "Ticket assigned successfully",
    });

    const result = await assignTicket(52, assignPayload);

    expect(http.apiRequest).toHaveBeenCalledWith("/admin/tickets/52/assign", {
      method: "POST",
      body: assignPayload,
    });
    expect(result).toEqual({ status: true, message: "Ticket assigned successfully" });
  });

  // 8. Update Ticket Status
  it("08. updateTicketStatus calls PATCH /admin/tickets/:id/status", async () => {
    const statusPayload = {
      status: "in_progress" as const,
    };
    vi.mocked(http.apiRequest).mockResolvedValueOnce({
      status: true,
      message: "Status updated successfully",
    });

    const result = await updateTicketStatus(52, statusPayload);

    expect(http.apiRequest).toHaveBeenCalledWith("/admin/tickets/52/status", {
      method: "PATCH",
      body: statusPayload,
    });
    expect(result).toEqual({ status: true, message: "Status updated successfully" });
  });

  // 9. Close Ticket
  it("09. closeTicket calls POST /admin/tickets/:id/close", async () => {
    vi.mocked(http.apiRequest).mockResolvedValueOnce({
      status: true,
      message: "Ticket closed successfully",
    });

    const result = await closeTicket(52);

    expect(http.apiRequest).toHaveBeenCalledWith("/admin/tickets/52/close", {
      method: "POST",
    });
    expect(result).toEqual({ status: true, message: "Ticket closed successfully" });
  });

  // 10. Mapper verification
  describe("mapTicketFromApi & mapTicketsResponse", () => {
    it("maps raw API response to Ticket domain model properly", () => {
      const rawApi = {
        id: 77,
        ticket_number: "#TCK-2024-8842",
        subject: "مشكلة تكامل بوابة ناجز",
        description: "تعطل مزامنة الجلسات",
        status: "in_progress",
        priority: "urgent",
        channel: "portal",
        created_at: "2024-11-01 10:00:00",
        updated_at: "2024-11-01 11:30:00",
        client: {
          id: 12,
          name: "عبدالله الشمري",
          firm_name: "مكتب دار العدالة للمحاماة",
          email: "law@dar-aladala.sa",
          phone: "+966501234567",
          cr_number: "1010884920",
        },
        department: {
          id: 6,
          name: "قسم الدعم الفني والربط التقني",
          code: "DEP-06",
        },
        assignee: {
          id: 2,
          name: "م. خالد السبيعي",
          role: "مهندس ربط تقني أول",
          department: "قسم الدعم الفني",
          active_tickets: 4,
        },
        messages: [
          {
            id: 1,
            sender_name: "عبدالله الشمري",
            message: "توقف المزامنة تماماً",
            is_staff: false,
            created_at: "10:05 ص",
          },
          {
            id: 2,
            sender_name: "م. خالد السبيعي",
            message: "تم تحديث التوكن وجاري الاختبار",
            is_staff: true,
            is_internal_note: true,
            created_at: "10:20 ص",
          },
        ],
        audit_events: [
          {
            id: 1,
            action: "تم إنشاء التذكرة",
            performer: "بوابة ناجز",
            created_at: "10:00 ص",
          },
        ],
        attachments: [
          {
            id: 1,
            name: "error_log.json",
            size: "12 KB",
            type: "json",
          },
        ],
      };

      const ticket = mapTicketFromApi(rawApi);

      expect(ticket.id).toBe("77");
      expect(ticket.ticketNumber).toBe("#TCK-2024-8842");
      expect(ticket.title).toBe("مشكلة تكامل بوابة ناجز");
      expect(ticket.description).toBe("تعطل مزامنة الجلسات");
      expect(ticket.status).toBe("in_progress");
      expect(ticket.priority).toBe("urgent");
      expect(ticket.channel).toBe("portal");
      expect(ticket.channelLabel).toBe("بوابة العملاء (ناجز)");
      expect(ticket.client.firm).toBe("مكتب دار العدالة للمحاماة");
      expect(ticket.client.name).toBe("عبدالله الشمري");
      expect(ticket.department.code).toBe("DEP-06");
      expect(ticket.assignee.name).toBe("م. خالد السبيعي");
      expect(ticket.messages).toHaveLength(2);
      expect(ticket.messages[1].isInternalNote).toBe(true);
      expect(ticket.auditEvents).toHaveLength(1);
      expect(ticket.attachments).toHaveLength(1);
    });

    it("mapTicketsResponse unwraps paginated list properly", () => {
      const payload = {
        data: [
          { id: 1, subject: "تذكرة 1", status: "open", priority: "low" },
          { id: 2, subject: "تذكرة 2", status: "closed", priority: "medium" },
        ],
      };
      const tickets = mapTicketsResponse(payload);
      expect(tickets).toHaveLength(2);
      expect(tickets[0].title).toBe("تذكرة 1");
      expect(tickets[0].status).toBe("open");
      expect(tickets[1].title).toBe("تذكرة 2");
      expect(tickets[1].status).toBe("closed");
    });
  });
});
