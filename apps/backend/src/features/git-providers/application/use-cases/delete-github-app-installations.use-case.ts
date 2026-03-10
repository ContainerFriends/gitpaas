import { GitProviderGithubGateway } from '../../domain/repositories/git-provider-github.gateway';

/**
 * Delete GitHub App installations use case.
 *
 * @param gateway Git provider GitHub gateway
 * @param appId GitHub App ID
 * @param privateKey GitHub App private key
 */
export function deleteGithubAppInstallationsUseCase(gateway: GitProviderGithubGateway, appId: string, privateKey: string): Promise<void> {
    return gateway.deleteInstallations(appId, privateKey);
}
