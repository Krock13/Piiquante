require('dotenv').config();
// Package pour le cryptage de mot de passe
const bcrypt = require('bcrypt');
// Jsonwebtoken pour la gestion des tokens
const jwt = require('jsonwebtoken');

// Modèle "User" pour la création de nouvel utilisateur
const User = require('../models/User');

// Controler pour la création d'un compte utilisateur
exports.signup = (req, res, next) => {
    // Cryptage du mot de passe avant l'enregistrement dans la base de données
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Controler pour la connexion à un compte utilisateur
exports.login = (req, res, next) => {
    // Recherche l'utilisateur grâce à son adresse email dans la base de données
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'existe pas
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        // Création du token d'authentification
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};