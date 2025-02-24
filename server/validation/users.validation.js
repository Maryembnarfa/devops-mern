const Joi = require('joi');

// Fonction de validation personnalisée pour vérifier si le username est un email ou un numéro de téléphone
const validateUsername = (value, helpers) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Regex pour vérifier un email
    const isPhone = /^\d{8}$/.test(value); // Regex pour vérifier un numéro de téléphone (8 chiffres)

    if (!isEmail && !isPhone) {
        return helpers.error('any.invalid', {
            message: 'Le username doit être un email ou un numéro de téléphone valide.',
        });
    }

    return value; // Retourner la valeur si elle est valide
};
const createUserSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    username: Joi.string().required().custom(validateUsername, 'Validation personnalisée pour email ou téléphone'),
    password: Joi.string().min(6).required(),
    role: Joi.string().required()
});

const validateUser = (data) => {
    return createUserSchema.validate(data);
};

module.exports = { validateUser };
