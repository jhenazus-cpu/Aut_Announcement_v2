// importa el módulo de prueba de Playwright
import { test, expect } from "@playwright/test";
import { logApi } from "../utils/apiLogger";
import { testConfig } from "../utils/testConfig";

// Importar los tipos de respuesta interfaces
import {
  AttachmentResponse,
} from "../utils/type";
import { AnnouncementNotFound } from "../utils/typeById";



test.describe("Attachments API", () => {
  //Casos de prueba para obtener todo los adjuntos

  test("Get all the attachments", async ({ request }) => {

    const response = await request.get(
      `announcements/${testConfig.announcementIdAttachmentId}/attachments?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "GET");
    await expect(response).toBeOK();
    expect(response.headers()["content-type"]).toContain("application/json");

    const attachmentResponse = (await response.json()) as AttachmentResponse;
    
    // Validar la raiz de la respuesta
    expect(attachmentResponse).toMatchObject({
      data: {
        items: expect.any(Array),
        totalCount: expect.any(Number),
      },
      statusCode: expect.any(Number),
    });

    //Validar todos los elementos del array
    attachmentResponse.data.items.forEach((attachment) => {
      expect(attachmentResponse.data.items[0]).toMatchObject({
        id: expect.any(Number),
        fileName: expect.any(String),
        filePath: expect.any(String),
        sizeInBytes: expect.any(Number),
        contentType: expect.any(String),
        extension: expect.any(String),
        uploadedAt: expect.any(String),
        embedded: expect.any(Boolean),
      });

      expect(attachment).toHaveProperty("thumbnailPath");
      expect(
        attachment.thumbnailPath === null ||
          typeof attachment.thumbnailPath === "string",
      ).toBe(true);
      expect(attachment).toHaveProperty("categoryCode");
      expect(
        attachment.categoryCode === null ||
          typeof attachment.categoryCode === "string",
      ).toBe(true);
      expect(attachment).toHaveProperty("referenceCode");
      expect(
        attachment.referenceCode === null ||
          typeof attachment.referenceCode === "string",
      ).toBe(true);
      expect(attachment).toHaveProperty("metadata");
      expect(
        attachment.metadata === null || typeof attachment.metadata === "string",
      ).toBe(true);
    });
  });

  // Caso de prueba para obtener un adjunto por ID que no existe
  test("Get attachments by ID not found", async ({ request }) => {
    const response = await request.get(
      `announcements/${testConfig.notFoundAttachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "GET");
    await expect(response.status()).toBe(404);

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;
    expect(AnnouncementNotFound.error.type).toBe("NOT_FOUND");
    expect(AnnouncementNotFound.error.code).toBe("HTTP.NOT_FOUND");
    expect(AnnouncementNotFound.error.message).toBe(
      `Announcement with id '${testConfig.notFoundAttachmentId}' was not found.`,
    );
  });
});
