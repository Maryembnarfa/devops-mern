const Joi = require('joi');

// Définition du schéma de validation pour la livraison
const createDelivrySchema = Joi.object({
   
    client_name: Joi.string().min(3).max(50).required(),
    delivery_address: Joi.string().min(5).max(100).required(),
    phone1: Joi.string().pattern(/^[0-9]{8,15}$/).required(), 
    phone2: Joi.string().pattern(/^[0-9]{8,15}$/).optional(), 
    government: Joi.string().min(3).max(50)  .pattern(/^[A-Za-z\s]+$/).required(),
    street: Joi.string().min(3).max(50).required(), 
    status: Joi.string().min(3).max(50).required(),
    distance_km: Joi.string().pattern(/^[0-9]+(\.[0-9]+)?$/), 
    delivery_price: Joi.number().min(0),
    quantity: Joi.number().min(1),
    total_amount: Joi.number().min(0),
    delivery_date: Joi.date(),
    delivery_type: Joi.string().valid('express', 'standard', 'economy')
});

// Fonction pour valider les données de livraison
const validateDelivry = (data) => {
    return createDelivrySchema.validate(data);
};

module.exports = { validateDelivry };
