const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DelivryModel = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true, // Champ obligatoire
    },
    code: {
      type: String,
    },
    client_name: {
      type: String,
      required: true, // Ajouté comme obligatoire
    },
    delivery_address: {
      type: String,
      required: true, // Ajouté comme obligatoire
    },
    phone1: {
      type: String,
      required: true, // Ajouté comme obligatoire
    },
    government: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['EnAttente', 'EnDepot', 'EnCours', 'Livré', 'EnRetour'],
      default: 'EnAttente',
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('delivry', DelivryModel);
