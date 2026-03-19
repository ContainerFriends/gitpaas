import Joi from 'joi';

/**
 * Container ID validation schema
 */
export const containerIdSchema = Joi.object({
    id: Joi.string().required().min(1).messages({
        'string.empty': 'Container ID is required',
        'any.required': 'Container ID is required',
    }),
});
