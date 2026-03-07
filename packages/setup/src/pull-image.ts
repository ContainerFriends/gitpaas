import { type ChildProcess, type SpawnOptions, spawn } from 'node:child_process';

import BufferList from 'bl';

interface RegistryAuth {
    username: string;
    password: string;
    registryUrl: string;
}

export const spawnAsync = (
    command: string,
    args?: string[] | undefined,
    onData?: (data: string) => void, // Callback opcional para manejar datos en tiempo real
    options?: SpawnOptions,
): Promise<BufferList> & { child: ChildProcess } => {
    const child = spawn(command, args ?? [], options ?? {});
    const stdout = child.stdout ? new BufferList() : new BufferList();
    const stderr = child.stderr ? new BufferList() : new BufferList();

    if (child.stdout) {
        child.stdout.on('data', (data) => {
            stdout.append(data);
            if (onData) {
                onData(data.toString());
            }
        });
    }
    if (child.stderr) {
        child.stderr.on('data', (data) => {
            stderr.append(data);
            if (onData) {
                onData(data.toString());
            }
        });
    }

    const promise = new Promise<BufferList>((resolve, reject) => {
        child.on('error', reject);

        child.on('close', (code) => {
            if (code === 0) {
                resolve(stdout);
            } else {
                const err = new Error(`${stderr.toString()}`) as Error & {
                    code: number;
                    stderr: BufferList;
                    stdout: BufferList;
                };
                err.code = code || -1;
                err.stderr = stderr;
                err.stdout = stdout;
                reject(err);
            }
        });
    }) as Promise<BufferList> & { child: ChildProcess };

    promise.child = child;

    return promise;
};

export const pullImage = async (dockerImage: string, onData?: (data: any) => void, authConfig?: Partial<RegistryAuth>): Promise<void> => {
    if (!dockerImage) {
        throw new Error('Docker image not found');
    }

    if (authConfig?.username && authConfig?.password) {
        await spawnAsync('docker', ['login', authConfig.registryUrl || '', '-u', authConfig.username, '-p', authConfig.password], onData);
    }
    await spawnAsync('docker', ['pull', dockerImage], onData);
};
