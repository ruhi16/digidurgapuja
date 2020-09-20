const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    firstname: Joi.string().min(5).max(30).required(),
    lastname: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(20).required(),    
});




const loginSchema = Joi.object({    
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(20).required(),
    
});


module.exports = {authSchema, loginSchema};