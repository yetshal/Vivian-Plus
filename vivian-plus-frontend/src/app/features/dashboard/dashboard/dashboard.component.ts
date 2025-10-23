import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskStatistics } from '../../core/models/task.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navbar -->
      <nav class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-primary-600">Vivian+</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">Hola, {{ currentUser()?.name }}</span>
              <button
                (click)="logout()"
                class="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p class="text-gray-600 mt-2">Resumen de tus actividades</p>
        </div>

        <!-- Statistics Cards -->
        @if (statistics()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Tasks -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 font-medium">Total de Tareas</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ statistics()!.total_tasks }}</p>
                </div>
                <div class="bg-blue-100 rounded-full p-3">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Completed Tasks -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 font-medium">Completadas</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ statistics()!.completed_tasks }}</p>
                </div>
                <div class="bg-green-100 rounded-full p-3">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Pending Tasks -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 font-medium">Pendientes</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ statistics()!.pending_tasks }}</p>
                </div>
                <div class="bg-yellow-100 rounded-full p-3">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Overdue Tasks -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 font-medium">Atrasadas</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ statistics()!.overdue_tasks }}</p>
                </div>
                <div class="bg-red-100 rounded-full p-3">
                  <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Progreso General</h3>
              <span class="text-2xl font-bold text-primary-600">{{ statistics()!.completion_rate }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div
                class="bg-primary-600 h-4 rounded-full transition-all duration-500"
                [style.width.%]="statistics()!.completion_rate"
              ></div>
            </div>
          </div>
        } @else {
          <div class="text-center py-12">
            <p class="text-gray-500">Cargando estadísticas...</p>
          </div>
        }

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div class="space-y-3">
              
                routerLink="/tasks"
                class="flex items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <svg class="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span class="text-primary-700 font-medium">Ver todas las tareas</span>
              </a>
              <button
                (click)="navigateToTasks()"
                class="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <svg class="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span class="text-green-700 font-medium">Crear nueva tarea</span>
              </button>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Información</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="bg-blue-100 rounded-full p-2 mr-3">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Organiza tus tareas</p>
                  <p class="text-sm text-gray-600">Añade prioridades, etiquetas y fechas límite</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="bg-purple-100 rounded-full p-2 mr-3">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Colabora en equipo</p>
                  <p class="text-sm text-gray-600">Comparte tareas con otros usuarios</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  statistics = signal<TaskStatistics | null>(null);
  currentUser = signal<User | null>(null);

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadCurrentUser();
  }

  loadStatistics(): void {
    this.taskService.getStatistics().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.statistics.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  loadCurrentUser(): void {
    this.currentUser.set(this.authService.getCurrentUserValue());
  }

  navigateToTasks(): void {
    window.location.href = '/tasks';
  }

  logout(): void {
    this.authService.logout()?.subscribe({
      next: () => {
        // El servicio ya maneja la redirección
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        // Aún así cerrar sesión localmente
      }
    });
  }
}