const express = require('express');
const router = express.Router();

// Accès aux controllers utilisateur
const userCtrl = require('../controllers/user');

// Routes d'accès pour inscription et login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;