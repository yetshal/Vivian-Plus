import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FolderService } from '../../../services/folder.service';
import { TaskService } from '../../../services/task.service';
import { Folder } from '../../../models/folder';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-folder-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private folderService = inject(FolderService);
  private taskService = inject(TaskService);

  folder: Folder | null = null;
  tasks: Task[] = [];
  isLoading = true;
  folderId: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.folderId = +params['id'];
      this.loadFolder();
      this.loadTasks();
    });
  }

  loadFolder(): void {
    this.folderService.getFolderById(this.folderId).subscribe({
      next: (response) => {
        this.folder = response.folder;
      },
      error: (error) => {
        console.error('Error al cargar carpeta:', error);
        this.router.navigate(['/folders']);
      }
    });
  }

  loadTasks(): void {
    this.isLoading = true;
    this.folderService.getFolderTasks(this.folderId).subscribe({
      next: (response) => {
        this.tasks = response.tasks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
        this.isLoading = false;
      }
    });
  }

  deleteFolder(): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta carpeta? Las tareas se mantendrán sin carpeta.')) {
      this.folderService.deleteFolder(this.folderId).subscribe({
        next: () => {
          this.router.navigate(['/folders']);
        },
        error: (error) => {
          console.error('Error al eliminar carpeta:', error);
          alert('Error al eliminar la carpeta');
        }
      });
    }
  }

  deleteTask(taskId: number, event: Event): void {
    event.stopPropagation();
    
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
          this.loadFolder(); // Recargar estadísticas
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
        this.loadFolder(); // Recargar estadísticas
      },
      error: (error) => {
        console.error('Error al completar tarea:', error);
        alert('Error al completar la tarea');
      }
    });
  }

  getIconEmoji(icono: string): string {
    const icons: { [key: string]: string } = {
      'folder': '📁',
      'briefcase': '💼',
      'home': '🏠',
      'book': '📚',
      'code': '💻',
      'heart': '❤️',
      'star': '⭐',
      'rocket': '🚀',
      'camera': '📷',
      'music': '🎵',
      'gift': '🎁',
      'target': '🎯'
    };
    return icons[icono] || '📁';
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

  getCompletionPercentage(): number {
    if (!this.folder || !this.folder.total_tareas || this.folder.total_tareas === 0) return 0;
    return Math.round(((this.folder.tareas_completadas || 0) / this.folder.total_tareas) * 100);
  }
}