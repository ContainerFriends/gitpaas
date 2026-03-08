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
    repositoryUrl: Joi.string().uri().optional().messages({
        'string.empty': 'Repository URL cannot be empty if provided',
        'string.uri': 'Repository URL must be a valid URL',
    }),
    branch: Joi.string().optional().messages({
        'string.empty': 'Branch cannot be empty if provided',
    }),
}).min(1);
