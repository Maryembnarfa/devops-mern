const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleModel = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true, // Champ obligatoire
        },
        serie:
        {
            type: String,
            required: true,
            unique: true
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('vehicle', VehicleModel)