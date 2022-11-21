const express = require('express');
// Middleware d'authentification
const auth = require('../middleware/auth');
// Middleware de gestion des fichiers
const multer = require('../middleware/multer-config');
// Import des controllers
const sauceCtrl = require('../controllers/sauces');

const router = express.Router();

// Ajout des controllers aux routes (incluant le middleware d'authentification et la gestion de fichiers)
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;