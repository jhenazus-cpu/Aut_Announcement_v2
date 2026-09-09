// importa el módulo de prueba de Playwright
import {test as base, expect, APIRequestContext} from '@playwright/test';
import { logApi } from '../utils/apiLogger';
import { testConfig } from '../utils/testConfig';

// Importar los tipos de respuesta interfaces
import { announcementsResponse } from '../utils/type';
import { announcementsResponseById, AnnouncementNotFound } from '../utils/typeById';
import { expectedItemFields, test } from '../utils/tools';

// Escenarios de prueba para la API de comunicados
test.describe('Announcements API', () => {
    test('Get all the announcements', async ({request}) => {
        const response = await request.get(`announcements?EntityCode=${testConfig.entityCode}`);
        await logApi(response, "GET");        
        await expect(response).toBeOK();
        const announcementsResponse = await response.json() as announcementsResponse;
        
        //Validar que exista la data
        expect(announcementsResponse).toHaveProperty('data');
        expect(announcementsResponse).toHaveProperty('statusCode');
        expect(typeof announcementsResponse.statusCode).toBe('number');

        expect(announcementsResponse.data).toHaveProperty('items');
        expect(Array.isArray(announcementsResponse.data.items)).toBeTruthy();
        
        expect.soft(announcementsResponse.data).toHaveProperty('totalCount');
        expect.soft(typeof announcementsResponse.data.totalCount).toBe('number');
        expect.soft(announcementsResponse.data.totalCount).toBeGreaterThanOrEqual(0);

        // Verificar que la respuesta contenga los campos esperados
        expectedItemFields(announcementsResponse);
    });

test('Get all the announcements by AppliesTo', async ({request}) => {
        const requestOptions = {
            params: {
                AppliesTo: "2"
            },
        };
        const response = await request.get(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);
        await logApi(response, "GET");        
        await expect(response).toBeOK();
        const announcementsResponse = await response.json() as announcementsResponse;

        //Validar que exista la data
        expect(announcementsResponse).toHaveProperty('data');
        expect(announcementsResponse.data).toHaveProperty('items');
        expect.soft(announcementsResponse.data).toHaveProperty('totalCount');
        expect.soft(typeof announcementsResponse.data.totalCount).toBe('number');
        expect.soft(announcementsResponse.data.totalCount).toBeGreaterThanOrEqual(0);

        //Validar que items exista sea un array y tenga registros
        expect(Array.isArray(announcementsResponse.data.items)).toBe(true);
        expect.soft(announcementsResponse.data.items.length).toBeGreaterThan(0);


        // Verificar que la respuesta contenga los campos esperados
        expectedItemFields(announcementsResponse);
    });

    test('Get all the announcements with multiple filters', async ({request}) => {
        const requestOptions = {
            params: {
                AppliesTo: "3",
                CampusScheduleIds: '1',
                ProgramCodes: 'P01JPM',
                PeriodIds: '21',
            },
        };
        const response = await request.get(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);
        await logApi(response, "GET");   
        await expect(response).toBeOK();
        const announcementsResponse = await response.json() as announcementsResponse; 

        //Validar que exista la data
        expect(announcementsResponse).toHaveProperty('data');
        expect(announcementsResponse.data).toHaveProperty('items');
        expect.soft(announcementsResponse.data).toHaveProperty('totalCount');
        expect.soft(typeof announcementsResponse.data.totalCount).toBe('number');
        expect.soft(announcementsResponse.data.totalCount).toBeGreaterThanOrEqual(0);

        //Validar que items exista sea un array y tenga registros
        expect(Array.isArray(announcementsResponse.data.items)).toBe(true);
        expect.soft(announcementsResponse.data.items.length).toBeGreaterThan(0);


        // Verificar que la respuesta contenga los campos esperados
        expectedItemFields(announcementsResponse);
    });
    
    // Caso de prueba para obtener los comunicados por ID
    test('Get announcement by ID', async ({request, createdAnnouncementId}) => {
        const response = await request.get(`announcements/${createdAnnouncementId}?EntityCode=${testConfig.entityCode}`);
        await logApi(response, "GET");
        await expect(response).toBeOK();

        const announcementsResponseById = await response.json() as announcementsResponseById;
        if (announcementsResponseById.data != null) {
            expect.soft(announcementsResponseById.data).toHaveProperty('id');
            //expectSoftPositiveInteger(announcementsResponseById.data.id);
            expect.soft(announcementsResponseById.data.id).toBe(createdAnnouncementId);
        } else {
            throw new Error("No announcements found. The test cannot continue. 'Get announcement by ID.'");
        }
    });

    // Caso de prueba para obtener un comunicado por ID que no existe
    test('Get announcement by ID not found', async ({request}) => {
        const response = await request.get(`announcements/${testConfig.notFoundAnnouncementId}?EntityCode=${testConfig.entityCode}`);
        await logApi(response, "GET");
        await expect(response.status()).toBe(404);

        const AnnouncementNotFound = (await response.json()) as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("NOT_FOUND");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.NOT_FOUND");
        expect(AnnouncementNotFound.error.message).toBe(`Announcement with id '${testConfig.notFoundAnnouncementId}' was not found.`);
    });
});
