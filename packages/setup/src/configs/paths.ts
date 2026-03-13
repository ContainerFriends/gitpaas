import { join } from 'path';

import { setupMode } from './environment';

/**
 * Paths configuration
 *
 * In production, all paths are under /etc/gitpaas
 * In local development, paths are under .docker at the monorepo root
 */
export const paths = () => {
    const BASE_PATH = setupMode === 'production' ? '/etc/gitpaas' : join(process.cwd(), '../../.docker');
    const MAIN_TRAEFIK_PATH = `${BASE_PATH}/traefik`;
    const DYNAMIC_TRAEFIK_PATH = `${MAIN_TRAEFIK_PATH}/dynamic`;

    return {
        BASE_PATH,
        MAIN_TRAEFIK_PATH,
        DYNAMIC_TRAEFIK_PATH,
        LOGS_PATH: `${BASE_PATH}/logs`,
        APPLICATIONS_PATH: `${BASE_PATH}/applications`,
        COMPOSE_PATH: `${BASE_PATH}/compose`,
        SSH_PATH: `${BASE_PATH}/ssh`,
        CERTIFICATES_PATH: `${DYNAMIC_TRAEFIK_PATH}/certificates`,
        MONITORING_PATH: `${BASE_PATH}/monitoring`,
        REGISTRY_PATH: `${BASE_PATH}/registry`,
        SCHEDULES_PATH: `${BASE_PATH}/schedules`,
        VOLUME_BACKUPS_PATH: `${BASE_PATH}/volume-backups`,
        VOLUME_BACKUP_LOCK_PATH: `${BASE_PATH}/volume-backup-lock`,
        PATCH_REPOS_PATH: `${BASE_PATH}/patch-repos`,
    };
};
