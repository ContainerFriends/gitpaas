import Joi from 'joi';

/**
 * Health query validation schema
 */
export const healthQuerySchema = Joi.object({
    token: Joi.string().required().messages({
        'string.base': 'Token must be a string',
        'any.required': 'Token is required',
    }),
});
