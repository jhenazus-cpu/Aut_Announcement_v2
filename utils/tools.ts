// importa el módulo de prueba de Playwright
import { test as base, expect, APIRequestContext } from "@playwright/test";
import { logApi } from "./apiLogger";
import { testConfig } from "./testConfig";

import createAnnouncement from "@create/createAnnouncement.json";

// Definir la interfaz para la respuesta de creación de comunicado
interface CreateAnnouncementResponse {
  data: {
    id: number;
  };
  statusCode: number;
}

// Definir el tipo de fixture para almacenar el ID del comunicado creado
type AnnouncementFixtures = {
  createdAnnouncementId: number;
};

// El fixture se ejecuta solamente en las pruebas que solicitan el ID. Por ello,
// cualquiera de ellas puede ejecutarse de forma aislada y no depende del caso Create.
export const test = base.extend<AnnouncementFixtures>({
  createdAnnouncementId: async ({ request }, use) => {
    const announcementId = await createAnnouncementForTest(request);

    try {
      await use(announcementId);
    } finally {
      const response = await request.delete(
        `announcements/${announcementId}?EntityCode=${testConfig.entityCode}`,
      );
      await logApi(response, "DELETE");

      //Acepta 204 o 404, porque algunas pruebas pueden eliminarlo previamente.
      if (![204, 404].includes(response.status())) {
        throw new Error(
          `The test announcement ${announcementId} could not be deleted. Status: ${response.status()}`,
        );
      }
    }
  },
});

// Función para validar los valores que se encuentran dentro de items

export function expectedItemFields(announcementsResponse: any) {
  if (
    announcementsResponse.data.items != null &&
    announcementsResponse.data.items.length > 0
  ) {
    announcementsResponse.data.items.forEach((item: any) => {
      expect.soft(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("appliesTo");
      expect(item).toHaveProperty("createdAt");
      expect(item).toHaveProperty("startDate");
      expect(item).toHaveProperty("endDate");
      expect(item).toHaveProperty("period");
      expect(item).toHaveProperty("campusSchedules");
      expect(item).toHaveProperty("grades");
      expect(item).toHaveProperty("programs");
      expect(item).toHaveProperty("attachments");

      //Validar que items exista sea un array y tenga registros
      expect(typeof item.id).toBe("number");
      expect(typeof item.name).toBe("string");
      expect(typeof item.description).toBe("string");
      expect(typeof item.createdAt).toBe("string");
      expect(Date.parse(item.createdAt)).not.toBeNaN();
      expect(
        item.startDate === null || typeof item.startDate === "string",
      ).toBeTruthy();
      if (item.startDate) {
        expect(Date.parse(item.startDate)).not.toBeNaN();
      }
      expect(
        item.endDate === null || typeof item.endDate === "string",
      ).toBeTruthy();
      expect(typeof item.updatedAt).toBeDefined();
      expect(typeof item.period).toBeDefined();
      expect(Array.isArray(item.appliesTo)).toBeTruthy();
      expect(Array.isArray(item.campusSchedules)).toBeTruthy();
      expect(Array.isArray(item.grades)).toBeTruthy();
      expect(Array.isArray(item.programs)).toBeTruthy();
      expect(Array.isArray(item.attachments)).toBeTruthy();

      // Validando estructura de periodo

      if (item.period) {
        expect(typeof item.period.id).toBe("number");
        expect(typeof item.period.name).toBe("string");
      }

      // Validando estructura de appliesTo
      item.appliesTo.forEach((value: any) => {
        expect(typeof value).toBe("number");
      });

      // Validando estructura de grades
      item.grades.forEach((grade: { id: any; name: any }) => {
        expect(typeof grade.id).toBe("number");
        expect(typeof grade.name).toBe("string");
      });

      // Validando estrucura del campo campusSchedules
      item.campusSchedules.forEach((schedule: { id: any; name: any }) => {
        expect(typeof schedule.id).toBe("number");
        expect(typeof schedule.name).toBe("string");
      });
    });
  } else {
    throw new Error(
      "No announcements found. The test cannot continue.'Get all the announcements'",
    );
  }
}

// Función para crear un comunicado de prueba
export async function createAnnouncementForTest(
  request: APIRequestContext,
): Promise<number> {
  const requestOptions = {
    // Se clona el payload para que cada prueba tenga un comunicado propio.
    data: {
      ...createAnnouncement,
      name: `${createAnnouncement.name} - ${Date.now()}`,
    },
  };

  // Se realiza la solicitud POST para crear un comunicado
  const response = await request.post(
    `announcements?EntityCode=${testConfig.entityCode}`,
    requestOptions,
  );
  await logApi(response, "POST");
  expect(response.status()).toBe(201);

  // El ID es prerrequisito del fixture: debe existir, ser numérico y ser válido.
  const body = (await response.json()) as CreateAnnouncementResponse;
  expect(body).toHaveProperty("data");
  expect(body.data).toHaveProperty("id");
  expect(typeof body.data.id).toBe("number");
  expect(Number.isInteger(body.data.id)).toBe(true);
  expect(body.data.id).toBeGreaterThan(0);
  return body.data.id;
}
export const validateAttachmentDetailContract = (
  GetDetailsAttachmentResponse: any,
) => {
  expect(GetDetailsAttachmentResponse).toHaveProperty("data");
  expect(GetDetailsAttachmentResponse).toHaveProperty("statusCode");
  expect(typeof GetDetailsAttachmentResponse.statusCode).toBe("number");

  // Estructura principal
  expect(GetDetailsAttachmentResponse).toHaveProperty("data");
  expect(GetDetailsAttachmentResponse).toHaveProperty("statusCode");
  expect(typeof GetDetailsAttachmentResponse.statusCode).toBe("number");

  const attachment = GetDetailsAttachmentResponse.data;
  expect(typeof attachment.id).toBe("number");
  expect(typeof attachment.fileName).toBe("string");
  expect(typeof attachment.filePath).toBe("string");
  expect(typeof attachment.sizeInBytes).toBe("number");
  expect(typeof attachment.contentType).toBe("string");
  expect(typeof attachment.extension).toBe("string");
  expect(typeof attachment.uploadedAt).toBe("string");
  expect(typeof attachment.embedded).toBe("boolean");

  // Campos anulables
  expect(
    attachment.thumbnailPath === null ||
      typeof attachment.thumbnailPath === "string",
  ).toBeTruthy();
  expect(
    attachment.categoryCode === null ||
      typeof attachment.categoryCode === "string",
  ).toBeTruthy();
  expect(
    attachment.referenceCode === null ||
      typeof attachment.referenceCode === "string",
  ).toBeTruthy();
  expect(
    attachment.metadata === null || typeof attachment.metadata === "string",
  ).toBeTruthy();

  // Fecha válida
  expect(Number.isNaN(Date.parse(attachment.uploadedAt))).toBe(false);
};

/*
export const getAnnouncementAttachmentsSchema = {
  type: 'object',
  required: ['data', 'statusCode'],
  properties: {
    statusCode: {
      type: 'integer'
    },
    data: {
      type: 'object',
      required: ['items', 'totalCount'],
      properties: {
        totalCount: {
          type: 'integer'
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: [
              'id',
              'fileName',
              'filePath',
              'sizeInBytes',
              'contentType',
              'extension',
              'uploadedAt',
              'embedded'
            ],
            properties: {
              id: { type: 'integer' },
              fileName: { type: 'string' },
              filePath: { type: 'string' },
              sizeInBytes: { type: 'integer' },
              contentType: { type: 'string' },
              extension: { type: 'string' },
              uploadedAt: { type: 'string' },
              embedded: { type: 'boolean' },

              thumbnailPath: {
                type: ['string', 'null']
              },
              categoryCode: {
                type: ['string', 'null']
              },
              referenceCode: {
                type: ['string', 'null']
              },
              metadata: {
                type: ['object', 'null']
              }
            }
          }
        }
      }
    }
  }
};
*/
