import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Redirigir raíz a dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Rutas de Autenticación (públicas)
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Rutas del Dashboard (protegidas)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/dashboard/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Rutas de Tareas (protegidas)
  {
    path: 'tasks',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent)
      }
    ]
  },

  // Rutas de Carpetas (protegidas)
  {
    path: 'folders',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/folders/folder-list/folder-list.component').then(m => m.FolderListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/folders/folder-form/folder-form.component').then(m => m.FolderFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/folders/folder-form/folder-form.component').then(m => m.FolderFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/folders/folder-detail/folder-detail.component').then(m => m.FolderDetailComponent)
      }
    ]
  },

  // Ruta 404
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];