const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RunSheetModel = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true, // Champ obligatoire
        },
        code: {
            type: String,
        },
        serie: {
            type: String,
            required: true, // Ajouté comme obligatoire
        },
        name_livreur: {
            type: String,
            required: true, // Ajouté comme obligatoire
        },
        livraisons: [{
            type: String, // Stocker les codes des livraisons
            required: true,
        }],


    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('runSheet', RunSheetModel);
