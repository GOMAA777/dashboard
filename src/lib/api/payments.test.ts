import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchPaymentGateways,
  fetchPaymentGateway,
  updatePaymentGateway,
  updatePaymentGatewayStatus,
  testPaymentGateway,
  fetchInvoices,
  fetchInvoiceById,
} from "./payments";
import { mapInvoiceFromApi, mapInvoicesResponse } from "./mappers";
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

describe("09. Payment Gateways & Invoices (طرق الدفع والفوترة) - API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. GET /admin/payment-gateways
  describe("01. fetchPaymentGateways (GET /admin/payment-gateways)", () => {
    it("calls GET /admin/payment-gateways and returns envelope with stats and data", async () => {
      const mockResponse = {
        status: true,
        stats: {
          total_gateways: 5,
          active_gateways: 3,
          security_standard: "PCI-DSS L1 (تشفير بنكي TLS-256 bit)",
          zatca_phase: "المرحلة الثانية (الربط والتكامل)",
        },
        data: [
          {
            id: "stripe",
            code: "stripe",
            name: "Stripe Checkout",
            brand: "stripe",
            status: "active",
            is_enabled: true,
            client_id: "pk_test_stripe_123",
            client_secret: "mock_sec_stripe_456",
          },
        ],
      };

      vi.mocked(http.apiRequest).mockResolvedValueOnce(mockResponse);

      const result = await fetchPaymentGateways();

      expect(http.apiRequest).toHaveBeenCalledWith("/admin/payment-gateways", {
        method: "GET",
      });
      expect(result.status).toBe(true);
      expect(result.stats?.total_gateways).toBe(5);
      expect(result.stats?.active_gateways).toBe(3);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe("stripe");
    });

    it("handles empty data gracefully without throwing", async () => {
      const mockEmptyResponse = {
        status: true,
        stats: {
          total_gateways: 0,
          active_gateways: 0,
        },
        data: [],
      };

      vi.mocked(http.apiRequest).mockResolvedValueOnce(mockEmptyResponse);

      const result = await fetchPaymentGateways();
      expect(result.data).toEqual([]);
      expect(result.stats?.total_gateways).toBe(0);
    });

    it("propagates error on server failure", async () => {
      vi.mocked(http.apiRequest).mockRejectedValueOnce(
        new http.ApiError("Internal Server Error", 500)
      );

      await expect(fetchPaymentGateways()).rejects.toThrow("Internal Server Error");
    });
  });

  // 2. GET /admin/payment-gateways/{gateway}
  describe("02. fetchPaymentGateway (GET /admin/payment-gateways/{gateway})", () => {
    it("calls GET /admin/payment-gateways/stripe with correct path", async () => {
      const mockDetail = {
        status: true,
        data: {
          id: "stripe",
          name: "Stripe Gateway",
          mode: "live",
          client_id: "pk_test_123",
          client_secret: "mock_sec_456",
        },
      };

      vi.mocked(http.apiRequest).mockResolvedValueOnce(mockDetail);

      const result = await fetchPaymentGateway("stripe");

      expect(http.apiRequest).toHaveBeenCalledWith("/admin/payment-gateways/stripe", {
        method: "GET",
      });
      expect(result.status).toBe(true);
      expect(result.data?.id).toBe("stripe");
    });

    it("handles 404 when gateway not found", async () => {
      vi.mocked(http.apiRequest).mockRejectedValueOnce(
        new http.ApiError("بوابة الدفع غير موجودة", 404)
      );

      await expect(fetchPaymentGateway("unknown-gateway")).rejects.toThrow(
        "بوابة الدفع غير موجودة"
      );
    });
  });

  // 3. PUT /admin/payment-gateways/{gateway}
  describe("03. updatePaymentGateway (PUT /admin/payment-gateways/{gateway})", () => {
    it("calls PUT /admin/payment-gateways/stripe with configuration body", async () => {
      const updatePayload = {
        mode: "live",
        is_recurring_supported: true,
        supported_currencies: ["SAR", "USD", "AED"],
        config: {
          publishable_key: "mock_pub_aljudy_demo_2025",
          apple_pay: true,
          mada: true,
        },
      };

      const mockResponse = {
        status: true,
        message: "تم تحديث إعدادات بوابة الدفع بنجاح",
      };

      vi.mocked(http.apiRequest).mockResolvedValueOnce(mockResponse);

      const result = await updatePaymentGateway("stripe", updatePayload);

      expect(http.apiRequest).toHaveBeenCalledWith("/admin/payment-gateways/stripe", {
        method: "PUT",
        body: updatePayload,
      });
      expect(result.status).toBe(true);
      expect(result.message).toBe("تم تحديث إعدادات بوابة الدفع بنجاح");
    });

    it("rejects when invalid credentials provided", async () => {
      vi.mocked(http.apiRequest).mockRejectedValueOnce(
        new http.ApiError("بيانات الاعتماد غير صالحة", 422, {
          errors: { client_id: ["The client_id format is invalid."] },
        })
      );

      await expect(
        updatePaymentGateway("stripe", { client_id: "invalid" })
      ).rejects.toThrow("بيانات الاعتماد غير صالحة");
    });
  });

  // 4. PATCH /admin/payment-gateways/{gateway}/status
  describe("04. updatePaymentGatewayStatus (PATCH /admin/payment-gateways/{gateway}/status)", () => {
    it("calls PATCH /admin/payment-gateways/stripe/status with active status", async () => {
      const mockResponse = {
        status: true,
        message: "تم تفعيل بوابة الدفع بنجاح",
      };

      vi.mocked(http.apiRequest).mockResolvedValueOnce(mockResponse);

      const result = await updatePaymentGatewayStatus("stripe", "active");

      expect(http.apiRequest).toHaveBeenCalledWith(
        "/admin/payment-gateways/stripe/status",
        {
          method: "PATCH",
          body: { status: "active" },
        }
      );
      expect(result.status).toBe(true);
    });

    it("calls PATCH /admin/payment-gateways/stripe/status with inactive status", async () => {
      const mockResponse = {
        status: true,
        message: "تم تعطيل بوابة الدفع بنجاح",
      };

      vi.mocked(http.apiRequest).mockResolvedValueOnce(mockResponse);

      const result = await updatePaymentGatewayStatus("stripe", "inactive");

      expect(http.apiRequest).toHaveBeenCalledWith(
        "/admin/payment-gateways/stripe/status",
        {
          method: "PATCH",
          body: { status: "inactive" },
        }
      );
      expect(result.status).toBe(true);
    });
  });

  // 5. POST /admin/payment-gateways/{gateway}/test
  describe("05. testPaymentGateway (POST /admin/payment-gateways/{gateway}/test)", () => {
    it("calls POST /admin/payment-gateways/stripe/test for Ping Test", async () => {
      const mockResponse = {
        status: true,
        message: "تم فحص الاتصال بالبوابة بنجاح (Ping OK - 100% Operational)",
      };

      vi.mocked(http.apiRequest).mockResolvedValueOnce(mockResponse);

      const result = await testPaymentGateway("stripe");

      expect(http.apiRequest).toHaveBeenCalledWith(
        "/admin/payment-gateways/stripe/test",
        {
          method: "POST",
        }
      );
      expect(result.status).toBe(true);
      expect(result.message).toContain("Ping OK");
    });

    it("handles connection failure", async () => {
      vi.mocked(http.apiRequest).mockRejectedValueOnce(
        new http.ApiError("فشل الاتصال ببوابة الدفع (Connection Timed Out)", 504)
      );

      await expect(testPaymentGateway("stripe")).rejects.toThrow("فشل الاتصال ببوابة الدفع");
    });
  });

  // 6. GET /admin/invoices
  describe("06. fetchInvoices (GET /admin/invoices)", () => {
    it("calls GET /admin/invoices with company_id query parameter", async () => {
      const mockInvoices = {
        status: true,
        data: [
          {
            id: 1,
            invoice_number: "INV-2025-001",
            status: "paid",
            total_amount: 5750,
            tax_amount: 750,
            payment_method: "mada",
            firm: { id: 96, name: "شركة العجلان للمحاماة" },
          },
        ],
      };

      vi.mocked(http.apiRequest).mockResolvedValueOnce(mockInvoices);

      const result = await fetchInvoices({ company_id: 96 });

      expect(http.apiRequest).toHaveBeenCalledWith("/admin/invoices", {
        method: "GET",
        query: {
          company_id: 96,
          page: undefined,
          per_page: undefined,
          search: undefined,
          status: undefined,
        },
      });
      expect(result.status).toBe(true);
    });

    it("maps raw invoices response correctly using mapInvoicesResponse", () => {
      const rawPayload = {
        status: true,
        data: [
          {
            id: 101,
            invoice_number: "INV-2025-101",
            total_amount: 11500,
            status: "paid",
            payment_method: "apple_pay",
            firm: { id: 96, name: "مكتب الرياض للمحاماة" },
          },
        ],
      };

      const mapped = mapInvoicesResponse(rawPayload);
      expect(mapped).toHaveLength(1);
      expect(mapped[0].id).toBe("101");
      expect(mapped[0].invoiceNumber).toBe("INV-2025-101");
      expect(mapped[0].status).toBe("paid");
      expect(mapped[0].paymentMethod).toBe("apple_pay");
      expect(mapped[0].totalAmount).toBe(11500);
      expect(mapped[0].lawFirmName).toBe("مكتب الرياض للمحاماة");
    });

    it("handles 422 error when company_id is invalid or missing", async () => {
      vi.mocked(http.apiRequest).mockRejectedValueOnce(
        new http.ApiError("The selected company id is invalid.", 422, {
          errors: { company_id: ["The selected company id is invalid."] },
        })
      );

      await expect(fetchInvoices({ company_id: 99999 })).rejects.toThrow(
        "The selected company id is invalid."
      );
    });
  });

  // 7. GET /admin/invoices/{id}
  describe("07. fetchInvoiceById (GET /admin/invoices/{id})", () => {
    it("calls GET /admin/invoices/1 with invoice id and company_id", async () => {
      const mockDetail = {
        status: true,
        data: {
          id: 1,
          invoice_number: "INV-2025-001",
          status: "paid",
          total_amount: 5750,
          subtotal: 5000,
          tax_amount: 750,
          payment_method: "visa",
          transaction_reference: "TXN-987654",
          firm: {
            id: 96,
            name: "مكتب المحامي محمد",
            email: "mohamed@law.sa",
            phone: "+966501234567",
          },
        },
      };

      vi.mocked(http.apiRequest).mockResolvedValueOnce(mockDetail);

      const result = await fetchInvoiceById(1, 96);

      expect(http.apiRequest).toHaveBeenCalledWith("/admin/invoices/1", {
        method: "GET",
        query: {
          company_id: 96,
        },
      });
      expect(result.status).toBe(true);
      expect(result.data.invoice_number).toBe("INV-2025-001");
    });

    it("maps single invoice detail correctly via mapInvoiceFromApi", () => {
      const rawDetail = {
        id: 55,
        invoice_number: "INV-ZATCA-55",
        status: "overdue",
        total: 2300,
        tax_amount: 300,
        subtotal: 2000,
        gateway: "mastercard",
        firm: { id: 88, name: "شركة النخبة القانونية" },
      };

      const mapped = mapInvoiceFromApi(rawDetail);
      expect(mapped.id).toBe("55");
      expect(mapped.invoiceNumber).toBe("INV-ZATCA-55");
      expect(mapped.status).toBe("overdue");
      expect(mapped.paymentMethod).toBe("mastercard");
      expect(mapped.totalAmount).toBe(2300);
      expect(mapped.taxAmount).toBe(300);
      expect(mapped.subtotal).toBe(2000);
      expect(mapped.lawFirmName).toBe("شركة النخبة القانونية");
    });

    it("handles 404 when invoice not found", async () => {
      vi.mocked(http.apiRequest).mockRejectedValueOnce(
        new http.ApiError("Invoice not found", 404)
      );

      await expect(fetchInvoiceById(999, 96)).rejects.toThrow("Invoice not found");
    });
  });
});
