// importa el módulo de prueba de Playwright
import {test as base, expect, APIRequestContext} from '@playwright/test';
import { logApi } from '../utils/apiLogger';
import { testConfig } from '../utils/testConfig';

// Importar los tipos de respuesta interfaces
import { AnnouncementNotFound } from '../utils/typeById';
import { test } from '../utils/tools';

// Escenarios de prueba para la API de comunicados
test.describe('Delete Announcements API', () => {
    // Caso de prueba para eliminar un comunicado existente
    test('Delete announcement', async ({request, createdAnnouncementId}) => {
        const response = await request.delete(`announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`);
        await logApi(response, "DELETE");
        await expect(response.status()).toBe(204);
    });

    // Caso de prueba para eliminar un comunicado no existente
    test('Delete non-existent announcement', async ({request}) => {
        const response = await request.delete(`announcements/${testConfig.notFoundAnnouncementId}?EntityCode=${testConfig.entityCode}`);
        await logApi(response, "DELETE");
        await expect(response.status()).toBe(404);
        const AnnouncementNotFound = await response.json() as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("NOT_FOUND");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.NOT_FOUND");
        expect(AnnouncementNotFound.error.message).toBe(`Announcement with id '${testConfig.notFoundAnnouncementId}' was not found.`);
    });
});
