import Joi from 'joi';

export const installGithubAppQuerySchema = Joi.object({
    code: Joi.string().required().messages({
        'string.empty': 'Installation code is required',
        'any.required': 'Installation code is required',
    }),
    traceId: Joi.string().uuid().required().messages({
        'string.empty': 'Trace ID is required',
        'string.guid': 'Trace ID must be a valid UUID',
        'any.required': 'Trace ID is required',
    }),
    state: Joi.string().required().messages({
        'string.empty': 'State is required',
        'any.required': 'State is required',
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
