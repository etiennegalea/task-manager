const Joi = require('joi');

const taskSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .required()
        .messages({
            'string.empty': 'Task name is required',
            'string.min': 'Task name must be at least 3 characters long',
        }),
    completed: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Completed must be a boolean value',
        }),
});

module.exports = taskSchema;
