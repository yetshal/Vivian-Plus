import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Crear Cuenta</h2>
      
      @if (errorMessage()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="input-field"
            [class.border-red-500]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
            placeholder="Juan Pérez"
          />
          @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
            <p class="text-red-500 text-xs mt-1">El nombre es requerido</p>
          }
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="input-field"
            [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            placeholder="correo@ejemplo.com"
          />
          @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
            <p class="text-red-500 text-xs mt-1">Ingresa un correo válido</p>
          }
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="input-field"
            [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            placeholder="••••••••"
          />
          @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
            <p class="text-red-500 text-xs mt-1">Mínimo 8 caracteres</p>
          }
        </div>

        <div class="mb-6">
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="password_confirmation"
            formControlName="password_confirmation"
            class="input-field"
            [class.border-red-500]="registerForm.get('password_confirmation')?.invalid && registerForm.get('password_confirmation')?.touched"
            placeholder="••••••••"
          />
          @if (registerForm.get('password_confirmation')?.invalid && registerForm.get('password_confirmation')?.touched) {
            <p class="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
          }
        </div>

        <button
          type="submit"
          [disabled]="registerForm.invalid || isLoading()"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          @if (isLoading()) {
            <span>Creando cuenta...</span>
          } @else {
            <span>Registrarse</span>
          }
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          ¿Ya tienes cuenta?
          <a routerLink="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium">
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('password_confirmation');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Error al crear la cuenta. Intenta nuevamente.'
        );
      }
    });
  }
}