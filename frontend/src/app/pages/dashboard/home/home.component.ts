import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { UserStats } from '../../../models/user';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private taskService = inject(TaskService);

  userName = '';
  stats: UserStats | null = null;
  recentTasks: Task[] = [];
  urgentTasks: Task[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Cargar perfil y estadísticas
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.userName = response.user.nombre;
        this.stats = response.stats || null;
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
      }
    });

    // Cargar tareas recientes
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.recentTasks = response.tasks.slice(0, 5);
        this.urgentTasks = response.tasks.filter(t => t.prioridad === 'urgente').slice(0, 3);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
        this.isLoading = false;
      }
    });
  }

  getCompletionPercentage(): number {
    if (!this.stats || this.stats.total_tareas === 0) return 0;
    return Math.round((this.stats.tareas_completadas / this.stats.total_tareas) * 100);
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'baja': 'badge-info',
      'media': 'badge-warning',
      'alta': 'badge-danger',
      'urgente': 'bg-purple-100 text-purple-800'
    };
    return classes[priority] || 'badge-info';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pendiente': 'badge-warning',
      'en_progreso': 'badge-info',
      'completada': 'badge-success',
      'cancelada': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'badge-info';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Progreso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return texts[status] || status;
  }

  getPriorityText(priority: string): string {
    const texts: { [key: string]: string } = {
      'baja': 'Baja',
      'media': 'Media',
      'alta': 'Alta',
      'urgente': 'Urgente'
    };
    return texts[priority] || priority;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }
}