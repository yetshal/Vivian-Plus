const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Acceso denegado. No se proporcionó token de autenticación.' 
      });
    }

    // El formato esperado es: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Formato de token inválido.' 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar información del usuario al request
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expirado. Por favor, inicia sesión nuevamente.' 
      });
    }
    
    return res.status(401).json({ 
      message: 'Token inválido.',
      error: error.message 
    });
  }
};

// Middleware opcional para verificar si el usuario es el propietario de un recurso
const verifyOwnership = (req, res, next) => {
  // Este middleware se puede usar después de verifyToken
  // para verificar si el usuario es dueño del recurso que intenta modificar
  next();
};

module.exports = { verifyToken, verifyOwnership };