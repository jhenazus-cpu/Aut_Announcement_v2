// importa el módulo de prueba de Playwright
import { test, expect } from "@playwright/test";
import { logApi } from "../../utils/apiLogger";
import { testConfig } from "../../utils/testConfig";

// Importar los tipos de respuesta interfaces
import { AnnouncementNotFound } from "../../utils/typeById";

// Importar los Scheman de las respuestas
import Ajv from "ajv";
import { errorSchema } from "../../utils/schemas/error.schema";

// Importar las funciones
import { linkAttachmentForTest } from "../../utils/tools";

test.describe("Delete Attachments API", () => {
  //Caso de prueba para eliminar un adjunto de un comunicado
  test("Delete announcement attachment", async ({ request }) => {
    await linkAttachmentForTest(request);

    const response = await request.delete(
      `announcements/${testConfig.announcementId}/attachments/${testConfig.attachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "DELETE");
    await expect(response.status()).toBe(204);
  });

  // Casos de prueba para eliminar un adjunto no existene
  test("Delete announcement attachment id not found", async ({ request }) => {
    const ajv = new Ajv();
    const validateSchema = ajv.compile(errorSchema);

    const response = await request.delete(
      `announcements/${testConfig.announcementId}/attachments/${testConfig.notFoundAttachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "DELETE");
    await expect(response.status()).toBe(404);

    expect(response.headers()["content-type"]).toContain("application/json");

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.type).toBe("NOT_FOUND");
    expect(AnnouncementNotFound.error.code).toBe("HTTP.NOT_FOUND");
    expect(AnnouncementNotFound.error.message).toBe(
      `Attachment with id '${testConfig.notFoundAttachmentId}' is not linked to the given announcement.`,
    );
  });
});
