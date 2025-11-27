-- ====================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - VIVIAN+
-- Sistema de Gestión Avanzada de Actividades
-- Compatible con MariaDB 10.x+
-- ====================================================

-- Crear base de datos
DROP DATABASE IF EXISTS vivian_plus_db;
CREATE DATABASE vivian_plus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vivian_plus_db;

-- ====================================================
-- TABLA: usuarios
-- Almacena la información de los usuarios del sistema
-- ====================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABLA: carpetas
-- Almacena las carpetas para organizar tareas
-- ====================================================
CREATE TABLE carpetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icono VARCHAR(50) DEFAULT 'folder',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABLA: tareas
-- Almacena las tareas creadas por los usuarios
-- ====================================================
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    carpeta_id INT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estado ENUM('pendiente', 'en_progreso', 'completada', 'cancelada') DEFAULT 'pendiente',
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    fecha_vencimiento DATE,
    enlace VARCHAR(500),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_completada TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (carpeta_id) REFERENCES carpetas(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_carpeta (carpeta_id),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad),
    INDEX idx_fecha_vencimiento (fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABLA: etiquetas
-- Almacena las etiquetas/categorías para organizar tareas
-- ====================================================
CREATE TABLE etiquetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_etiqueta_usuario (nombre, usuario_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABLA: tarea_etiquetas
-- Relación muchos a muchos entre tareas y etiquetas
-- ====================================================
CREATE TABLE tarea_etiquetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT NOT NULL,
    etiqueta_id INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tarea_etiqueta (tarea_id, etiqueta_id),
    INDEX idx_tarea (tarea_id),
    INDEX idx_etiqueta (etiqueta_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABLA: archivos
-- Almacena los archivos adjuntos a las tareas
-- ====================================================
CREATE TABLE archivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(100),
    tamanio_archivo INT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
    INDEX idx_tarea (tarea_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABLA: recordatorios
-- Almacena los recordatorios programados para tareas
-- ====================================================
CREATE TABLE recordatorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT NOT NULL,
    fecha_recordatorio DATETIME NOT NULL,
    mensaje TEXT,
    enviado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
    INDEX idx_tarea (tarea_id),
    INDEX idx_fecha_recordatorio (fecha_recordatorio),
    INDEX idx_enviado (enviado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABLA: historial_tareas
-- Registra los cambios realizados en las tareas
-- ====================================================
CREATE TABLE historial_tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT NOT NULL,
    usuario_id INT NOT NULL,
    accion ENUM('crear', 'actualizar', 'eliminar', 'completar') NOT NULL,
    campo_modificado VARCHAR(100),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_tarea (tarea_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABLA: compartir_tareas
-- Permite compartir tareas entre usuarios
-- ====================================================
CREATE TABLE compartir_tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT NOT NULL,
    usuario_propietario_id INT NOT NULL,
    usuario_compartido_id INT NOT NULL,
    permiso ENUM('lectura', 'edicion') DEFAULT 'lectura',
    fecha_compartido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_propietario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_compartido_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_compartir (tarea_id, usuario_compartido_id),
    INDEX idx_tarea (tarea_id),
    INDEX idx_propietario (usuario_propietario_id),
    INDEX idx_compartido (usuario_compartido_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TRIGGERS
-- ====================================================

-- Trigger: Registrar creación de tarea en historial
DELIMITER //
CREATE TRIGGER trg_after_insert_tarea
AFTER INSERT ON tareas
FOR EACH ROW
BEGIN
    INSERT INTO historial_tareas (tarea_id, usuario_id, accion, valor_nuevo)
    VALUES (NEW.id, NEW.usuario_id, 'crear', CONCAT('Tarea creada: ', NEW.titulo));
END//
DELIMITER ;

-- Trigger: Registrar actualización de tarea en historial
DELIMITER //
CREATE TRIGGER trg_after_update_tarea
AFTER UPDATE ON tareas
FOR EACH ROW
BEGIN
    IF NEW.estado != OLD.estado THEN
        INSERT INTO historial_tareas (tarea_id, usuario_id, accion, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.id, NEW.usuario_id, 'actualizar', 'estado', OLD.estado, NEW.estado);
    END IF;
    
    IF NEW.titulo != OLD.titulo THEN
        INSERT INTO historial_tareas (tarea_id, usuario_id, accion, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.id, NEW.usuario_id, 'actualizar', 'titulo', OLD.titulo, NEW.titulo);
    END IF;
END//
DELIMITER ;

-- ====================================================
-- VISTAS
-- ====================================================

-- Vista: Resumen de tareas por usuario
CREATE OR REPLACE VIEW vista_resumen_tareas AS
SELECT 
    u.id AS usuario_id,
    u.nombre AS usuario_nombre,
    COUNT(t.id) AS total_tareas,
    SUM(CASE WHEN t.estado = 'completada' THEN 1 ELSE 0 END) AS tareas_completadas,
    SUM(CASE WHEN t.estado = 'pendiente' THEN 1 ELSE 0 END) AS tareas_pendientes,
    SUM(CASE WHEN t.estado = 'en_progreso' THEN 1 ELSE 0 END) AS tareas_en_progreso,
    SUM(CASE WHEN t.estado = 'cancelada' THEN 1 ELSE 0 END) AS tareas_canceladas,
    SUM(CASE WHEN t.prioridad = 'urgente' THEN 1 ELSE 0 END) AS tareas_urgentes,
    COUNT(DISTINCT t.carpeta_id) AS total_carpetas
FROM usuarios u
LEFT JOIN tareas t ON u.id = t.usuario_id
GROUP BY u.id, u.nombre;

-- Vista: Tareas vencidas
CREATE OR REPLACE VIEW vista_tareas_vencidas AS
SELECT 
    t.id,
    t.titulo,
    t.descripcion,
    t.usuario_id,
    u.nombre AS usuario_nombre,
    u.email AS usuario_email,
    t.fecha_vencimiento,
    DATEDIFF(CURDATE(), t.fecha_vencimiento) AS dias_vencidos,
    t.prioridad,
    t.estado
FROM tareas t
INNER JOIN usuarios u ON t.usuario_id = u.id
WHERE t.fecha_vencimiento < CURDATE() 
  AND t.estado IN ('pendiente', 'en_progreso')
ORDER BY t.fecha_vencimiento ASC;

-- ====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- ====================================================

-- Procedimiento: Obtener estadísticas de un usuario
DELIMITER //
CREATE PROCEDURE sp_estadisticas_usuario(IN p_usuario_id INT)
BEGIN
    SELECT 
        COUNT(*) AS total_tareas,
        SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) AS completadas,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN estado = 'en_progreso' THEN 1 ELSE 0 END) AS en_progreso,
        SUM(CASE WHEN prioridad = 'urgente' THEN 1 ELSE 0 END) AS urgentes,
        SUM(CASE WHEN fecha_vencimiento < CURDATE() AND estado != 'completada' THEN 1 ELSE 0 END) AS vencidas
    FROM tareas
    WHERE usuario_id = p_usuario_id;
END//
DELIMITER ;

-- Procedimiento: Obtener tareas de una carpeta con estadísticas
DELIMITER //
CREATE PROCEDURE sp_tareas_por_carpeta(IN p_carpeta_id INT, IN p_usuario_id INT)
BEGIN
    SELECT 
        t.*,
        GROUP_CONCAT(DISTINCT et.nombre SEPARATOR ',') as etiquetas
    FROM tareas t
    LEFT JOIN tarea_etiquetas te ON t.id = te.tarea_id
    LEFT JOIN etiquetas et ON te.etiqueta_id = et.id
    WHERE t.carpeta_id = p_carpeta_id AND t.usuario_id = p_usuario_id
    GROUP BY t.id
    ORDER BY t.fecha_creacion DESC;
END//
DELIMITER ;

-- ====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ====================================================

CREATE INDEX idx_tareas_usuario_estado ON tareas(usuario_id, estado);
CREATE INDEX idx_tareas_usuario_prioridad ON tareas(usuario_id, prioridad);
CREATE INDEX idx_tareas_fecha_creacion ON tareas(fecha_creacion);
CREATE INDEX idx_carpetas_usuario_nombre ON carpetas(usuario_id, nombre);

-- ====================================================
-- DATOS DE PRUEBA
-- ====================================================

-- Insertar usuario de prueba (contraseña: demo123)
INSERT INTO usuarios (nombre, email, password) VALUES
('Usuario Demo', 'demo@vivianplus.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ4K8VqWzLKxvqLpGqDvvPqGwqvLxZ6W');

-- Insertar carpetas de ejemplo
INSERT INTO carpetas (usuario_id, nombre, descripcion, color, icono) VALUES
(1, 'Trabajo', 'Tareas relacionadas con el trabajo', '#EF4444', 'briefcase'),
(1, 'Personal', 'Tareas personales y del hogar', '#10B981', 'home'),
(1, 'Estudio', 'Proyectos académicos y aprendizaje', '#3B82F6', 'book'),
(1, 'Proyectos', 'Proyectos en desarrollo', '#F59E0B', 'code');

-- Insertar etiquetas de ejemplo
INSERT INTO etiquetas (usuario_id, nombre, color) VALUES
(1, 'Urgente', '#EF4444'),
(1, 'Importante', '#F59E0B'),
(1, 'Programación', '#3B82F6'),
(1, 'Documentación', '#8B5CF6');

-- Insertar tareas de ejemplo
INSERT INTO tareas (usuario_id, carpeta_id, titulo, descripcion, estado, prioridad, fecha_vencimiento) VALUES
(1, 1, 'Completar documentación del proyecto', 'Finalizar la documentación técnica de Vivian+', 'en_progreso', 'alta', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(1, 1, 'Revisar código del backend', 'Hacer code review de las funcionalidades implementadas', 'pendiente', 'media', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
(1, 3, 'Preparar presentación final', 'Crear slides para la presentación del proyecto', 'pendiente', 'urgente', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
(1, 2, 'Comprar víveres', 'Hacer lista de compras y ir al supermercado', 'pendiente', 'baja', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(1, 4, 'Implementar sistema de carpetas', 'Desarrollar funcionalidad de organización por carpetas', 'completada', 'alta', CURDATE());

-- Relacionar tareas con etiquetas
INSERT INTO tarea_etiquetas (tarea_id, etiqueta_id) VALUES
(1, 2), -- Importante
(1, 4), -- Documentación
(2, 3), -- Programación
(3, 1), -- Urgente
(5, 3); -- Programación

-- ====================================================
-- VERIFICACIÓN Y FINALIZACIÓN
-- ====================================================

-- Mostrar estadísticas de la base de datos
SELECT 
    'Tablas creadas' AS tipo,
    COUNT(*) AS cantidad
FROM information_schema.tables 
WHERE table_schema = 'vivian_plus_db' AND table_type = 'BASE TABLE'

UNION ALL

SELECT 
    'Vistas creadas' AS tipo,
    COUNT(*) AS cantidad
FROM information_schema.views 
WHERE table_schema = 'vivian_plus_db'

UNION ALL

SELECT 
    'Procedimientos' AS tipo,
    COUNT(*) AS cantidad
FROM information_schema.routines 
WHERE routine_schema = 'vivian_plus_db' AND routine_type = 'PROCEDURE'

UNION ALL

SELECT 
    'Triggers' AS tipo,
    COUNT(*) AS cantidad
FROM information_schema.triggers 
WHERE trigger_schema = 'vivian_plus_db';

-- Mensaje de finalización
SELECT '✅ Base de datos Vivian+ creada exitosamente en MariaDB' AS mensaje;
SELECT 'Usuario demo: demo@vivianplus.com | Contraseña: demo123' AS credenciales;