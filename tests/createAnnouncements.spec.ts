// importa el módulo de prueba de Playwright
import { test as base, expect, APIRequestContext } from "@playwright/test";
import { logApi } from "../utils/apiLogger";
import { testConfig } from "../utils/testConfig";

// Importar los tipos de respuesta interfaces
import { createAnnouncementsResponse } from "../utils/type";
import { AnnouncementNotFound } from "../utils/typeById";
import { test } from "../utils/tools";

import Ajv from "ajv";
import { createAnnouncementSchema } from "../utils/schemas/createAnnouncement.schema";
import { validationErrorSchema } from "../utils/schemas/validationError.schema";
import { domainValidationErrorSchema } from "../utils/schemas/domainValidationError.schema";

// Importar los payloads de prueba

import {
  createAnnouncement,
  createAnnouncementWithPastDate,
  createAnnouncementWithoutAppliesTo,
  createAnnouncementWithoutProgramId,
  createAnnouncementWithoutName,
  createAnnouncementWithoutDescription,
  createAnnouncementWithGradeIdNull,
  createAnnouncementWithInvalidIsActive,
  createAnnouncementWithoutNameAndDescription,
  createAnnouncementWithIncorrectPublicationDates,
  createAnnouncementWithInactiveProgram,
} from "@create/createAnnouncementPayloads";

// Escenarios de prueba para la API de comunicados
test.describe("Create Announcements API", () => {
  // Caso de prueba para crear un nuevo comunicado
  test("Create announcement", async ({ request }) => {
    const requestOptions = {
      data: createAnnouncement,
    };
    const ajv = new Ajv();
    const validateSchema = ajv.compile(createAnnouncementSchema);
    let createdAnnouncementId: number | undefined;

    try {
      const response = await request.post(
        `announcements?EntityCode=${testConfig.entityCode}`,
        requestOptions,
      );
      await logApi(response, "POST");
      await expect(response.status()).toBe(201);
      const createAnnouncementsResponse =
        (await response.json()) as createAnnouncementsResponse;
      createdAnnouncementId = createAnnouncementsResponse.data.id;

      //Validar la estructura de la respuesta
      expect(validateSchema(createAnnouncementsResponse)).toBeTruthy();
    } finally {
      if (createdAnnouncementId !== undefined) {
        const deleteResponse = await request.delete(
          `announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`,
        );
        await logApi(deleteResponse, "DELETE");
        await expect(deleteResponse.status()).toBe(204);
      }
    }
  });

  // Caso de prueba para crear un nuevo comunicado sin enviar name en el body de la solicitud
  test("Create announcement without name", async ({ request }) => {
    const requestOptions = {
      data: createAnnouncementWithoutName,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(validationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(400);
    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("name");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "The Name field is required.",
    );
  });

  // Caso de prueba para crear un nuevo comunicado sin enviar description en el body de la solicitud
  test("Create announcement without description", async ({ request }) => {
    const requestOptions = {
      data: createAnnouncementWithoutDescription,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(validationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(400);
    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("description");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "The Description field is required.",
    );
  });

  // Caso de prueba para crear un nuevo comunicado sin enviar appliesTo en el body de la solicitud
  test("Create announcement without appliesTo", async ({ request }) => {
    const requestOptions = {
      data: createAnnouncementWithoutAppliesTo,
    };
    const ajv = new Ajv();
    const validateSchema = ajv.compile(validationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
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

  // Caso de prueba para crear un nuevo comunicado sin enviar el id de programa en el body de la solicitud
  test("Create announcement without program id", async ({ request }) => {
    const requestOptions = {
      data: createAnnouncementWithoutProgramId,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(domainValidationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(400);
    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe(
      "programs[0].Code",
    );
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "Program code is required.",
    );
  });

  // Caso de prueba para crear un nuevo comunicado sin enviar el id de grade en el body de la solicitud
  test("Create announcement without grade id", async ({ request }) => {
    const requestOptions = {
      data: createAnnouncementWithGradeIdNull,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(domainValidationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(400);
    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("grades[0].Id");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "Grade ID must be greater than zero.",
    );
  });

  // Caso de prueba para crear un nuevo comunicado con un valor no válido en isActive en el body de la solicitud
  test("Create announcement with invalid isActive value", async ({
    request,
  }) => {
    const requestOptions = {
      data: createAnnouncementWithInvalidIsActive,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(validationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(400);
    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("isActive");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "Expected a boolean.",
    );
  });

  // Caso de prueba para crear un nuevo comunicado sin name y description en el body de la solicitud ---------
  test("Create announcement without name and description", async ({
    request,
  }) => {
    const requestOptions = {
      data: createAnnouncementWithoutNameAndDescription,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(validationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(400);
    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("name");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "The Name field is required.",
    );
    expect(AnnouncementNotFound.error.details[1].property).toBe("description");
    expect(AnnouncementNotFound.error.details[1].errors[0]).toBe(
      "The Description field is required.",
    );
  });

  // Caso de prueba para crear un nuevo comunicado con fecha de creación en el pasado
  test("Create announcement with past creation date", async ({ request }) => {
    const requestOptions = {
      data: createAnnouncementWithPastDate,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(domainValidationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(400);
    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("dateRange");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "Start date must be greater than or equal to today.",
    );
  });

  // Caso de prueba para crear un nuevo comunicado con fechas de publicación incorrectas
  test("Create ad with incorrect publication dates", async ({ request }) => {
    const requestOptions = {
      data: createAnnouncementWithIncorrectPublicationDates,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(domainValidationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(400);
    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("dateRange");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      "End date must be greater than or equal to start date.",
    );
  });

  // Caso de prueba para crear un nuevo comunicado con programa inactivo
  test("create a statement with inactive program", async ({ request }) => {
    const requestOptions = {
      data: createAnnouncementWithInactiveProgram,
    };

    const ajv = new Ajv();
    const validateSchema = ajv.compile(validationErrorSchema);

    const response = await request.post(
      `announcements?EntityCode=${testConfig.entityCode}`,
      requestOptions,
    );
    await logApi(response, "POST");
    await expect(response.status()).toBe(400);
    const AnnouncementNotFound =
      (await response.json()) as AnnouncementNotFound;

    //Validar la estructura de la respuesta
    expect(validateSchema(AnnouncementNotFound)).toBeTruthy();

    expect(AnnouncementNotFound.error.details[0].property).toBe("programs");
    expect(AnnouncementNotFound.error.details[0].errors[0]).toBe(
      `The following programs either do not exist, are not active, or do not have an associated curriculum: ${createAnnouncementWithInactiveProgram.programs[0].code}.`,
    );
  });
});
