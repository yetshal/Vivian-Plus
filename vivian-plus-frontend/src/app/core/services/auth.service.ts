import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest 
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signal para el estado de autenticación
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Cargar usuario del localStorage al iniciar
   */
  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  /**
   * Registro de usuario
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          if (response.success) {
            this.handleAuthentication(response);
          }
        })
      );
  }

  /**
   * Login de usuario
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.handleAuthentication(response);
          }
        })
      );
  }

  /**
   * Logout
   */
  logout(): Observable<ApiResponse> | void {
    const token = this.getToken();
    
    if (token) {
      return this.http.post<ApiResponse>(`${this.apiUrl}/logout`, {})
        .pipe(
          tap(() => {
            this.clearAuthentication();
          })
        );
    } else {
      this.clearAuthentication();
    }
  }

  /**
   * Obtener usuario actual del servidor
   */
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        })
      );
  }

  /**
   * Actualizar perfil
   */
  updateProfile(data: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/profile`, data)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        })
      );
  }

  /**
   * Cambiar contraseña
   */
  changePassword(data: { current_password: string; password: string; password_confirmation: string }): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/change-password`, data);
  }

  /**
   * Manejar autenticación exitosa
   */
  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    this.currentUserSubject.next(response.data.user);
    this.isAuthenticated.set(true);
  }

  /**
   * Limpiar datos de autenticación
   */
  private clearAuthentication(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Obtener token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtener usuario actual (sincrónico)
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}