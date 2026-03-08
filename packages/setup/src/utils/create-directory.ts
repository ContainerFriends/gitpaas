import { existsSync, mkdirSync } from 'node:fs';

/**
 * Create a directory if it does not exist
 *
 * @param dirPath Path of the directory to create
 */
export const createDirectoryIfNotExist = (dirPath: string) => {
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    }
};
