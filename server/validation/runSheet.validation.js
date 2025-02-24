const Joi = require('joi');

const createRunSheetSchema = Joi.object({
    serie: Joi.string().min(3).max(50).required(),
    name_livreur: Joi.string().min(3).max(50).required(),
    livraisons: Joi.array().items(Joi.string()).required(), // Validation pour un tableau de chaînes


});

const validateRunSheet = (data) => {
    return createRunSheetSchema.validate(data);
};

module.exports = { validateRunSheet };