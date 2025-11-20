export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente';

export interface Task {
  id: number;
  usuario_id: number;
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
}

export interface UpdateTaskRequest {
  titulo?: string;
  descripcion?: string;
  prioridad?: TaskPriority;
  estado?: TaskStatus;
  fecha_vencimiento?: string;
  enlace?: string;
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