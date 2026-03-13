export type SetupMode = 'local' | 'production';

const arg = process.argv[2];

if (arg !== 'local' && arg !== 'production') {
    console.error('❌ Usage: setup <local|production>');
    process.exit(1);
}

export const setupMode: SetupMode = arg;
