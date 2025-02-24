const Joi = require('joi');

// Schéma de validation pour la série du véhicule
const createVehicleSerieSchema = Joi.object({
    serie: Joi.string()
        .pattern(/^[A-Za-z0-9-]+$/) // Autorise les lettres, chiffres et tirets
        .min(5) // Longueur minimale de 5 caractères
        .max(20) // Longueur maximale de 20 caractères
        .required() // Champ obligatoire
        .messages({
            'string.pattern.base': 'La série doit contenir uniquement des lettres, chiffres et tirets (-)',
            'string.min': 'La série doit contenir au moins 5 caractères',
            'string.max': 'La série ne doit pas dépasser 20 caractères',
            'any.required': 'La série est obligatoire',
        }),
});

// Fonction pour valider la série du véhicule
const validateVehicleSerie = (data) => {
    return createVehicleSerieSchema.validate(data);
};

module.exports = { validateVehicleSerie };