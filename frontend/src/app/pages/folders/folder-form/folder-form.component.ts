import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FolderService } from '../../../services/folder.service';
import { FOLDER_ICONS, FOLDER_COLORS } from '../../../models/folder';

@Component({
  selector: 'app-folder-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './folder-form.component.html',
  styleUrls: ['./folder-form.component.css']
})
export class FolderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private folderService = inject(FolderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  folderForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  folderId: number | null = null;
  errorMessage = '';

  availableIcons = FOLDER_ICONS;
  availableColors = FOLDER_COLORS;

  constructor() {
    this.folderForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      color: ['#3B82F6', Validators.required],
      icono: ['folder', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.folderId = +params['id'];
        this.loadFolder();
      }
    });
  }

  loadFolder(): void {
    if (!this.folderId) return;

    this.isLoading = true;
    this.folderService.getFolderById(this.folderId).subscribe({
      next: (response) => {
        const folder = response.folder;
        this.folderForm.patchValue({
          nombre: folder.nombre,
          descripcion: folder.descripcion,
          color: folder.color,
          icono: folder.icono
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar carpeta:', error);
        this.errorMessage = 'Error al cargar la carpeta';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.folderForm.invalid) {
      this.markFormGroupTouched(this.folderForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const folderData = this.folderForm.value;

    if (this.isEditMode && this.folderId) {
      // Actualizar carpeta existente
      this.folderService.updateFolder(this.folderId, folderData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/folders']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar carpeta';
        }
      });
    } else {
      // Crear nueva carpeta
      this.folderService.createFolder(folderData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/folders']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear carpeta';
        }
      });
    }
  }

  selectColor(color: string): void {
    this.folderForm.patchValue({ color });
  }

  selectIcon(icon: string): void {
    this.folderForm.patchValue({ icono: icon });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get nombre() { return this.folderForm.get('nombre'); }
  get descripcion() { return this.folderForm.get('descripcion'); }
  get color() { return this.folderForm.get('color'); }
  get icono() { return this.folderForm.get('icono'); }

  getSelectedIconEmoji(): string {
    const iconName = this.icono?.value;
    const icon = this.availableIcons.find(i => i.name === iconName);
    return icon?.emoji || '📁';
  }
}