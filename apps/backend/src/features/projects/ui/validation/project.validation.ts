import Joi from 'joi';

/**
 * Schema for validating project ID parameter
 */
export const projectIdParamsSchema = Joi.object({
    projectId: Joi.string().required().messages({
        'any.required': 'Project ID is required',
        'string.empty': 'Project ID cannot be empty',
    }),
});

/**
 * Schema for creating a project
 */
export const createProjectSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'Project ID is required',
        'string.empty': 'Project ID cannot be empty',
    }),
    name: Joi.string().required().min(1).max(256).messages({
        'any.required': 'Project name is required',
        'string.empty': 'Project name cannot be empty',
        'string.min': 'Project name must be at least 1 character long',
        'string.max': 'Project name must not exceed 256 characters',
    }),
});

/**
 * Schema for updating a project
 */
export const updateProjectSchema = Joi.object({
    name: Joi.string().min(1).max(256).messages({
        'string.empty': 'Project name cannot be empty',
        'string.min': 'Project name must be at least 1 character long',
        'string.max': 'Project name must not exceed 256 characters',
    }),
});
