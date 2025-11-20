import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  task: Task | null = null;
  isLoading = true;
  taskId: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['id'];
      this.loadTask();
    });
  }

  loadTask(): void {
    this.isLoading = true;
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (response) => {
        this.task = response.task;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar tarea:', error);
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      }
    });
  }

  deleteTask(): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(this.taskId).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error al eliminar tarea:', error);
          alert('Error al eliminar la tarea');
        }
      });
    }
  }

  changeStatus(status: string): void {
    this.taskService.updateTask(this.taskId, { estado: status as any }).subscribe({
      next: () => {
        this.loadTask();
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
        alert('Error al actualizar el estado');
      }
    });
  }

  changePriority(priority: string): void {
    this.taskService.changePriority(this.taskId, priority).subscribe({
      next: () => {
        this.loadTask();
      },
      error: (error) => {
        console.error('Error al actualizar prioridad:', error);
        alert('Error al actualizar la prioridad');
      }
    });
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

  getPriorityIcon(priority: string): string {
    const icons: { [key: string]: string } = {
      'baja': '🟢',
      'media': '🟡',
      'alta': '🔴',
      'urgente': '🔥'
    };
    return icons[priority] || '⚪';
  }
}