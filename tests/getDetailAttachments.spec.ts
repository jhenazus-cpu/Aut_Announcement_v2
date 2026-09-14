// importa el módulo de prueba de Playwright
import { test, expect } from "@playwright/test";
import { logApi } from "../utils/apiLogger";
import { testConfig } from "../utils/testConfig";

// Importar los tipos de respuesta interfaces
import { GetDetailsAttachmentResponse } from "../utils/type";
import { AnnouncementNotFound } from "../utils/typeById";
import { validateAttachmentDetailContract } from "../utils/tools";

//Casos de prueba para obtener el detalle de adjunto
test.describe("Get Details Attachments API", () => {
  // Caso de prueba obtener detalle adjunto
  test("Get Announcement Attachment detail", async ({ request }) => {
    const response = await request.get(
      `announcements/${testConfig.announcementIdAttachmentId}/attachments/${testConfig.attachmentIdDetails}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "GET");
    await expect(response).toBeOK();
    expect(response.headers()["content-type"]).toContain("application/json");

    const GetDetailsAttachmentResponse =
      (await response.json()) as GetDetailsAttachmentResponse;

    // Verificar que la respuesta contenga los campos esperados
    validateAttachmentDetailContract(GetDetailsAttachmentResponse);
  });

  //Caso de prueba consultar adjunto no existente
  test("Get Announcement Attachment detail by ID not found", async ({
    request,
  }) => {
    const response = await request.get(
      `announcements/${testConfig.announcementIdAttachmentId}/attachments/${testConfig.notFoundAttachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "GET");
    await expect(response.status()).toBe(404);
    expect(response.headers()["content-type"]).toContain("application/json");

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;
    expect(AnnouncementNotFound.error.type).toBe("NOT_FOUND");
    expect(AnnouncementNotFound.error.code).toBe("HTTP.NOT_FOUND");
    expect(AnnouncementNotFound.error.message).toBe(
      `Attachment with id '${testConfig.notFoundAttachmentId}' was not found.`,
    );
  });
});
