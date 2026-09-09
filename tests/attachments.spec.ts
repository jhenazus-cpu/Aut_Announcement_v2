import  {test, expect} from '@playwright/test';
import { logApi } from '../utils/apiLogger';
import { testConfig } from '../utils/testConfig';


test.describe('Attachments API', () => {
    test('Get all the attachments', async ({request}) => {
        const response = await request.get(`announcements/${testConfig.announcementId}/attachments?EntityCode=${testConfig.entityCode}`);
        await logApi(response, "GET");
        await expect(response).toBeOK();
    });
    /*
    test('Get Announcement Attachment detail', async ({request}) => {
        const response = await request.get(`announcements/${testConfig.announcementId}/attachments/${testConfig.attachmentId}?EntityCode=${testConfig.entityCode}`);
        await logApi(response, "GET");
        await expect(response).toBeOK();
    });
    test('Delete announcement attachment', async ({request}) => {
        const response = await request.delete(`announcements/${testConfig.announcementId}/attachments/${testConfig.attachmentId}?EntityCode=${testConfig.entityCode}`);
        await logApi(response, "DELETE");
        await expect(response).toBeOK();
    });
    test('Link attachment to announcement', async ({request}) => {
        const response = await request.post(`attachments?EntityCode=${testConfig.entityCode}`);
        await logApi(response, "POST");
        await expect(response).toBeOK();
    });
*/
});