export interface User {
  id: number;
  nombre: string;
  email: string;
  fecha_creacion?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface UserProfile {
  user: User;
  stats?: UserStats;
}

export interface UserStats {
  total_tareas: number;
  tareas_completadas: number;
  tareas_pendientes: number;
  tareas_en_progreso: number;
}