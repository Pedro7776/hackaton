// Middleware que confere se o usuário mandou um token JWT válido no header
// Authorization: Bearer <token>
const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'segredo_dev');
        req.usuario = payload; // { id, nome, email }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

module.exports = autenticar;
