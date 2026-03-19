import Joi from 'joi';

export const installGithubAppQuerySchema = Joi.object({
    code: Joi.string().required().messages({
        'string.empty': 'Installation code is required',
        'any.required': 'Installation code is required',
    }),
});

export const postInstallGithubAppQuerySchema = Joi.object({
    installation_id: Joi.string().required().messages({
        'string.empty': 'Installation ID is required',
        'any.required': 'Installation ID is required',
    }),
    setup_action: Joi.string().required().messages({
        'string.empty': 'Setup action is required',
        'any.required': 'Setup action is required',
    }),
});
