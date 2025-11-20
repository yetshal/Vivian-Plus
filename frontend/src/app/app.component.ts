import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar *ngIf="showNavbar"></app-navbar>
      <main [class.pt-0]="!showNavbar">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  showNavbar = false;

  ngOnInit(): void {
    // Escuchar cambios de ruta para mostrar/ocultar navbar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Ocultar navbar en rutas de autenticación
      this.showNavbar = !event.url.includes('/auth');
    });

    // Verificar estado inicial
    this.showNavbar = !this.router.url.includes('/auth');
  }
}