/**
 * Generate Github App manifest url use case
 *
 * @returns Url with the manifest to install the GitHub App
 */
export function generateGithubManifestUrlUseCase(): string {
    const githubInstallerUrl = process.env.GITHUB_INSTALLER_URL;

    const manifest = {
        name: `GitPaaS-${process.env.HOSTNAME || 'Server'}`,
        url: '',
        hook_attributes: {
            url: `endpoint/api/webhooks/github`,
        },
        redirect_url: `endpoint/api/setup/callback`,
        public: false,
        default_permissions: {
            contents: 'read',
            statuses: 'write',
            metadata: 'read',
        },
        default_events: ['push'],
    };

    const manifestBase64 = Buffer.from(JSON.stringify(manifest)).toString('base64');

    return `${githubInstallerUrl}/install?manifest=${manifestBase64}`;
}
