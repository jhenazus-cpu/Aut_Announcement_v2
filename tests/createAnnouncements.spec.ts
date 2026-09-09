// importa el módulo de prueba de Playwright
import {test as base, expect, APIRequestContext} from '@playwright/test';
import { logApi } from '../utils/apiLogger';
import { testConfig } from '../utils/testConfig';

// Importar los tipos de respuesta interfaces
import { createAnnouncementsResponse } from '../utils/type';
import { AnnouncementNotFound } from '../utils/typeById';
import { test } from '../utils/tools';

// Importar los payloads de prueba

import createAnnouncement from "@create/createAnnouncement.json";
import createAnnouncementWithPastDate from "@create/createAnnouncementWithPastDate.json";
import createAnnouncementWithoutAppliesTo from "@create/createAnnouncementWithoutAppliesTo.json";
import createAnnouncementWithoutProgramId from "@create/createAnnouncementWithoutProgramId.json";
import createAnnouncementWithoutName from "@create/createAnnouncementWithoutName.json";
import createAnnouncementWithoutDescription from "@create/createAnnouncementWithoutDescription.json";
import createAnnouncementWithoutGradeId from "@create/createAnnouncementWithoutGradeId.json";
import createAnnouncementWithInvalidIsActive from "@create/createAnnouncementWithInvalidIsActive.json";
import createAnnouncementWithoutNameAndDescription from "@create/createAnnouncementWithoutNameAndDescription.json";

// Escenarios de prueba para la API de comunicados
test.describe('Create Announcements API', () => {
    // Caso de prueba para crear un nuevo comunicado
    test('Create announcement', async ({request}) => {
        const requestOptions = {
            data: createAnnouncement
        };
        const response = await request.post(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);    
        await logApi(response, "POST");
        await expect(response.status()).toBe(201);
        const createAnnouncementsResponse = await response.json() as createAnnouncementsResponse;

        //Validar la estructura de la respuesta
        expect(createAnnouncementsResponse).toHaveProperty('data');
        expect.soft(createAnnouncementsResponse).toHaveProperty('statusCode');
        
        // Validar propiedades de la data
        expect.soft(createAnnouncementsResponse.data).toHaveProperty('id');
        expect(createAnnouncementsResponse.data).toHaveProperty('name');
        expect(createAnnouncementsResponse.data).toHaveProperty('description');
        expect(createAnnouncementsResponse.data).toHaveProperty('appliesTo');
        expect(createAnnouncementsResponse.data).toHaveProperty('programs');
        expect(createAnnouncementsResponse.data).toHaveProperty('grades');
        expect(createAnnouncementsResponse.data).toHaveProperty('startDate');
        expect(createAnnouncementsResponse.data).toHaveProperty('endDate');
        expect(createAnnouncementsResponse.data).toHaveProperty('campusSchedules');
        expect(createAnnouncementsResponse.data).toHaveProperty('isActive');
        expect(createAnnouncementsResponse.data).toHaveProperty('createdAt');
        expect(createAnnouncementsResponse.data).toHaveProperty('updatedAt');
        expect(createAnnouncementsResponse.data).toHaveProperty('period');

        // validar los arrays de la data
        // appliesTo, programs, grades y campusSchedules son los arreglos de data.
        expect(createAnnouncementsResponse.data.appliesTo).toEqual(expect.any(Array));
        expect(Array.isArray(createAnnouncementsResponse.data.programs)).toBe(true);
        expect(Array.isArray(createAnnouncementsResponse.data.grades)).toBe(true);
        expect(Array.isArray(createAnnouncementsResponse.data.campusSchedules)).toBe(true);
        
        // Validar que todos los elementos de appliesTo sean números
        createAnnouncementsResponse.data.appliesTo.forEach((appliesTo: unknown) => {
            expect.soft(typeof appliesTo).toBe('number');
            expect.soft(Number.isFinite(appliesTo)).toBe(true);
            expect.soft(Number.isInteger(appliesTo)).toBe(true);
            expect.soft(appliesTo).toBeGreaterThanOrEqual(0);
        });

        //Validar que todos los elementos de programs sean objetos con las propiedades code y name
        createAnnouncementsResponse.data.programs.forEach((program: any) => {
            expect(program).toHaveProperty('code');
            expect(program).toHaveProperty('name'); 
        });

        //Validar que todos los elementos de grades sean objetos con las propiedades id y name
        createAnnouncementsResponse.data.grades.forEach((grade: { name: any; }) => {
            expect.soft(grade).toHaveProperty('id');
            expect(grade).toHaveProperty('name'); 
            //expectSoftPositiveInteger(grade.id);
            expect(typeof grade.name).toBe('string');
        });

        //Validar que todos los elementos de period sean objetos con las propiedades id y name
        expect.soft(createAnnouncementsResponse.data.period).toHaveProperty('id');
        expect(createAnnouncementsResponse.data.period).toHaveProperty('name');
        expect(typeof createAnnouncementsResponse.data.period.name).toBe('string');

        //Validar el campo statusCode de la respuesta
        expect.soft(typeof createAnnouncementsResponse.statusCode).toBe('number');
        expect.soft(createAnnouncementsResponse.statusCode).toBe(201);
    });
    
    // Caso de prueba para crear un nuevo comunicado sin enviar name en el body de la solicitud
    test('Create announcement without name', async ({request}) => {
        const requestOptions = {
            data: createAnnouncementWithoutName
        };
        const response = await request.post(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);    
        await logApi(response, "POST");
        await expect(response.status()).toBe(400);
        const AnnouncementNotFound = await response.json() as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Validation failed`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("name");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("The Name field is required.");
    });

    // Caso de prueba para crear un nuevo comunicado sin enviar description en el body de la solicitud
    test('Create announcement without description', async ({request}) => {
        const requestOptions = {
            data: createAnnouncementWithoutDescription
        };
        const response = await request.post(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);    
        await logApi(response, "POST");
        await expect(response.status()).toBe(400);
        const AnnouncementNotFound = await response.json() as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Validation failed`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("description");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("The Description field is required.");
    });

     // Caso de prueba para crear un nuevo comunicado sin enviar appliesTo en el body de la solicitud
    test('Create announcement without appliesTo', async ({request}) => {
        const requestOptions = {
            data: createAnnouncementWithoutAppliesTo
        };
        const response = await request.post(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);    
        await logApi(response, "POST");
        await expect(response.status()).toBe(400);
        const AnnouncementNotFound = await response.json() as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Validation failed`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("appliesTo");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("The AppliesTo field is required.");
    });

    // Caso de prueba para crear un nuevo comunicado sin enviar el id de programa en el body de la solicitud
    test('Create announcement without program id', async ({request}) => {
        const requestOptions = {
            data: createAnnouncementWithoutProgramId
        };
        const response = await request.post(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);    
        await logApi(response, "POST");
        await expect(response.status()).toBe(400);
        const AnnouncementNotFound = await response.json() as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("DOMAIN_VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.DOMAIN_VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Domain validation failed.`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("programs[0].Code");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("Program code is required.");
    });

    // Caso de prueba para crear un nuevo comunicado sin enviar el id de grade en el body de la solicitud 
    test('Create announcement without grade id', async ({request}) => {
        const requestOptions = {
            data: createAnnouncementWithoutGradeId
        };
        const response = await request.post(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);    
        await logApi(response, "POST");
        await expect(response.status()).toBe(400);
        const AnnouncementNotFound = await response.json() as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("DOMAIN_VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.DOMAIN_VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Domain validation failed.`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("grades[0].Id");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("Grade ID must be greater than zero.");
    });

    // Caso de prueba para crear un nuevo comunicado con un valor no válido en isActive en el body de la solicitud
    test('Create announcement with invalid isActive value', async ({request}) => {
        const requestOptions = {
            data: createAnnouncementWithInvalidIsActive
        };
        const response = await request.post(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);    
        await logApi(response, "POST");
        await expect(response.status()).toBe(400);
        const AnnouncementNotFound = await response.json() as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Validation failed`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("isActive");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("Expected a boolean.");
    });

    // Caso de prueba para crear un nuevo comunicado sin name y description en el body de la solicitud ---------
    test('Create announcement without name and description', async ({request}) => {
        const requestOptions = {
            data: createAnnouncementWithoutNameAndDescription
        };
        const response = await request.post(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);    
        await logApi(response, "POST");
        await expect(response.status()).toBe(400);
        const AnnouncementNotFound = await response.json() as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Validation failed`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("name");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("The Name field is required.");
        expect(AnnouncementNotFound.error.details[1].property).toBe("description");
        expect(AnnouncementNotFound.error.details[1].errors[0]).toBe("The Description field is required.");
    });



    // Caso de prueba para crear un nuevo comunicado con fecha de creación en el pasado
    test('Create announcement with past creation date', async ({request}) => {
        const requestOptions = {
            data: createAnnouncementWithPastDate
        };
        const response = await request.post(`announcements?EntityCode=${testConfig.entityCode}`, requestOptions);    
        await logApi(response, "POST");
        await expect(response.status()).toBe(400);
        const AnnouncementNotFound = await response.json() as AnnouncementNotFound;
        expect(AnnouncementNotFound.error.type).toBe("DOMAIN_VALIDATION");
        expect(AnnouncementNotFound.error.code).toBe("HTTP.DOMAIN_VALIDATION");
        expect(AnnouncementNotFound.error.message).toBe(`Domain validation failed.`);
        expect(AnnouncementNotFound.error.details[0].property).toBe("dateRange");
        expect(AnnouncementNotFound.error.details[0].errors[0]).toBe("Start date must be greater than or equal to today.");
        })
});
