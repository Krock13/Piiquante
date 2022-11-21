// Import du package file system
const fs = require('fs');
const { response } = require('../app');
// Schéma de données pour les sauces
const Sauce = require('../models/Sauce');

// Contoller pour la création de nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
      ...sauceObject,
      // Le UserId vient de auth donc du token pour sécuriser la requête
      userId: req.auth.userId,
      // Pour générer l'URL de l'image de l'objet crée
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
    // Enregistre la sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

// Controler pour la modification d'une sauce
exports.modifySauce = (req, res, next) => {
    // On vérifie la présence éventuelle d'un fichier dans la requête
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    // On retrouve la sauce dans la base de données avec son id
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            // On vérifie que l'utilisateur qui fait la requête est bien l'utilisateur qui a créé la sauce
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non-autorisé' });
            } else {
                // On modifie la sauce dans la base de données
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => response.status(400).json({ error }));
};

// Controler pour la supression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // On vérifie que l'utilisateur qui fait la requête est bien l'utilisateur qui a créé la sauce
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non-autorisé' });
            } else {
                // On efface l'image de la sauce de notre dossier images
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // On supprime la sauce de la base de données
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(500).json({ error }));
                });
            }
        })
        .catch( error => res.status(400).json({ error }));
 };

 // Controller pour chercher une sauce dans la base de données
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

// Controller pour chercher toutes les sauces dans la base de données
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Controler pour les likes (like = 1 pour une like, like =-1 pour un dislike et like = 0 pour une suppression de like/dislike)
exports.likeSauce = (req, res, next) => {
    if (req.body.like === 1) {
        // Recherche de la sauce concernée dans la base de données
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                // Vérification si un like a déjà été ajouté
                if (sauce.usersLiked.includes(req.body.userId)) {
                    res.status(403).json({ message: 'Like déjà ajouté !' });
                } else {
                    // Modifie la sauce pour ajouter +1 aux likes et ajouter le userId sans le tableau usersLiked
                    Sauce.updateOne({ _id: req.params.id }, {$inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId }})
                    .then(() => res.status(200).json({ message: 'Like ajouté !'}))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) {
        // Recherche de la sauce concernée dans la base de données
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            // Vérification si un dislike a déjà été ajouté
            if (sauce.usersLiked.includes(req.body.userId)) {
                res.status(403).json({ message: 'Dislike déjà ajouté !' });
            } else {
                // Modifie la sauce pour ajouter +1 aux dislikes et ajouter le userId sans le tableau usersDisliked
                Sauce.updateOne({ _id: req.params.id }, {$inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId }})
                .then(() => res.status(200).json({ message: 'Dislike ajouté !'}))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
    } else {
        // Recherche de la sauce concernée dans la base de données
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                // Si le userId est trouvé dans userLiked
                if (sauce.usersLiked.includes(req.body.userId)) {
                    // Modifie la sauce en faisant -1 dans les likes et en retirant le userId de usersLiked
                    Sauce.updateOne({ _id: req.params.id }, {$inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Like supprimé !'}))
                        .catch(error => res.status(400).json({ error }));
                }
                // Si le userId est trouvé dans userDisliked
                else if (sauce.usersDisliked.includes(req.body.userId)) {
                    // Modifie la sauce en faisant -1 dans les dislikes et en retirant le userId de usersDisliked
                    Sauce.updateOne({ _id: req.params.id }, {$inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Dislike supprimé !'}))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
    };
};