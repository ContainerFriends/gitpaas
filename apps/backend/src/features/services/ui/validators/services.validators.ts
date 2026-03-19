import Joi from 'joi';

/**
 * Schema for validating service ID parameter
 */
export const serviceIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'Service ID is required',
        'string.empty': 'Service ID cannot be empty',
    }),
});

/**
 * Schema for validating project ID parameter
 */
export const projectIdSchema = Joi.object({
    projectId: Joi.string().required().messages({
        'any.required': 'Project ID is required',
        'string.empty': 'Project ID cannot be empty',
    }),
});

/**
 * Schema for creating a service
 */
export const createServiceSchema = Joi.object({
    name: Joi.string().required().max(100).messages({
        'any.required': 'Service name is required',
        'string.empty': 'Service name cannot be empty',
        'string.max': 'Service name must not exceed 100 characters',
    }),
    type: Joi.string().valid('docker_compose').required().messages({
        'any.required': 'Service type is required',
        'any.only': 'Service type must be docker_compose',
    }),
    projectId: Joi.string().required().messages({
        'any.required': 'Project ID is required',
        'string.empty': 'Project ID cannot be empty',
    }),
});

/**
 * Schema for updating a service
 */
export const updateServiceSchema = Joi.object({
    name: Joi.string().optional().max(100).messages({
        'string.empty': 'Service name cannot be empty if provided',
        'string.max': 'Service name must not exceed 100 characters',
    }),
    gitProviderId: Joi.string().optional().messages({
        'string.empty': 'Git Provider ID cannot be empty if provided',
    }),
    repositoryId: Joi.string().optional().messages({
        'string.empty': 'Repository ID cannot be empty if provided',
    }),
    branch: Joi.string().optional().messages({
        'string.empty': 'Branch cannot be empty if provided',
    }),
    composePath: Joi.string().optional().max(500).messages({
        'string.empty': 'Compose path cannot be empty if provided',
        'string.max': 'Compose path must not exceed 500 characters',
    }),
}).min(1);
