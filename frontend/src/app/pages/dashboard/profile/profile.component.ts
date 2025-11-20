import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  userProfile: UserProfile | null = null;
  isLoading = true;
  isUpdating = false;
  isChangingPassword = false;
  successMessage = '';
  errorMessage = '';
  showCurrentPassword = false;
  showNewPassword = false;

  constructor() {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.userProfile = response;
        this.profileForm.patchValue({
          nombre: response.user.nombre
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isUpdating = true;
    this.successMessage = '';
    this.errorMessage = '';

    const nombre = this.profileForm.value.nombre;

    this.userService.updateProfile(nombre).subscribe({
      next: () => {
        this.isUpdating = false;
        this.successMessage = 'Perfil actualizado exitosamente';
        this.loadProfile();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = error.error?.message || 'Error al actualizar perfil';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isChangingPassword = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.successMessage = 'Contraseña cambiada exitosamente';
        this.passwordForm.reset();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.isChangingPassword = false;
        this.errorMessage = error.error?.message || 'Error al cambiar contraseña';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  deleteAccount(): void {
    const password = prompt('Para eliminar tu cuenta, ingresa tu contraseña:');
    
    if (!password) return;

    if (confirm('¿Estás COMPLETAMENTE seguro? Esta acción no se puede deshacer.')) {
      this.userService.deleteAccount(password).subscribe({
        next: () => {
          alert('Tu cuenta ha sido eliminada');
          this.authService.logout();
        },
        error: (error) => {
          alert(error.error?.message || 'Error al eliminar cuenta');
        }
      });
    }
  }

  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get nombre() { return this.profileForm.get('nombre'); }
  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  get userInitials(): string {
    if (!this.userProfile) return '';
    const names = this.userProfile.user.nombre.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
  }
}