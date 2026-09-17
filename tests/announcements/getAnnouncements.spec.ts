// importa el módulo de prueba de Playwright
import { test as base, expect, APIRequestContext } from "@playwright/test";
import { logApi } from "../../utils/apiLogger";
import { testConfig } from "../../utils/testConfig";

// Importar los tipos de respuesta interfaces
import { announcementsResponse } from "../../utils/type";
import {
  announcementsResponseById,
  AnnouncementNotFound,
} from "../../utils/typeById";
import { expectedItemFields, test } from "../../utils/tools";

// Importar los Scheman de las respuestas
import Ajv from "ajv";
import { getAllAnnouncementsSchema } from "../../utils/schemas/getAllAnnouncements.schema";
import { getAnnouncementByIdSchema } from "../../utils/schemas/getAnnouncementById.schema";
import { errorSchema } from "../../utils/schemas/error.schema";

// Escenarios de prueba para la API de comunicados
test.describe("Announcements API", () => {
  test("Get all the announcements", async ({ request }) => {
    const ajv = new Ajv();
    const validateSchema = ajv.compile(getAllAnnouncementsSchema);

    const response = await request.get(
      `announcements?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "GET");
    await expect(response).toBeOK();
    const announcementsResponse =
      (await response.json()) as announcementsResponse;

    //Validar la estructura de la respuesta
    expect(validateSchema(announcementsResponse)).toBeTruthy();

    // Verificar que la respuesta contenga los campos esperados
    //expectedItemFields(announcementsResponse);
  });

  test("Get all the announcements by AppliesTo", async ({ request }) => {
    const requestOptions = {
      params: {
        AppliesTo: "2",
      },
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(getAllAnnouncementsSchema);

    const response = await request.get(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "GET");
    await expect(response).toBeOK();
    const announcementsResponse =
      (await response.json()) as announcementsResponse;

    //Validar la estructura de la respuesta
    expect(validateSchema(announcementsResponse)).toBeTruthy();

    // Verificar que la respuesta contenga los campos esperados
    //expectedItemFields(announcementsResponse);
  });

  test("Get all the announcements with multiple filters", async ({
    request,
  }) => {
    const requestOptions = {
      params: {
        AppliesTo: "3",
        CampusScheduleIds: "1",
        ProgramCodes: "P01JPM",
        PeriodIds: "21",
      },
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(getAllAnnouncementsSchema);

    const response = await request.get(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "GET");
    await expect(response).toBeOK();
    const announcementsResponse =
      (await response.json()) as announcementsResponse;

    //Validar la estructura de la respuesta
    expect(validateSchema(announcementsResponse)).toBeTruthy();

    // Verificar que la respuesta contenga los campos esperados
    //expectedItemFields(announcementsResponse);
  });

  // Caso de prueba para obtener los comunicados por ID
  test("Get announcement by ID", async ({ request, createdAnnouncementId }) => {
    const ajv = new Ajv();
    const validateSchema = ajv.compile(getAnnouncementByIdSchema);

    const response = await request.get(
      `announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`,
    );
    await logApi(response, "GET");
    await expect(response).toBeOK();

    const announcementsResponseById =
      (await response.json()) as announcementsResponseById;

    //Validar la estructura de la respuesta
    expect(validateSchema(announcementsResponseById)).toBeTruthy();

    if (announcementsResponseById.data != null) {
      expect.soft(announcementsResponseById.data).toHaveProperty("id");
      //expectSoftPositiveInteger(announcementsResponseById.data.id);
      expect
        .soft(announcementsResponseById.data.id)
        .toBe(createdAnnouncementId);
    } else {
      throw new Error(
        "No announcements found. The test cannot continue. 'Get announcement by ID.'",
      );
    }
  });
  
  // Caso de prueba para obtener los comunicados teniendo en cuenta la información que se manda en PageIndex and PageSize.
  test("Get different ad pages using PageIndex and PageSize.", async ({
    request,
  }) => {
    const requestOptions = {
      params: {
        PageIndex: "0",
        PageSize: "10",
      },
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(getAllAnnouncementsSchema);

    const response = await request.get(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "GET");
    await expect(response).toBeOK();
    const announcementsResponse =
      (await response.json()) as announcementsResponse;

    //Validar la estructura de la respuesta
    expect(validateSchema(announcementsResponse)).toBeTruthy();

    // Verificar que la respuesta contenga los campos esperados
    //expectedItemFields(announcementsResponse);
  });

  // Caso de prueba para obtener los comunicados por fecha de inicio
  test('Should return announcements filtered by startDate', async ({ request }) => {
    
    const requestOptions = {
      params: {
        startDate: "2026-09-08",
        endDate: "2026-09-11",
      },
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(getAllAnnouncementsSchema);

    const response = await request.get(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );

    await logApi(response, "GET");
    await expect(response).toBeOK();

    const announcementsResponse =
      (await response.json()) as announcementsResponse;

    //Validar la estructura de la respuesta
    expect(validateSchema(announcementsResponse)).toBeTruthy();

});


  // Caso de prueba para obtener un comunicado por ID que no existe
  test("Get announcement by ID not found", async ({ request }) => {
    const ajv = new Ajv();
    const validateSchema = ajv.compile(errorSchema);

    const response = await request.get(
      `announcements/${testConfig.notFoundAnnouncementId}?EntityCode=${testConfig.entityCode}`,
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
      `Announcement with id '${testConfig.notFoundAnnouncementId}' was not found.`,
    );
  });
});
