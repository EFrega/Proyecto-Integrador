const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // El token se pasa usualmente en los headers como "Authorization"
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // Usar variable de entorno para el secreto JWT
    const jwtSecret = process.env.JWT_SECRET || 'secreto';

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        // Guardamos la información del usuario decodificada del token
        req.user = user;
        next();  // Continuamos con la siguiente función de la ruta
    });
};

module.exports = authenticateToken;