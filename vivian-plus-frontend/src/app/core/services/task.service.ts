import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest,
  TaskStatistics 
} from '../models/task.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las tareas con filtros opcionales
   */
  getTasks(filters?: {
    is_completed?: boolean;
    priority_id?: number;
    tag_id?: number;
    overdue?: boolean;
    due_today?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Observable<PaginatedResponse<Task>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<Task>>(this.apiUrl, { params });
  }

  /**
   * Obtener una tarea específica
   */
  getTask(id: number): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nueva tarea
   */
  createTask(data: CreateTaskRequest): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(this.apiUrl, data);
  }

  /**
   * Actualizar tarea
   */
  updateTask(id: number, data: UpdateTaskRequest): Observable<ApiResponse<Task>> {
    return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Eliminar tarea
   */
  deleteTask(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Marcar/desmarcar tarea como completada
   */
  toggleComplete(id: number): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(`${this.apiUrl}/${id}/toggle-complete`, {});
  }

  /**
   * Adjuntar archivo/enlace
   */
  addAttachment(taskId: number, formData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${taskId}/attachments`, formData);
  }

  /**
   * Eliminar adjunto
   */
  removeAttachment(taskId: number, attachmentId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${taskId}/attachments/${attachmentId}`);
  }

  /**
   * Obtener estadísticas
   */
  getStatistics(): Observable<ApiResponse<TaskStatistics>> {
    return this.http.get<ApiResponse<TaskStatistics>>(`${this.apiUrl}/statistics`);
  }
}