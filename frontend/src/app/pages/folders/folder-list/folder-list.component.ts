import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FolderService } from '../../../services/folder.service';
import { Folder } from '../../../models/folder';

@Component({
  selector: 'app-folder-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.css']
})
export class FolderListComponent implements OnInit {
  private folderService = inject(FolderService);

  folders: Folder[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadFolders();
  }

  loadFolders(): void {
    this.isLoading = true;
    this.folderService.getFolders().subscribe({
      next: (response) => {
        this.folders = response.folders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar carpetas:', error);
        this.isLoading = false;
      }
    });
  }

  deleteFolder(folderId: number, event: Event): void {
    event.stopPropagation();
    
    if (confirm('¿Estás seguro de que deseas eliminar esta carpeta? Las tareas dentro se mantendrán sin carpeta.')) {
      this.folderService.deleteFolder(folderId).subscribe({
        next: () => {
          this.loadFolders();
        },
        error: (error) => {
          console.error('Error al eliminar carpeta:', error);
          alert('Error al eliminar la carpeta');
        }
      });
    }
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

  getCompletionPercentage(folder: Folder): number {
    if (!folder.total_tareas || folder.total_tareas === 0) return 0;
    return Math.round(((folder.tareas_completadas || 0) / folder.total_tareas) * 100);
  }
}