require('dotenv').config();
// Jsonwebtoken pour la gestion des tokens
const jwt = require('jsonwebtoken');

// Middleware d'authentification
module.exports = (req, res, next) => {
    try {
        // Récupération du token de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Décode le token en utilisant jsonwebtoken + la clé de cryptage
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        // Récupération du userId dans le token
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
