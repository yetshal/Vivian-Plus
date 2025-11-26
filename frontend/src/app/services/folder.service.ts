import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Folder,
  FoldersResponse,
  FolderResponse,
  CreateFolderRequest,
  UpdateFolderRequest
} from '../models/folder';
import { TasksResponse } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/folders';

  constructor() {}

  /**
   * Obtener todas las carpetas del usuario
   */
  getFolders(): Observable<FoldersResponse> {
    return this.http.get<FoldersResponse>(this.API_URL);
  }

  /**
   * Obtener una carpeta por ID
   */
  getFolderById(id: number): Observable<FolderResponse> {
    return this.http.get<FolderResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear nueva carpeta
   */
  createFolder(folder: CreateFolderRequest): Observable<any> {
    return this.http.post(this.API_URL, folder);
  }

  /**
   * Actualizar carpeta existente
   */
  updateFolder(id: number, folder: UpdateFolderRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, folder);
  }

  /**
   * Eliminar carpeta
   */
  deleteFolder(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  /**
   * Obtener tareas de una carpeta
   */
  getFolderTasks(id: number): Observable<TasksResponse> {
    return this.http.get<TasksResponse>(`${this.API_URL}/${id}/tasks`);
  }
}