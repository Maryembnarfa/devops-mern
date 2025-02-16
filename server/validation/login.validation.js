const Joi = require('joi');

const createUserSchema = Joi.object({
    
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  
});

const validateLogin = (data) => {
    return createUserSchema.validate(data);
};

module.exports = { validateLogin };
