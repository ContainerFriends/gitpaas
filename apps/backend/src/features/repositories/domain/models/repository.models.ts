/**
 * Repository model
 */
export interface Repository {
    id: string;
    name: string;
    fullName: string;
    description: string | null;
    private: boolean;
    htmlUrl: string;
    cloneUrl: string;
    sshUrl: string;
    defaultBranch: string;
    language: string | null;
    gitProviderId: string;
}
