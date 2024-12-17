const Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config();

const envSchema = Joi.object({
    MONGO_URI: Joi.string().uri().required(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Environment variable validation error: ${error.message}`);
}

const config = {
    mongoURI: envVars.MONGO_URI,
};

module.exports = config;
