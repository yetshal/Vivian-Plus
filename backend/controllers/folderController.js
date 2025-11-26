const { pool } = require('../config/database');

// Obtener todas las carpetas del usuario
const getFolders = async (req, res) => {
  try {
    const [folders] = await pool.query(
      `SELECT c.*, 
              COUNT(DISTINCT t.id) as total_tareas,
              SUM(CASE WHEN t.estado = 'completada' THEN 1 ELSE 0 END) as tareas_completadas
       FROM carpetas c
       LEFT JOIN tareas t ON c.id = t.carpeta_id
       WHERE c.usuario_id = ?
       GROUP BY c.id
       ORDER BY c.fecha_creacion DESC`,
      [req.userId]
    );
    
    res.json({ folders });
  } catch (error) {
    console.error('Error en getFolders:', error);
    res.status(500).json({ 
      message: 'Error al obtener carpetas',
      error: error.message 
    });
  }
};

// Obtener una carpeta específica
const getFolderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [folders] = await pool.query(
      `SELECT c.*, 
              COUNT(DISTINCT t.id) as total_tareas,
              SUM(CASE WHEN t.estado = 'completada' THEN 1 ELSE 0 END) as tareas_completadas,
              SUM(CASE WHEN t.estado = 'pendiente' THEN 1 ELSE 0 END) as tareas_pendientes,
              SUM(CASE WHEN t.estado = 'en_progreso' THEN 1 ELSE 0 END) as tareas_en_progreso
       FROM carpetas c
       LEFT JOIN tareas t ON c.id = t.carpeta_id
       WHERE c.id = ? AND c.usuario_id = ?
       GROUP BY c.id`,
      [id, req.userId]
    );
    
    if (folders.length === 0) {
      return res.status(404).json({ 
        message: 'Carpeta no encontrada' 
      });
    }
    
    res.json({ folder: folders[0] });
  } catch (error) {
    console.error('Error en getFolderById:', error);
    res.status(500).json({ 
      message: 'Error al obtener carpeta',
      error: error.message 
    });
  }
};

// Crear nueva carpeta
const createFolder = async (req, res) => {
  try {
    const { nombre, descripcion, color, icono } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ 
        message: 'El nombre es obligatorio' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO carpetas (usuario_id, nombre, descripcion, color, icono) VALUES (?, ?, ?, ?, ?)',
      [req.userId, nombre, descripcion || null, color || '#3B82F6', icono || 'folder']
    );
    
    res.status(201).json({
      message: 'Carpeta creada exitosamente',
      folder: {
        id: result.insertId,
        nombre,
        descripcion,
        color: color || '#3B82F6',
        icono: icono || 'folder'
      }
    });
  } catch (error) {
    console.error('Error en createFolder:', error);
    res.status(500).json({ 
      message: 'Error al crear carpeta',
      error: error.message 
    });
  }
};

// Actualizar carpeta
const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, color, icono } = req.body;
    
    // Verificar que la carpeta existe y pertenece al usuario
    const [existing] = await pool.query(
      'SELECT id FROM carpetas WHERE id = ? AND usuario_id = ?',
      [id, req.userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        message: 'Carpeta no encontrada' 
      });
    }
    
    const updates = [];
    const values = [];
    
    if (nombre !== undefined) {
      updates.push('nombre = ?');
      values.push(nombre);
    }
    if (descripcion !== undefined) {
      updates.push('descripcion = ?');
      values.push(descripcion);
    }
    if (color !== undefined) {
      updates.push('color = ?');
      values.push(color);
    }
    if (icono !== undefined) {
      updates.push('icono = ?');
      values.push(icono);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ 
        message: 'No se proporcionaron campos para actualizar' 
      });
    }
    
    values.push(id);
    
    await pool.query(
      `UPDATE carpetas SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    res.json({ message: 'Carpeta actualizada exitosamente' });
  } catch (error) {
    console.error('Error en updateFolder:', error);
    res.status(500).json({ 
      message: 'Error al actualizar carpeta',
      error: error.message 
    });
  }
};

// Eliminar carpeta
const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la carpeta existe y pertenece al usuario
    const [existing] = await pool.query(
      'SELECT id FROM carpetas WHERE id = ? AND usuario_id = ?',
      [id, req.userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        message: 'Carpeta no encontrada' 
      });
    }
    
    // Las tareas se desvinculan automáticamente (ON DELETE SET NULL)
    await pool.query('DELETE FROM carpetas WHERE id = ?', [id]);
    
    res.json({ message: 'Carpeta eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteFolder:', error);
    res.status(500).json({ 
      message: 'Error al eliminar carpeta',
      error: error.message 
    });
  }
};

// Obtener tareas de una carpeta
const getFolderTasks = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la carpeta existe y pertenece al usuario
    const [existing] = await pool.query(
      'SELECT id FROM carpetas WHERE id = ? AND usuario_id = ?',
      [id, req.userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        message: 'Carpeta no encontrada' 
      });
    }
    
    const [tasks] = await pool.query(
      `SELECT t.*, 
              GROUP_CONCAT(DISTINCT et.nombre) as etiquetas
       FROM tareas t
       LEFT JOIN tarea_etiquetas te ON t.id = te.tarea_id
       LEFT JOIN etiquetas et ON te.etiqueta_id = et.id
       WHERE t.carpeta_id = ? AND t.usuario_id = ?
       GROUP BY t.id
       ORDER BY t.fecha_creacion DESC`,
      [id, req.userId]
    );
    
    const formattedTasks = tasks.map(task => ({
      ...task,
      etiquetas: task.etiquetas ? task.etiquetas.split(',') : []
    }));
    
    res.json({ tasks: formattedTasks });
  } catch (error) {
    console.error('Error en getFolderTasks:', error);
    res.status(500).json({ 
      message: 'Error al obtener tareas de la carpeta',
      error: error.message 
    });
  }
};

module.exports = {
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderTasks
};