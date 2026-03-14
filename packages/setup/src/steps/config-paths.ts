import { chmodSync } from 'node:fs';

import { paths } from '../configs/paths';
import { createDirectoryIfNotExist } from '../utils/create-directory';

/**
 * Setup application directories
 */
export const setupDirectories = (): void => {
    const {
        APPLICATIONS_PATH,
        BASE_PATH,
        CERTIFICATES_PATH,
        DYNAMIC_TRAEFIK_PATH,
        LOGS_PATH,
        MAIN_TRAEFIK_PATH,
        MONITORING_PATH,
        SSH_PATH,
        SCHEDULES_PATH,
        VOLUME_BACKUPS_PATH,
    } = paths();

    const directories = [
        BASE_PATH,
        MAIN_TRAEFIK_PATH,
        DYNAMIC_TRAEFIK_PATH,
        LOGS_PATH,
        APPLICATIONS_PATH,
        SSH_PATH,
        CERTIFICATES_PATH,
        MONITORING_PATH,
        SCHEDULES_PATH,
        VOLUME_BACKUPS_PATH,
    ];

    let allExisted = true;

    for (const dir of directories) {
        try {
            const wasCreated = createDirectoryIfNotExist(dir);

            if (wasCreated) {
                allExisted = false;
            }

            if (dir === SSH_PATH) {
                chmodSync(SSH_PATH, '700');
            }
        } catch (error) {
            console.log(error, ' On path: ', dir);
        }
    }

    console.log(allExisted ? '✅ Directories already exists' : '✅ Directories created');
};
