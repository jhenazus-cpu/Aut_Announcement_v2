// importa el módulo de prueba de Playwright
import { test, expect } from "@playwright/test";
import { logApi } from "../utils/apiLogger";
import { testConfig } from "../utils/testConfig";

// Importar los tipos de respuesta interfaces
import { AnnouncementNotFound } from "../utils/typeById";

test.describe("Delete Attachments API", () => {
  //Caso de prueba para eliminar un adjunto de un comunicado
  test('Delete announcement attachment', async ({request}) => {
        const response = await request.delete(
        `announcements/${testConfig.announcementId}/attachments/${testConfig.attachmentId}?EntityCode=${testConfig.entityCode}`
        );
        if (response.status()=== 404){
          throw new Error(
            "No attachment found. The test cannot continue.'Delete announcement attachment'",
          );
        }
        await logApi(response, "DELETE");
        await expect(response).toBeOK();
    });

  // Casos de prueba para eliminar un adjunto no existene
  test("Delete announcement attachment id not found", async ({ request }) => {
    const response = await request.delete(
      `announcements/${testConfig.announcementId}/attachments/${testConfig.notFoundAttachmentId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "DELETE");
    await expect(response.status()).toBe(404);

    expect(response.headers()["content-type"]).toContain("application/json");

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;
    expect(AnnouncementNotFound.error.type).toBe("NOT_FOUND");
    expect(AnnouncementNotFound.error.code).toBe("HTTP.NOT_FOUND");
    expect(AnnouncementNotFound.error.message).toBe(
      `Attachment with id '${testConfig.notFoundAttachmentId}' is not linked to the given announcement.`,
    );
  });
});
