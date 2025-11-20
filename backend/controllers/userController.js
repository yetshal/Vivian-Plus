const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// Obtener perfil del usuario
const getUserProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, nombre, email, fecha_creacion FROM usuarios WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    // Obtener estadísticas de tareas
    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as total_tareas,
        SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as tareas_completadas,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as tareas_pendientes,
        SUM(CASE WHEN estado = 'en_progreso' THEN 1 ELSE 0 END) as tareas_en_progreso
       FROM tareas WHERE usuario_id = ?`,
      [req.userId]
    );

    res.json({
      user: users[0],
      stats: stats[0]
    });
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    res.status(500).json({ 
      message: 'Error al obtener perfil',
      error: error.message 
    });
  }
};

// Actualizar perfil del usuario
const updateUserProfile = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ 
        message: 'El nombre es obligatorio' 
      });
    }

    await pool.query(
      'UPDATE usuarios SET nombre = ? WHERE id = ?',
      [nombre, req.userId]
    );

    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateUserProfile:', error);
    res.status(500).json({ 
      message: 'Error al actualizar perfil',
      error: error.message 
    });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Contraseña actual y nueva son obligatorias' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Obtener contraseña actual del usuario
    const [users] = await pool.query(
      'SELECT password FROM usuarios WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Contraseña actual incorrecta' 
      });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await pool.query(
      'UPDATE usuarios SET password = ? WHERE id = ?',
      [hashedPassword, req.userId]
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en changePassword:', error);
    res.status(500).json({ 
      message: 'Error al cambiar contraseña',
      error: error.message 
    });
  }
};

// Eliminar cuenta de usuario
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ 
        message: 'La contraseña es obligatoria para eliminar la cuenta' 
      });
    }

    // Verificar contraseña
    const [users] = await pool.query(
      'SELECT password FROM usuarios WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, users[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Contraseña incorrecta' 
      });
    }

    // Eliminar usuario (las tareas se eliminan en cascada)
    await pool.query('DELETE FROM usuarios WHERE id = ?', [req.userId]);

    res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteAccount:', error);
    res.status(500).json({ 
      message: 'Error al eliminar cuenta',
      error: error.message 
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount
};