import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
      
      @if (errorMessage()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="input-field"
            [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            placeholder="correo@ejemplo.com"
          />
          @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
            <p class="text-red-500 text-xs mt-1">Ingresa un correo válido</p>
          }
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="input-field"
            [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            placeholder="••••••••"
          />
          @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
            <p class="text-red-500 text-xs mt-1">La contraseña es requerida</p>
          }
        </div>

        <button
          type="submit"
          [disabled]="loginForm.invalid || isLoading()"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          @if (isLoading()) {
            <span>Cargando...</span>
          } @else {
            <span>Iniciar Sesión</span>
          }
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          ¿No tienes cuenta?
          <a routerLink="/auth/register" class="text-primary-600 hover:text-primary-700 font-medium">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
        );
      }
    });
  }
}