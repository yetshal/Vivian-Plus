import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/users';

  constructor() {}

  /**
   * Obtener perfil del usuario con estadísticas
   */
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_URL}/profile`);
  }

  /**
   * Actualizar perfil del usuario
   */
  updateProfile(nombre: string): Observable<any> {
    return this.http.put(`${this.API_URL}/profile`, { nombre });
  }

  /**
   * Cambiar contraseña
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.API_URL}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  /**
   * Eliminar cuenta
   */
  deleteAccount(password: string): Observable<any> {
    return this.http.request('delete', `${this.API_URL}/account`, {
      body: { password }
    });
  }
}