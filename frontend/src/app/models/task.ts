export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente';

export interface Task {
  id: number;
  usuario_id: number;
  carpeta_id?: number;
  carpeta_nombre?: string;
  carpeta_color?: string;
  carpeta_icono?: string;
  titulo: string;
  descripcion?: string;
  estado: TaskStatus;
  prioridad: TaskPriority;
  fecha_vencimiento?: string;
  enlace?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_completada?: string;
  etiquetas: string[];
  archivos: string[];
  rutas_archivos?: string[];
}

export interface CreateTaskRequest {
  titulo: string;
  descripcion?: string;
  prioridad?: TaskPriority;
  fecha_vencimiento?: string;
  enlace?: string;
  etiquetas?: string[];
  carpeta_id?: number;
}

export interface UpdateTaskRequest {
  titulo?: string;
  descripcion?: string;
  prioridad?: TaskPriority;
  estado?: TaskStatus;
  fecha_vencimiento?: string;
  enlace?: string;
  carpeta_id?: number;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
}

export interface TaskFilters {
  estado?: TaskStatus;
  prioridad?: TaskPriority;
  etiqueta?: string;
}