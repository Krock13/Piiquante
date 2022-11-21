const mongoose = require('mongoose');
// Plugin qui ajoute une validation de pré-enregistrement pour les champs uniques dans un schéma Mongoose. (facilite la gestion d'erreur)
const uniqueValidator = require('mongoose-unique-validator');

// Schéma d'utilisateur
const userSchema = mongoose.Schema({
  // Email unique pour éviter qu'un même email serve pour plusieurs comptes
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);