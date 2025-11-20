import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../../models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = true;
  
  // Filtros
  selectedStatus: TaskStatus | '' = '';
  selectedPriority: TaskPriority | '' = '';
  searchTerm = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response.tasks;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesStatus = !this.selectedStatus || task.estado === this.selectedStatus;
      const matchesPriority = !this.selectedPriority || task.prioridad === this.selectedPriority;
      const matchesSearch = !this.searchTerm || 
        task.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  deleteTask(taskId: number, event: Event): void {
    event.stopPropagation();
    
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error al eliminar tarea:', error);
          alert('Error al eliminar la tarea');
        }
      });
    }
  }

  completeTask(taskId: number, event: Event): void {
    event.stopPropagation();
    
    this.taskService.completeTask(taskId).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error al completar tarea:', error);
        alert('Error al completar la tarea');
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

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.searchTerm = '';
    this.applyFilters();
  }
}