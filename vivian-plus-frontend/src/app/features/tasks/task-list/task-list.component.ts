import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { PriorityService } from '../../../core/services/priority.service';
import { TagService } from '../../../core/services/tag.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task } from '../../../core/models/task.model';
import { Priority } from '../../../core/models/priority.model';
import { Tag } from '../../../core/models/tag.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TaskItemComponent, TaskFormComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navbar -->
      <nav class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex items-center space-x-8">
              <h1 class="text-2xl font-bold text-primary-600">Vivian+</h1>
              <a routerLink="/dashboard" class="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </a>
              <a routerLink="/tasks" class="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
                Tareas
              </a>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">{{ currentUser()?.name }}</span>
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
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Mis Tareas</h2>
            <p class="text-gray-600 mt-2">Gestiona tus actividades diarias</p>
          </div>
          <button
            (click)="showTaskForm.set(true)"
            class="btn-primary flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nueva Tarea
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select [(ngModel)]="filters.is_completed" (change)="applyFilters()" class="input-field">
                <option [ngValue]="undefined">Todas</option>
                <option [ngValue]="false">Pendientes</option>
                <option [ngValue]="true">Completadas</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
              <select [(ngModel)]="filters.priority_id" (change)="applyFilters()" class="input-field">
                <option [ngValue]="undefined">Todas</option>
                @for (priority of priorities(); track priority.id) {
                  <option [ngValue]="priority.id">{{ priority.name }}</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Etiqueta</label>
              <select [(ngModel)]="filters.tag_id" (change)="applyFilters()" class="input-field">
                <option [ngValue]="undefined">Todas</option>
                @for (tag of tags(); track tag.id) {
                  <option [ngValue]="tag.id">{{ tag.name }}</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select [(ngModel)]="filters.sort_by" (change)="applyFilters()" class="input-field">
                <option value="created_at">Fecha de creación</option>
                <option value="due_date">Fecha límite</option>
                <option value="title">Título</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Task List -->
        @if (isLoading()) {
          <div class="text-center py-12">
            <p class="text-gray-500">Cargando tareas...</p>
          </div>
        } @else if (tasks().length === 0) {
          <div class="bg-white rounded-lg shadow-md p-12 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay tareas</h3>
            <p class="text-gray-600 mb-6">Comienza creando tu primera tarea</p>
            <button (click)="showTaskForm.set(true)" class="btn-primary">
              Crear Tarea
            </button>
          </div>
        } @else {
          <div class="space-y-4">
            @for (task of tasks(); track task.id) {
              <app-task-item
                [task]="task"
                (toggleComplete)="onToggleComplete($event)"
                (edit)="onEditTask($event)"
                (delete)="onDeleteTask($event)"
              />
            }
          </div>
        }
      </main>
    </div>

    <!-- Task Form Modal -->
    @if (showTaskForm()) {
      <app-task-form
        [task]="selectedTask()"
        [priorities]="priorities()"
        [tags]="tags()"
        (close)="closeTaskForm()"
        (save)="onSaveTask($event)"
      />
    }
  `
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  priorities = signal<Priority[]>([]);
  tags = signal<Tag[]>([]);
  currentUser = signal(this.authService.getCurrentUserValue());
  isLoading = signal(false);
  showTaskForm = signal(false);
  selectedTask = signal<Task | null>(null);

  filters = {
    is_completed: undefined as boolean | undefined,
    priority_id: undefined as number | undefined,
    tag_id: undefined as number | undefined,
    sort_by: 'created_at',
    sort_order: 'desc' as 'asc' | 'desc'
  };

  constructor(
    private taskService: TaskService,
    private priorityService: PriorityService,
    private tagService: TagService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadPriorities();
    this.loadTags();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks(this.filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.tasks.set(response.data.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadPriorities(): void {
    this.priorityService.getPriorities().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.priorities.set(response.data);
        }
      }
    });
  }

  loadTags(): void {
    this.tagService.getTags().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.tags.set(response.data);
        }
      }
    });
  }

  applyFilters(): void {
    this.loadTasks();
  }

  onToggleComplete(taskId: number): void {
    this.taskService.toggleComplete(taskId).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error toggling task:', error);
      }
    });
  }

  onEditTask(task: Task): void {
    this.selectedTask.set(task);
    this.showTaskForm.set(true);
  }

  onDeleteTask(taskId: number): void {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  onSaveTask(taskData: any): void {
    if (this.selectedTask()) {
      // Update existing task
      this.taskService.updateTask(this.selectedTask()!.id, taskData).subscribe({
        next: () => {
          this.closeTaskForm();
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    } else {
      // Create new task
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.closeTaskForm();
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
    }
  }

  closeTaskForm(): void {
    this.showTaskForm.set(false);
    this.selectedTask.set(null);
  }

  logout(): void {
    this.authService.logout();
  }
}