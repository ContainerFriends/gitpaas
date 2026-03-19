import { existsSync, mkdirSync } from 'node:fs';

/**
 * Create a directory if it does not exist
 *
 * @param dirPath Path of the directory to create
 * @returns `true` if the directory was created, `false` if it already existed
 */
export const createDirectoryIfNotExist = (dirPath: string): boolean => {
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });

        return true;
    }

    return false;
};
