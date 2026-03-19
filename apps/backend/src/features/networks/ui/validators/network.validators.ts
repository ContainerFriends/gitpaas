import Joi from 'joi';

/**
 * Create network request validation schema
 */
export const createNetworkSchema = Joi.object({
    name: Joi.string().required().min(1).max(255).messages({
        'string.empty': 'Network name is required',
        'string.min': 'Network name cannot be empty',
        'string.max': 'Network name cannot exceed 255 characters',
        'any.required': 'Network name is required',
    }),
});

/**
 * Network ID validation schema
 */
export const networkIdSchema = Joi.object({
    id: Joi.string().required().min(1).messages({
        'string.empty': 'Network ID is required',
        'any.required': 'Network ID is required',
    }),
});
