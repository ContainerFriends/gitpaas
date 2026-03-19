import { z } from 'zod';

import { gitProviderFormSchema } from '../schemas/git-provider-form.schema';
import { githubGitProviderFormSchema } from '../schemas/github-git-provider-form.schema';

export type GitProviderFormData = z.infer<typeof gitProviderFormSchema>;

export type GithubGitProviderFormData = z.infer<typeof githubGitProviderFormSchema>;
