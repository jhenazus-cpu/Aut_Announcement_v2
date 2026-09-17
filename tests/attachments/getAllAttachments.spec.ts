// importa el módulo de prueba de Playwright
import { test, expect } from "@playwright/test";
import { logApi } from "../../utils/apiLogger";
import { testConfig } from "../../utils/testConfig";

// Importar los tipos de respuesta interfaces
import {
  AttachmentResponse,
} from "../../utils/type";
import { AnnouncementNotFound } from "../../utils/typeById";

// Importar los Scheman de las respuestas
import Ajv from "ajv";
import { getAnnouncementAttachmentsSchema } from "../../utils/schemas/getAnnouncementAttachments.schema";
import { errorSchema } from "../../utils/schemas/error.schema";




test.describe("Attachments API", () => {
  //Casos de prueba para obtener todo los adjuntos

  test("Get all the attachments", async ({ request }) => {
    
    const ajv = new Ajv();
    const validateSchema = ajv.compile(getAnnouncementAttachmentsSchema);

    const response = await request.get(
      `announcements/${testConfig.announcementIdAttachmentId}/attachments?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "GET");
    await expect(response).toBeOK();
    expect(response.headers()["content-type"]).toContain("application/json");

    const attachmentResponse = (await response.json()) as AttachmentResponse;
    
    //Validar la estructura de la respuesta
    expect(validateSchema(attachmentResponse)).toBeTruthy();

  });

  // Caso de prueba para obtener un adjunto por ID que no existe
  test("Get attachments by ID not found", async ({ request }) => {
    
    const ajv = new Ajv();
    const validateSchema = ajv.compile(errorSchema);
    
    const response = await request.get(
      `announcements/${testConfig.notFoundAttachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "GET");
    await expect(response.status()).toBe(404);

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

      
    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.type).toBe("NOT_FOUND");
    expect(AnnouncementNotFound.error.code).toBe("HTTP.NOT_FOUND");
    expect(AnnouncementNotFound.error.message).toBe(
      `Announcement with id '${testConfig.notFoundAttachmentId}' was not found.`,
    );
  });
});
