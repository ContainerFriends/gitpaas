/**
 * Generate Github App manifest url use case
 *
 * @param apiVersion API version to use in the manifest
 *
 * @returns Url with the manifest to install the GitHub App
 */
export function generateGithubManifestUrlUseCase(apiVersion: string): string {
    const githubInstallerUrl = process.env.GITHUB_INSTALLER_URL;
    const serverUrl = process.env.SERVER_URL;
    const developmentServerUrl = process.env.DEVELOPMENT_SERVER_URL;
    const isDevelopment = process.env.NODE_ENV === 'development';

    const manifest = {
        name: `GitPaaS-${process.env.HOSTNAME || 'Server'}`,
        url: isDevelopment ? developmentServerUrl : serverUrl,
        hook_attributes: {
            url: isDevelopment ? `${developmentServerUrl}/${apiVersion}/events/webhook` : `${serverUrl}/${apiVersion}/events/webhook`,
        },
        redirect_url: isDevelopment
            ? `${developmentServerUrl}/${apiVersion}/events/github-installation`
            : `${serverUrl}/${apiVersion}/events/github-installation`,
        setup_url: isDevelopment
            ? `${developmentServerUrl}/${apiVersion}/events/github-postinstallation`
            : `${serverUrl}/${apiVersion}/events/github-postinstallation`,
        public: false,
        default_permissions: {
            contents: 'read',
            statuses: 'write',
            metadata: 'read',
        },
        default_events: ['push'],
    };

    const manifestBase64 = Buffer.from(JSON.stringify(manifest)).toString('base64');

    return `${githubInstallerUrl}?manifest=${manifestBase64}`;
}
