// importa el módulo de prueba de Playwright
import {test as base, expect, APIRequestContext} from '@playwright/test';
import { logApi } from '../utils/apiLogger';
import { testConfig } from '../utils/testConfig';

// Importar los tipos de respuesta interfaces
import { UpdateAnnouncementResponse } from '../utils/type';
import { AnnouncementNotFound } from '../utils/typeById';
import { test} from '../utils/tools';

// Importar los payloads de prueba
import updateAnnouncement from "@update/updateAnnouncement.json";
import updateAnnouncementWithoutAppliesTo from "@update/updateAnnouncementwithoutAppliesTo.json";
import updateAnnouncementWithoutValueAppliesTo from "@update/updateAnnouncementWithoutValueAppliesTo.json";

// Escenarios de prueba para la API de comunicados
test.describe('Update Announcements API', () => {
    //Modificar información de un comunicado existente
    test('Update announcement', async ({request, createdAnnouncementId}) => {
        const requestOptions = {
            data: updateAnnouncement
        };
        const response = await request.put(`announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`, requestOptions);
        await logApi(response, "PUT");
        await expect(response).toBeOK();
        const updateAnnouncementResponse = await response.json() as UpdateAnnouncementResponse;
        expect.soft(updateAnnouncementResponse.data).toHaveProperty('id');
        //expectSoftPositiveInteger(updateAnnouncementResponse.data.id);
        expect.soft(updateAnnouncementResponse.data.id).toBe(createdAnnouncementId);
    });

    //Modificar información de un comunicado existente sin enviar appliesTo en el body de la solicitud
    test('Update announcement without appliesTo', async ({request, createdAnnouncementId}) => {
        const requestOptions = {
            data: updateAnnouncementWithoutAppliesTo
        };
        const response = await request.put(`announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`, requestOptions);
        await logApi(response, "PUT");
        await expect(response.status()).toBe(400);

        const AnnouncementNotFound = (await response.json()) as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Validation failed`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("appliesTo");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("The AppliesTo field is required.");
    });

    //Modificar información de un comunicado existente sin enviar el valor en appliesTo en el body de la solicitud
    test('Update announcement without value for appliesTo', async ({request, createdAnnouncementId}) => {
        const requestOptions = {
            data: updateAnnouncementWithoutValueAppliesTo
        };
        const response = await request.put(`announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`, requestOptions);
        await logApi(response, "PUT");
        await expect(response.status()).toBe(400);

        const AnnouncementNotFound = (await response.json()) as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Validation failed`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("appliesTo");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("AppliesTo must contain at least one value.");
    });
});
