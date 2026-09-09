import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function requiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export const testConfig = {
    announcementId: requiredEnv('ANNOUNCEMENT_ID'),
    notFoundAnnouncementId: requiredEnv('ANNOUNCEMENT_NOT_FOUND_ID'),
    entityCode: requiredEnv('ENTITY_CODE'),
    attachmentId: requiredEnv('ATTACHMENT_ID'),
};