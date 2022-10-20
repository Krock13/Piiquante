const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');

router.post('/', auth, sauceCtrl.createSauce);  
router.get('/', auth, sauceCtrl.getAllSauces);  
router.get('/:id', auth, sauceCtrl.getOneSauce);  
router.put('/:id', auth, sauceCtrl.modifySauce);  
router.delete('/:id', auth, sauceCtrl.deleteSauce);  
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;