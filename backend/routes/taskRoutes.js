const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware');

// Configuración de Multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/tasks - Obtener todas las tareas del usuario
router.get('/', getTasks);

// GET /api/tasks/:id - Obtener una tarea específica
router.get('/:id', getTaskById);

// POST /api/tasks - Crear nueva tarea (con posibilidad de subir archivos)
router.post('/', upload.array('archivos', 5), createTask);

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', deleteTask);

module.exports = router;