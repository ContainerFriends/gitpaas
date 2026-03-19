import Joi from 'joi';

/**
 * Get repositories query validation schema
 */
export const getRepositoriesQuerySchema = Joi.object({
    gitProviderId: Joi.string().uuid().required().messages({
        'string.base': 'gitProviderId must be a string',
        'string.guid': 'gitProviderId must be a valid UUID',
        'any.required': 'gitProviderId is required',
    }),
});

/**
 * Get branches query validation schema
 */
export const getBranchesQuerySchema = Joi.object({
    gitProviderId: Joi.string().uuid().required().messages({
        'string.base': 'gitProviderId must be a string',
        'string.guid': 'gitProviderId must be a valid UUID',
        'any.required': 'gitProviderId is required',
    }),
    repositoryId: Joi.string().required().messages({
        'string.empty': 'repositoryId is required',
        'any.required': 'repositoryId is required',
    }),
});
