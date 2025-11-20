const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/users/profile - Obtener perfil del usuario con estadísticas
router.get('/profile', getUserProfile);

// PUT /api/users/profile - Actualizar perfil del usuario
router.put('/profile', updateUserProfile);

// PUT /api/users/change-password - Cambiar contraseña
router.put('/change-password', changePassword);

// DELETE /api/users/account - Eliminar cuenta
router.delete('/account', deleteAccount);

module.exports = router;