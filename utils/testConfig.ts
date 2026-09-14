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
    announcementIdAttachmentId: requiredEnv('ANNOUNCEMENT_ID_ATTACHMENT'),
    notFoundAnnouncementId: requiredEnv('ANNOUNCEMENT_NOT_FOUND_ID'),
    entityCode: requiredEnv('ENTITY_CODE'),
    attachmentId: requiredEnv('ATTACHMENT_ID'),
    attachmentIdDetails: requiredEnv('ATTACHMENT_ID_DETAILS'),
    notFoundAttachmentId: requiredEnv('ATTACHMENT_NOT_FOUND_ID'),
    attachementLinkIdExisting :requiredEnv('ATTACHMENT_EXISTING_LINK_ID'),
};