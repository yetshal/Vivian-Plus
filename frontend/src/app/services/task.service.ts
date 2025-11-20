import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Task,
  TasksResponse,
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters
} from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/tasks';

  constructor() {}

  /**
   * Obtener todas las tareas del usuario
   */
  getTasks(filters?: TaskFilters): Observable<TasksResponse> {
    let params = new HttpParams();
    
    if (filters?.estado) {
      params = params.set('estado', filters.estado);
    }
    if (filters?.prioridad) {
      params = params.set('prioridad', filters.prioridad);
    }
    if (filters?.etiqueta) {
      params = params.set('etiqueta', filters.etiqueta);
    }
    
    return this.http.get<TasksResponse>(this.API_URL, { params });
  }

  /**
   * Obtener una tarea por ID
   */
  getTaskById(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear nueva tarea
   */
  createTask(task: CreateTaskRequest): Observable<any> {
    return this.http.post(this.API_URL, task);
  }

  /**
   * Actualizar tarea existente
   */
  updateTask(id: number, task: UpdateTaskRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, task);
  }

  /**
   * Eliminar tarea
   */
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  /**
   * Crear tarea con archivos
   */
  createTaskWithFiles(task: CreateTaskRequest, files: File[]): Observable<any> {
    const formData = new FormData();
    
    formData.append('titulo', task.titulo);
    if (task.descripcion) formData.append('descripcion', task.descripcion);
    if (task.prioridad) formData.append('prioridad', task.prioridad);
    if (task.fecha_vencimiento) formData.append('fecha_vencimiento', task.fecha_vencimiento);
    if (task.enlace) formData.append('enlace', task.enlace);
    
    if (task.etiquetas && task.etiquetas.length > 0) {
      formData.append('etiquetas', JSON.stringify(task.etiquetas));
    }
    
    files.forEach(file => {
      formData.append('archivos', file, file.name);
    });
    
    return this.http.post(this.API_URL, formData);
  }

  /**
   * Marcar tarea como completada
   */
  completeTask(id: number): Observable<any> {
    return this.updateTask(id, { estado: 'completada' });
  }

  /**
   * Cambiar prioridad de tarea
   */
  changePriority(id: number, prioridad: string): Observable<any> {
    return this.updateTask(id, { prioridad: prioridad as any });
  }
}