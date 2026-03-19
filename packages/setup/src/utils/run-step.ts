import ora from 'ora';

/**
 * Run a setup step with an ora spinner
 */
export const runStep = async (text: string, fn: () => void | Promise<void>): Promise<void> => {
    const spinner = ora(text).start();
    try {
        await fn();
        spinner.succeed();
    } catch (error) {
        spinner.fail();
        throw error;
    }
};
