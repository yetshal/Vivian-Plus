export interface Folder {
  id: number;
  usuario_id: number;
  nombre: string;
  descripcion?: string;
  color: string;
  icono: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  total_tareas?: number;
  tareas_completadas?: number;
  tareas_pendientes?: number;
  tareas_en_progreso?: number;
}

export interface CreateFolderRequest {
  nombre: string;
  descripcion?: string;
  color?: string;
  icono?: string;
}

export interface UpdateFolderRequest {
  nombre?: string;
  descripcion?: string;
  color?: string;
  icono?: string;
}

export interface FoldersResponse {
  folders: Folder[];
}

export interface FolderResponse {
  folder: Folder;
}

// Iconos disponibles para carpetas
export const FOLDER_ICONS = [
  { name: 'folder', label: 'Carpeta', emoji: '📁' },
  { name: 'briefcase', label: 'Maletín', emoji: '💼' },
  { name: 'home', label: 'Casa', emoji: '🏠' },
  { name: 'book', label: 'Libro', emoji: '📚' },
  { name: 'code', label: 'Código', emoji: '💻' },
  { name: 'heart', label: 'Corazón', emoji: '❤️' },
  { name: 'star', label: 'Estrella', emoji: '⭐' },
  { name: 'rocket', label: 'Cohete', emoji: '🚀' },
  { name: 'camera', label: 'Cámara', emoji: '📷' },
  { name: 'music', label: 'Música', emoji: '🎵' },
  { name: 'gift', label: 'Regalo', emoji: '🎁' },
  { name: 'target', label: 'Objetivo', emoji: '🎯' }
];

// Colores predefinidos para carpetas
export const FOLDER_COLORS = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Amarillo', value: '#F59E0B' },
  { name: 'Morado', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Naranja', value: '#F97316' },
  { name: 'Gris', value: '#6B7280' }
];