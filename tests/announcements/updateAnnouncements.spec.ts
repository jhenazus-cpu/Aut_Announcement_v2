// importa el módulo de prueba de Playwright
import { test as base, expect, APIRequestContext } from "@playwright/test";
import { logApi } from "../../utils/apiLogger";
import { testConfig } from "../../utils/testConfig";

// Importar los tipos de respuesta interfaces
import { UpdateAnnouncementResponse } from "../../utils/type";
import { AnnouncementNotFound } from "../../utils/typeById";
import { test } from "../../utils/tools";

// Importar los payloads de prueba
import {
  updateAnnouncement,
  updateAnnouncementWithoutAppliesTo,
  updateAnnouncementWithoutValueAppliesTo,
} from "@update/updateAnnouncementPayloads";

// Importar los Scheman de las respuestas
import Ajv from "ajv";
import { errorSchema } from "../../utils/schemas/error.schema";
import { updateAnnouncementSchema } from "../../utils/schemas/updateAnnouncement.schema";
import { validationErrorSchema } from "../../utils/schemas/validationError.schema";

// Escenarios de prueba para la API de comunicados
test.describe("Update Announcements API", () => {
  //Modificar información de un comunicado existente
  test("Update announcement", async ({ request, createdAnnouncementId }) => {
    const requestOptions = {
      data: updateAnnouncement,
    };
    
    const ajv = new Ajv();
    const validateSchema = ajv.compile(updateAnnouncementSchema);

    const response = await request.put(
      `announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "PUT");
    await expect(response).toBeOK();
    const updateAnnouncementResponse =
      (await response.json()) as UpdateAnnouncementResponse;

    expect.soft(updateAnnouncementResponse.data.id).toBe(createdAnnouncementId);

    //Validar la estructura de la respuesta
    expect(validateSchema(updateAnnouncementResponse)).toBeTruthy();
  });

  //Modificar información de un comunicado existente sin enviar appliesTo en el body de la solicitud
  test("Update announcement without appliesTo", async ({
    request,
    createdAnnouncementId,
  }) => {
    const requestOptions = {
      data: updateAnnouncementWithoutAppliesTo,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(validationErrorSchema);

    const response = await request.put(
      `announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "PUT");
    await expect(response.status()).toBe(400);

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("appliesTo");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "The AppliesTo field is required.",
    );
  });

  //Modificar información de un comunicado existente sin enviar el valor en appliesTo en el body de la solicitud
  test("Update announcement without value for appliesTo", async ({
    request,
    createdAnnouncementId,
  }) => {
    const requestOptions = {
      data: updateAnnouncementWithoutValueAppliesTo,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(validationErrorSchema);

    const response = await request.put(
      `announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "PUT");
    await expect(response.status()).toBe(400);

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("appliesTo");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "AppliesTo must contain at least one value.",
    );
  });

    //Modificar información de un comunicado no existente
  test("Update announcement id not found", async ({
    request,
  }) => {
    const requestOptions = {
        data: updateAnnouncement,
    };

    const ajv = new Ajv();
      const validateSchema = ajv.compile(errorSchema);

    const response = await request.put(
        `announcements/${testConfig.notFoundAnnouncementId}?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "PUT");
      await expect(response.status()).toBe(404);
      expect(response.headers()["content-type"]).toContain("application/json");

    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

      expect(AnnouncementNotFound.error.type).toBe("NOT_FOUND");
      expect(AnnouncementNotFound.error.code).toBe("HTTP.NOT_FOUND");
      expect(AnnouncementNotFound.error.message).toBe(
        `Announcement with id '${testConfig.notFoundAnnouncementId}' was not found.`,
    );
  });
});
