const express = require('express');
const router = express.Router();
const {
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderTasks
} = require('../controllers/folderController');
const { verifyToken } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/folders - Obtener todas las carpetas del usuario
router.get('/', getFolders);

// GET /api/folders/:id - Obtener una carpeta específica
router.get('/:id', getFolderById);

// POST /api/folders - Crear nueva carpeta
router.post('/', createFolder);

// PUT /api/folders/:id - Actualizar carpeta
router.put('/:id', updateFolder);

// DELETE /api/folders/:id - Eliminar carpeta
router.delete('/:id', deleteFolder);

// GET /api/folders/:id/tasks - Obtener tareas de una carpeta
router.get('/:id/tasks', getFolderTasks);

module.exports = router;