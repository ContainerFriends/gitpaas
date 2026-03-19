import Joi from 'joi';

/**
 * Volume name validation schema
 */
export const volumeNameSchema = Joi.object({
    name: Joi.string().required().min(1).messages({
        'string.empty': 'Volume name is required',
        'any.required': 'Volume name is required',
    }),
});
