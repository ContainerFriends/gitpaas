import Joi from 'joi';

/**
 * Schema for validating git provider ID parameter
 */
export const gitProviderIdParamsSchema = Joi.object({
    gitProviderId: Joi.string().required().messages({
        'any.required': 'Git provider ID is required',
        'string.empty': 'Git provider ID cannot be empty',
    }),
});

/**
 * Schema for creating a git provider
 */
export const createGitProviderSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'Git provider ID is required',
        'string.empty': 'Git provider ID cannot be empty',
    }),
    name: Joi.string().required().min(1).max(256).messages({
        'any.required': 'Git provider name is required',
        'string.empty': 'Git provider name cannot be empty',
        'string.min': 'Git provider name must be at least 1 character long',
        'string.max': 'Git provider name must not exceed 256 characters',
    }),
    type: Joi.string().valid('github').required().messages({
        'any.required': 'Git provider type is required',
        'any.only': 'Git provider type must be one of: github',
    }),
});

/**
 * Schema for updating a git provider
 */
export const updateGitProviderSchema = Joi.object({
    name: Joi.string().min(1).max(256).messages({
        'string.empty': 'Git provider name cannot be empty',
        'string.min': 'Git provider name must be at least 1 character long',
        'string.max': 'Git provider name must not exceed 256 characters',
    }),
    type: Joi.string().valid('github').messages({
        'any.only': 'Git provider type must be one of: github',
    }),
});
