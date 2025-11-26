import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { FolderService } from '../../../services/folder.service';
import { Folder } from '../../../models/folder';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private folderService = inject(FolderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  taskId: number | null = null;
  errorMessage = '';
  selectedFiles: File[] = [];
  etiquetas: string[] = [];
  newEtiqueta = '';
  folders: Folder[] = [];

  constructor() {
    this.taskForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      prioridad: ['media', Validators.required],
      fecha_vencimiento: [''],
      enlace: [''],
      carpeta_id: ['']
    });
  }

  ngOnInit(): void {
    this.loadFolders();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask();
      }
    });

    // Si viene de una carpeta específica, preseleccionarla
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['folder']) {
        this.taskForm.patchValue({ carpeta_id: +queryParams['folder'] });
      }
    });
  }

  loadFolders(): void {
    this.folderService.getFolders().subscribe({
      next: (response) => {
        this.folders = response.folders;
      },
      error: (error) => {
        console.error('Error al cargar carpetas:', error);
      }
    });
  }

  loadTask(): void {
    if (!this.taskId) return;

    this.isLoading = true;
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (response) => {
        const task = response.task;
        this.taskForm.patchValue({
          titulo: task.titulo,
          descripcion: task.descripcion,
          prioridad: task.prioridad,
          fecha_vencimiento: task.fecha_vencimiento,
          enlace: task.enlace,
          carpeta_id: task.carpeta_id || ''
        });
        this.etiquetas = task.etiquetas || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar tarea:', error);
        this.errorMessage = 'Error al cargar la tarea';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  addEtiqueta(): void {
    if (this.newEtiqueta.trim() && !this.etiquetas.includes(this.newEtiqueta.trim())) {
      this.etiquetas.push(this.newEtiqueta.trim());
      this.newEtiqueta = '';
    }
  }

  removeEtiqueta(index: number): void {
    this.etiquetas.splice(index, 1);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.markFormGroupTouched(this.taskForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const taskData = {
      ...this.taskForm.value,
      etiquetas: this.etiquetas
    };

    if (this.isEditMode && this.taskId) {
      // Actualizar tarea existente
      this.taskService.updateTask(this.taskId, taskData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/tasks', this.taskId]);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar tarea';
        }
      });
    } else {
      // Crear nueva tarea
      if (this.selectedFiles.length > 0) {
        this.taskService.createTaskWithFiles(taskData, this.selectedFiles).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Error al crear tarea';
          }
        });
      } else {
        this.taskService.createTask(taskData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Error al crear tarea';
          }
        });
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get titulo() { return this.taskForm.get('titulo'); }
  get descripcion() { return this.taskForm.get('descripcion'); }
  get prioridad() { return this.taskForm.get('prioridad'); }
  get fecha_vencimiento() { return this.taskForm.get('fecha_vencimiento'); }
  get enlace() { return this.taskForm.get('enlace'); }
}