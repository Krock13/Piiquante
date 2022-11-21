const multer = require('multer');

// Pour définir l'extension du fichier grâce à son mime type
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // Remplace les espaces par des _ dans le nom de fichier
    const name = file.originalname.split(' ').join('_');
    // Définit l'extension du fichier grâce à son mime type
    const extension = MIME_TYPES[file.mimetype];
    // Création du nom du fichier avant l'enregistrement dans la base de données
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');