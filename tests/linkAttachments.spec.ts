// importa el módulo de prueba de Playwright
import { test, expect } from "@playwright/test";
import { logApi } from "../utils/apiLogger";
import { testConfig } from "../utils/testConfig";

// Importar los tipos de respuesta interfaces
import { AnnouncementNotFound } from "../utils/typeById";

test.describe("Link Attachments API", () => {
  //Caso de prueba para copiar un adjuno de un comunicado a otro
  test("Should link attachment to announcement successfully", async ({
    request,
  }) => {
    const response = await request.get(
      `announcements/${testConfig.announcementId}/attachments/${testConfig.attachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(200);

    // Validación funcional
    const duplicatedResponse = await request.post(
      `announcements/${testConfig.announcementId}/attachments/${testConfig.attachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    expect(duplicatedResponse.status()).toBe(409);
  });

  // Casos de prueba donde se valida que e adjunto ya se encuentra en el comunicado
  test("Attach link to already existing file announcement", async ({
    request,
  }) => {
    const requestOptions = {
      headers: {
        "X-Entity-Code": testConfig.entityCode,
      },
    };
    const response = await request.post(
      `announcements/${testConfig.announcementId}/attachments/${testConfig.attachementLinkIdExisting}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(409);
    expect(response.headers()["content-type"]).toContain("application/json");

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;
    expect(AnnouncementNotFound.error.type).toBe("CONFLICT");
    expect(AnnouncementNotFound.error.code).toBe("HTTP.CONFLICT");
    expect(AnnouncementNotFound.error.details).toEqual([]);
    expect(AnnouncementNotFound.error.message).toBe(
      `Attachment '${testConfig.attachementLinkIdExisting}' is already attached to Announcement '${testConfig.announcementId}'.`,
    );
    expect(AnnouncementNotFound.statusCode).toBe(409);
  });

  // Caso d eprueba de adjuntar link de adjunto con comunicado inexistente
  test("Link attachment to announcement id not found", async ({ request }) => {
    const response = await request.get(
      `announcements/${testConfig.notFoundAttachmentId}/attachments/${testConfig.attachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(404);
    expect(response.headers()["content-type"]).toContain("application/json");

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;
    expect(AnnouncementNotFound.error.type).toBe("NOT_FOUND");
    expect(AnnouncementNotFound.error.code).toBe("HTTP.NOT_FOUND");
    expect(AnnouncementNotFound.error.message).toBe(
      `Announcement with id '${testConfig.notFoundAttachmentId}' was not found.`,
    );
  });

  // Caso d eprueba de adjuntar link de adjunto con comunicado inexistente
  test("Link attachment id not found to announcement ", async ({ request }) => {
    const response = await request.get(
      `announcements/${testConfig.announcementId}/attachments/${testConfig.notFoundAttachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "POST");
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
