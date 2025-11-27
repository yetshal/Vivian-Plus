const { pool } = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

// Obtener todas las tareas del usuario
const getTasks = async (req, res) => {
  try {
    const { estado, prioridad, etiqueta } = req.query;
    
    let query = `
      SELECT t.*, 
             GROUP_CONCAT(DISTINCT et.nombre) as etiquetas,
             GROUP_CONCAT(DISTINCT a.nombre_archivo) as archivos
      FROM tareas t
      LEFT JOIN tarea_etiquetas te ON t.id = te.tarea_id
      LEFT JOIN etiquetas et ON te.etiqueta_id = et.id
      LEFT JOIN archivos a ON t.id = a.tarea_id
      WHERE t.usuario_id = ?
    `;
    
    const params = [req.userId];
    
    // Filtros opcionales
    if (estado) {
      query += ' AND t.estado = ?';
      params.push(estado);
    }
    if (prioridad) {
      query += ' AND t.prioridad = ?';
      params.push(prioridad);
    }
    
    query += ' GROUP BY t.id ORDER BY t.fecha_creacion DESC';
    
    const [tasks] = await pool.query(query, params);
    
    // Formatear etiquetas y archivos como arrays
    const formattedTasks = tasks.map(task => ({
      ...task,
      etiquetas: task.etiquetas ? task.etiquetas.split(',') : [],
      archivos: task.archivos ? task.archivos.split(',') : []
    }));
    
    res.json({ tasks: formattedTasks });
  } catch (error) {
    console.error('Error en getTasks:', error);
    res.status(500).json({ 
      message: 'Error al obtener tareas',
      error: error.message 
    });
  }
};

// Obtener una tarea específica
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [tasks] = await pool.query(
      `SELECT t.*, 
              c.nombre as carpeta_nombre,
              c.color as carpeta_color,
              c.icono as carpeta_icono,
              GROUP_CONCAT(DISTINCT et.nombre) as etiquetas,
              GROUP_CONCAT(DISTINCT a.nombre_archivo) as archivos,
              GROUP_CONCAT(DISTINCT a.ruta_archivo) as rutas_archivos,
              GROUP_CONCAT(DISTINCT a.id) as archivos_ids
       FROM tareas t
       LEFT JOIN carpetas c ON t.carpeta_id = c.id
       LEFT JOIN tarea_etiquetas te ON t.id = te.tarea_id
       LEFT JOIN etiquetas et ON te.etiqueta_id = et.id
       LEFT JOIN archivos a ON t.id = a.tarea_id
       WHERE t.id = ? AND t.usuario_id = ?
       GROUP BY t.id`,
      [id, req.userId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ 
        message: 'Tarea no encontrada' 
      });
    }
    
    // Procesar las rutas de archivos para que sean accesibles desde el frontend
    const task = {
      ...tasks[0],
      etiquetas: tasks[0].etiquetas ? tasks[0].etiquetas.split(',') : [],
      archivos: tasks[0].archivos ? tasks[0].archivos.split(',') : [],
      rutas_archivos: tasks[0].rutas_archivos ? tasks[0].rutas_archivos.split(',').map(ruta => {
        // Extraer solo el nombre del archivo de la ruta completa
        const fileName = ruta.split('\\').pop().split('/').pop();
        return fileName;
      }) : [],
      archivos_ids: tasks[0].archivos_ids ? tasks[0].archivos_ids.split(',') : []
    };
    
    res.json({ task });
  } catch (error) {
    console.error('Error en getTaskById:', error);
    res.status(500).json({ 
      message: 'Error al obtener tarea',
      error: error.message 
    });
  }
};

// Crear nueva tarea
const createTask = async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, fecha_vencimiento, enlace, etiquetas, carpeta_id } = req.body;
    
    if (!titulo) {
      return res.status(400).json({ 
        message: 'El título es obligatorio' 
      });
    }
    
    // Formatear fecha si existe
    let formattedDate = null;
    if (fecha_vencimiento) {
      const date = new Date(fecha_vencimiento);
      formattedDate = date.toISOString().split('T')[0];
    }
    
    // Insertar tarea
    const [result] = await pool.query(
      `INSERT INTO tareas (usuario_id, carpeta_id, titulo, descripcion, prioridad, fecha_vencimiento, enlace) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.userId, carpeta_id || null, titulo, descripcion || null, prioridad || 'media', formattedDate, enlace || null]
    );
    
    const tareaId = result.insertId;
    
    // Agregar etiquetas si existen
    if (etiquetas && Array.isArray(etiquetas)) {
      for (const nombreEtiqueta of etiquetas) {
        // Buscar o crear etiqueta
        let [etiqueta] = await pool.query(
          'SELECT id FROM etiquetas WHERE nombre = ? AND usuario_id = ?',
          [nombreEtiqueta, req.userId]
        );
        
        if (etiqueta.length === 0) {
          const [nuevaEtiqueta] = await pool.query(
            'INSERT INTO etiquetas (nombre, usuario_id) VALUES (?, ?)',
            [nombreEtiqueta, req.userId]
          );
          etiqueta = [{ id: nuevaEtiqueta.insertId }];
        }
        
        // Relacionar etiqueta con tarea
        await pool.query(
          'INSERT INTO tarea_etiquetas (tarea_id, etiqueta_id) VALUES (?, ?)',
          [tareaId, etiqueta[0].id]
        );
      }
    }
    
    // Manejar archivos subidos
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.query(
          'INSERT INTO archivos (tarea_id, nombre_archivo, ruta_archivo, tipo_archivo) VALUES (?, ?, ?, ?)',
          [tareaId, file.originalname, file.path, file.mimetype]
        );
      }
    }
    
    res.status(201).json({
      message: 'Tarea creada exitosamente',
      task: {
        id: tareaId,
        titulo,
        descripcion,
        prioridad: prioridad || 'media',
        estado: 'pendiente'
      }
    });
  } catch (error) {
    console.error('Error en createTask:', error);
    res.status(500).json({ 
      message: 'Error al crear tarea',
      error: error.message 
    });
  }
};

// Actualizar tarea
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, prioridad, estado, fecha_vencimiento, enlace, carpeta_id, etiquetas } = req.body;
    
    // Verificar que la tarea existe y pertenece al usuario
    const [existing] = await pool.query(
      'SELECT id FROM tareas WHERE id = ? AND usuario_id = ?',
      [id, req.userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        message: 'Tarea no encontrada' 
      });
    }
    
    // Construir query dinámicamente solo con campos proporcionados
    const updates = [];
    const values = [];
    
    if (titulo !== undefined) {
      updates.push('titulo = ?');
      values.push(titulo);
    }
    if (descripcion !== undefined) {
      updates.push('descripcion = ?');
      values.push(descripcion);
    }
    if (prioridad !== undefined) {
      updates.push('prioridad = ?');
      values.push(prioridad);
    }
    if (estado !== undefined) {
      updates.push('estado = ?');
      values.push(estado);
      
      // Si se marca como completada, agregar fecha_completada
      if (estado === 'completada') {
        updates.push('fecha_completada = NOW()');
      }
    }
    if (fecha_vencimiento !== undefined) {
      updates.push('fecha_vencimiento = ?');
      // Convertir fecha ISO a formato DATE de MySQL (YYYY-MM-DD)
      if (fecha_vencimiento) {
        const date = new Date(fecha_vencimiento);
        const formattedDate = date.toISOString().split('T')[0];
        values.push(formattedDate);
      } else {
        values.push(null);
      }
    }
    if (enlace !== undefined) {
      updates.push('enlace = ?');
      values.push(enlace);
    }
    if (carpeta_id !== undefined) {
      updates.push('carpeta_id = ?');
      values.push(carpeta_id || null);
    }
    
    if (updates.length === 0 && !etiquetas) {
      return res.status(400).json({ 
        message: 'No se proporcionaron campos para actualizar' 
      });
    }
    
    // Actualizar tarea si hay cambios
    if (updates.length > 0) {
      values.push(id);
      await pool.query(
        `UPDATE tareas SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    // Actualizar etiquetas si se proporcionaron
    if (etiquetas && Array.isArray(etiquetas)) {
      // Eliminar etiquetas existentes
      await pool.query('DELETE FROM tarea_etiquetas WHERE tarea_id = ?', [id]);
      
      // Agregar nuevas etiquetas
      for (const nombreEtiqueta of etiquetas) {
        // Buscar o crear etiqueta
        let [etiqueta] = await pool.query(
          'SELECT id FROM etiquetas WHERE nombre = ? AND usuario_id = ?',
          [nombreEtiqueta, req.userId]
        );
        
        if (etiqueta.length === 0) {
          const [nuevaEtiqueta] = await pool.query(
            'INSERT INTO etiquetas (nombre, usuario_id) VALUES (?, ?)',
            [nombreEtiqueta, req.userId]
          );
          etiqueta = [{ id: nuevaEtiqueta.insertId }];
        }
        
        // Relacionar etiqueta con tarea
        await pool.query(
          'INSERT INTO tarea_etiquetas (tarea_id, etiqueta_id) VALUES (?, ?)',
          [id, etiqueta[0].id]
        );
      }
    }
    
    res.json({ message: 'Tarea actualizada exitosamente' });
  } catch (error) {
    console.error('Error en updateTask:', error);
    res.status(500).json({ 
      message: 'Error al actualizar tarea',
      error: error.message 
    });
  }
};

// Eliminar tarea
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la tarea existe y pertenece al usuario
    const [existing] = await pool.query(
      'SELECT id FROM tareas WHERE id = ? AND usuario_id = ?',
      [id, req.userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        message: 'Tarea no encontrada' 
      });
    }
    
    // Eliminar archivos físicos asociados
    const [archivos] = await pool.query(
      'SELECT ruta_archivo FROM archivos WHERE tarea_id = ?',
      [id]
    );
    
    for (const archivo of archivos) {
      try {
        await fs.unlink(archivo.ruta_archivo);
      } catch (err) {
        console.error('Error al eliminar archivo:', err);
      }
    }
    
    // Eliminar tarea (las relaciones se eliminan en cascada)
    await pool.query('DELETE FROM tareas WHERE id = ?', [id]);
    
    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteTask:', error);
    res.status(500).json({ 
      message: 'Error al eliminar tarea',
      error: error.message 
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};