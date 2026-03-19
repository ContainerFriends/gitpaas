/**
 * Github app status model
 */
export interface GithubAppStatus {
    isInstalled: boolean;
    installUrl?: string;
    error?: string;
}
